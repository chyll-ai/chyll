// @deno-types="https://deno.land/std@0.168.0/http/server.ts"
import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
// @deno-types="https://esm.sh/@supabase/supabase-js@2.49.4"
import { createClient } from 'https://esm.sh/@supabase/supabase-js@2.49.4';

interface RequestEvent {
  request: Request;
}

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

const supabaseUrl = Deno.env.get('SUPABASE_URL')!;
const supabaseServiceKey = Deno.env.get('SUPABASE_SERVICE_ROLE_KEY')!;

// Create Supabase client with service role for bypassing RLS
const supabase = createClient(supabaseUrl, supabaseServiceKey);

serve(async (req: Request) => {
  // Handle CORS preflight requests
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders });
  }

  if (req.method !== 'POST') {
    return new Response(JSON.stringify({ error: 'Method not allowed' }), {
      status: 405,
      headers: { ...corsHeaders, 'Content-Type': 'application/json' }
    });
  }

  try {
    const requestData = await req.json();
    const { keyword, filters, client_id } = requestData;

    console.log("Launch search request:", { keyword, filters, client_id });

    // Generate 30 fake leads
    const firstNames = [
      "Alice", "Julien", "Sophie", "Lucas", "Emma", "Thomas", "Marie", "Pierre", 
      "Camille", "Nicolas", "Laura", "Antoine", "Chloe", "Maxime", "Sarah", 
      "Romain", "Julie", "Alexandre", "Léa", "Mathieu", "Clara", "Adrien",
      "Manon", "Benjamin", "Océane", "Florian", "Morgane", "Quentin", "Pauline", "Vincent"
    ];

    const lastNames = [
      "Dupont", "Bernard", "Morel", "Leroy", "Giraud", "Fontaine", "Rousseau", 
      "Blanc", "Guerin", "Muller", "Henry", "Roussel", "Nicolas", "Perrin", 
      "Morin", "Mathieu", "Clement", "Gauthier", "Durand", "Lefebvre", "Laurent", 
      "Michel", "Garcia", "David", "Bertrand", "Roux", "Vincent", "Fournier", "Moreau", "Simon"
    ];

    const companies = [
      "SaaSly", "Growthify", "ScaleSpark", "Sellboost", "TechFlow", "DataSync", 
      "CloudVision", "InnovateLab", "DigitalEdge", "SmartScale", "ProActive", 
      "NextGen", "FlexiSoft", "CoreTech", "VelocityApp", "MindShift", "BlueChip",
      "AlphaCode", "ZenithTech", "PulseLogic", "StreamlineOps", "FutureForge",
      "QuantumLeap", "PrimeTech", "ElevateAI", "CatalystCorp", "NovaSoft", "ApexSystems"
    ];

    const cities = ["Paris", "Lyon", "Marseille", "Bordeaux", "Lille", "Toulouse", "Nice", "Strasbourg"];

    const leads = Array.from({ length: 30 }).map((_, index) => {
      const firstName = firstNames[Math.floor(Math.random() * firstNames.length)];
      const lastName = lastNames[Math.floor(Math.random() * lastNames.length)];
      const fullName = `${firstName} ${lastName}`;
      const company = companies[Math.floor(Math.random() * companies.length)];
      const email = `${firstName.toLowerCase()}.${lastName.toLowerCase()}@${company.toLowerCase()}.com`;
      const location = filters?.location || cities[Math.floor(Math.random() * cities.length)];

      return {
        client_id: client_id,
        full_name: fullName,
        job_title: 'CEO',
        email: email,
        company: company,
        location: location,
        status: 'à contacter',
        enriched_from: { source: 'demo', keyword: keyword, search_id: `demo_${Date.now()}_${index}` },
        created_at: new Date().toISOString(),
        linkedin_url: `https://linkedin.com/in/${firstName.toLowerCase()}-${lastName.toLowerCase()}-${Math.floor(Math.random() * 1000)}`
      };
    });

    console.log(`Inserting ${leads.length} leads for client ${client_id}`);

    // Insert leads one by one with a small delay
    const insertedLeads = [];
    for (const lead of leads) {
      console.log('Inserting lead:', {
        full_name: lead.full_name,
        client_id: lead.client_id,
        timestamp: new Date().toISOString()
      });

      const { data, error } = await supabase
        .from('leads')
        .insert([lead])
        .select()
        .single();

      if (error) {
        console.error("Error inserting lead:", {
          error: error.message,
          lead: lead.full_name,
          timestamp: new Date().toISOString()
        });
        continue;
      }

      console.log('Successfully inserted lead:', {
        id: data.id,
        full_name: data.full_name,
        timestamp: new Date().toISOString()
      });

      insertedLeads.push(data);
      
      // Add a larger delay between inserts to ensure real-time events are processed
      await new Promise(resolve => setTimeout(resolve, 500));
    }

    console.log(`Successfully inserted ${insertedLeads.length} demo leads:`, {
      firstLead: insertedLeads[0]?.full_name,
      lastLead: insertedLeads[insertedLeads.length - 1]?.full_name,
      timestamp: new Date().toISOString()
    });

    return new Response(JSON.stringify({ 
      success: true,
      message: `${insertedLeads.length} leads de démonstration générés avec succès`,
      leads_count: insertedLeads.length,
      keyword: keyword,
      location: filters?.location || 'Toute la France'
    }), {
      status: 200,
      headers: { ...corsHeaders, 'Content-Type': 'application/json' }
    });

  } catch (error) {
    console.error('Error in launch-search function:', error instanceof Error ? error.message : 'Unknown error');
    return new Response(JSON.stringify({ error: error instanceof Error ? error.message : 'Unknown error' }), {
      status: 500,
      headers: { ...corsHeaders, 'Content-Type': 'application/json' }
    });
  }
});
