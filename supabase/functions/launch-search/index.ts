
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

    // Generate 30 fake leads with comprehensive data
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
    
    const jobTitles = ["CEO", "CTO", "VP Engineering", "Head of Product", "Lead Developer", "Product Manager", "Engineering Manager"];
    
    const pipelineStages = ["prospect", "qualified", "proposal", "negotiation", "closed_won", "closed_lost"];
    
    const skills = [
      ["JavaScript", "React", "Node.js"],
      ["Python", "Django", "PostgreSQL"],
      ["Java", "Spring", "AWS"],
      ["Go", "Docker", "Kubernetes"],
      ["TypeScript", "Vue.js", "GraphQL"]
    ];

    const leads = Array.from({ length: 30 }).map((_, index) => {
      const firstName = firstNames[Math.floor(Math.random() * firstNames.length)];
      const lastName = lastNames[Math.floor(Math.random() * lastNames.length)];
      const fullName = `${firstName} ${lastName}`;
      const company = companies[Math.floor(Math.random() * companies.length)];
      const email = `${firstName.toLowerCase()}.${lastName.toLowerCase()}@${company.toLowerCase()}.com`;
      const location = filters?.location || cities[Math.floor(Math.random() * cities.length)];
      const jobTitle = jobTitles[Math.floor(Math.random() * jobTitles.length)];
      const selectedSkills = skills[Math.floor(Math.random() * skills.length)];

      return {
        client_id: client_id,
        full_name: fullName,
        job_title: jobTitle,
        email: email,
        company: company,
        location: location,
        phone_number: `+33 6 ${Math.floor(Math.random() * 90) + 10} ${Math.floor(Math.random() * 90) + 10} ${Math.floor(Math.random() * 90) + 10} ${Math.floor(Math.random() * 90) + 10}`,
        status: 'à contacter',
        
        // Professional details
        experience_years: Math.floor(Math.random() * 15) + 3,
        headline: `${jobTitle} at ${company} | Tech Leadership & Innovation`,
        summary: `Experienced ${jobTitle.toLowerCase()} with ${Math.floor(Math.random() * 15) + 3} years in tech industry. Passionate about building scalable solutions and leading high-performing teams.`,
        skills: JSON.stringify(selectedSkills),
        languages: JSON.stringify(["French", "English"]),
        
        // Company information
        job_company_industry: "Technology",
        job_company_size: Math.random() > 0.5 ? "51-200" : "201-500",
        job_company_website: `https://${company.toLowerCase()}.com`,
        job_seniority: "Senior",
        job_start_date: "2022-01-01",
        job_location: location,
        job_company_employees_count: Math.floor(Math.random() * 500) + 50,
        job_company_founded_year: Math.floor(Math.random() * 20) + 2005,
        
        // Contact information
        linkedin_url: `https://linkedin.com/in/${firstName.toLowerCase()}-${lastName.toLowerCase()}-${Math.floor(Math.random() * 1000)}`,
        github_url: Math.random() > 0.7 ? `https://github.com/${firstName.toLowerCase()}${lastName.toLowerCase()}` : null,
        twitter_url: Math.random() > 0.8 ? `https://twitter.com/${firstName.toLowerCase()}_${lastName.toLowerCase()}` : null,
        
        // Personal details
        birth_year: Math.floor(Math.random() * 20) + 1975,
        gender: Math.random() > 0.5 ? "Male" : "Female",
        city: location.split(",")[0],
        country: "France",
        
        // Social metrics
        linkedin_connections: Math.floor(Math.random() * 1000) + 500,
        linkedin_followers: Math.floor(Math.random() * 500) + 100,
        linkedin_premium: Math.random() > 0.7,
        github_followers: Math.random() > 0.5 ? Math.floor(Math.random() * 100) + 10 : null,
        github_repos: Math.random() > 0.5 ? Math.floor(Math.random() * 50) + 5 : null,
        
        // Sales and pipeline data
        mrr: Math.random() > 0.6 ? Math.floor(Math.random() * 10000) + 1000 : null,
        arr: Math.random() > 0.6 ? Math.floor(Math.random() * 120000) + 12000 : null,
        pipeline_stage: pipelineStages[Math.floor(Math.random() * pipelineStages.length)],
        close_probability: Math.floor(Math.random() * 100),
        expected_close_date: new Date(Date.now() + Math.random() * 90 * 24 * 60 * 60 * 1000).toISOString().split('T')[0],
        last_activity_date: new Date(Date.now() - Math.random() * 30 * 24 * 60 * 60 * 1000).toISOString().split('T')[0],
        
        // Education
        education: JSON.stringify([{
          school: "École Polytechnique",
          degree: "Master of Engineering",
          field: "Computer Science",
          year: "2018"
        }]),
        
        // Technology skills
        technology_skills: JSON.stringify(selectedSkills),
        programming_languages: JSON.stringify(selectedSkills.filter(skill => 
          ["JavaScript", "Python", "Java", "Go", "TypeScript"].includes(skill)
        )),
        frameworks_used: JSON.stringify(selectedSkills.filter(skill => 
          ["React", "Django", "Spring", "Vue.js"].includes(skill)
        )),
        cloud_platforms: JSON.stringify(["AWS", "Azure"].slice(0, Math.floor(Math.random() * 2) + 1)),
        
        // Work preferences
        management_level: jobTitle.includes("CEO") || jobTitle.includes("VP") || jobTitle.includes("Head") ? "Executive" : "Senior",
        departments: JSON.stringify(["Engineering", "Product"]),
        job_functions: JSON.stringify(["Software Development", "Team Leadership"]),
        
        // Interests
        interests: JSON.stringify(["Technology", "Innovation", "Startups", "AI/ML"]),
        investment_interests: JSON.stringify(["SaaS", "B2B Technology", "AI/ML"]),
        
        // Metadata
        enriched_from: { 
          source: 'demo', 
          keyword: keyword, 
          search_id: `demo_${Date.now()}_${index}`,
          timestamp: new Date().toISOString()
        },
        created_at: new Date().toISOString()
      };
    });

    console.log(`Inserting ${leads.length} leads for client ${client_id}`);

    // Insert leads one by one with a small delay
    const insertedLeads = [];
    for (const lead of leads) {
      console.log('Inserting lead:', {
        full_name: lead.full_name,
        client_id: lead.client_id,
        pipeline_stage: lead.pipeline_stage,
        mrr: lead.mrr,
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
        pipeline_stage: data.pipeline_stage,
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
