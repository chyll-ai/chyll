
import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
import { createClient } from 'https://esm.sh/@supabase/supabase-js@2.49.4';

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

const supabaseUrl = Deno.env.get('SUPABASE_URL')!;
const supabaseServiceKey = Deno.env.get('SUPABASE_SERVICE_ROLE_KEY')!;

// Create Supabase client with service role for bypassing RLS
const supabase = createClient(supabaseUrl, supabaseServiceKey);

serve(async (req) => {
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

    // Insert leads into the database
    const { data, error } = await supabase
      .from('leads')
      .insert(leads);

    if (error) {
      console.error("Error inserting leads:", error);
      return new Response(JSON.stringify({ error: error.message }), {
        status: 500,
        headers: { ...corsHeaders, 'Content-Type': 'application/json' }
      });
    }

    console.log(`Successfully inserted ${leads.length} demo leads`);

    return new Response(JSON.stringify({ 
      success: true,
      message: `30 leads de démonstration générés avec succès`,
      leads_count: leads.length,
      keyword: keyword,
      location: filters?.location || 'Toute la France'
    }), {
      status: 200,
      headers: { ...corsHeaders, 'Content-Type': 'application/json' }
    });

  } catch (error) {
    console.error('Error in launch-search function:', error);
    return new Response(JSON.stringify({ error: error.message }), {
      status: 500,
      headers: { ...corsHeaders, 'Content-Type': 'application/json' }
    });
  }
});
