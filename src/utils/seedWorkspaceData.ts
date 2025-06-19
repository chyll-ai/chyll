
import { supabase } from '@/lib/supabase';

export const seedWorkspaceData = async () => {
  try {
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) {
      console.error('User not authenticated');
      return;
    }

    // Check if user already has leads to avoid duplicates
    const { data: existingLeads } = await supabase
      .from('leads')
      .select('email')
      .eq('client_id', user.id);
    
    const existingEmails = new Set((existingLeads || []).map(lead => lead.email?.toLowerCase()).filter(Boolean));

    // Core data arrays for realistic generation
    const firstNames = [
      "Alice", "Julien", "Sophie", "Lucas", "Emma", "Thomas", "Marie", "Pierre", 
      "Camille", "Nicolas", "Laura", "Antoine", "Chloe", "Maxime", "Sarah"
    ];

    const lastNames = [
      "Dupont", "Bernard", "Morel", "Leroy", "Giraud", "Fontaine", "Rousseau", 
      "Blanc", "Guerin", "Muller", "Henry", "Roussel", "Nicolas", "Perrin", "Morin"
    ];

    const companies = [
      "SaaSly", "Growthify", "ScaleSpark", "Sellboost", "TechFlow", "DataSync", 
      "CloudVision", "InnovateLab", "DigitalEdge", "SmartScale"
    ];

    const cities = ["Paris", "Lyon", "Marseille", "Bordeaux", "Lille", "Toulouse", "Nice", "Strasbourg"];
    const jobTitles = ["CEO", "CTO", "VP Engineering", "Head of Product", "Lead Developer", "Product Manager"];
    
    // IMPORTANT: Use only these exact status values that match the database constraint
    const validStatuses = ["new", "contacted", "qualified", "interested"];
    const pipelineStages = ["prospect", "qualified", "proposal", "negotiation", "closed_won", "closed_lost"];
    const industries = ["Technology", "SaaS", "E-commerce", "FinTech", "HealthTech"];
    const companySizes = ["1-10", "11-50", "51-200", "201-500", "501-1000"];
    const seniorities = ["Junior", "Mid-level", "Senior", "Lead", "Principal"];
    const languages = ["JavaScript", "Python", "Java", "Go", "TypeScript"];
    const frameworks = ["React", "Vue.js", "Angular", "Django", "Spring"];

    // Generate test leads ensuring ALL 28 core fields are populated
    const testLeads = Array.from({ length: 15 }).map((_, index) => {
      const firstName = firstNames[Math.floor(Math.random() * firstNames.length)];
      const lastName = lastNames[Math.floor(Math.random() * lastNames.length)];
      const company = companies[Math.floor(Math.random() * companies.length)];
      const jobTitle = jobTitles[Math.floor(Math.random() * jobTitles.length)];
      const city = cities[Math.floor(Math.random() * cities.length)];
      const industry = industries[Math.floor(Math.random() * industries.length)];
      
      // Generate dates safely
      const jobStartDate = new Date(Date.now() - Math.random() * 3 * 365 * 24 * 60 * 60 * 1000);
      const expectedCloseDate = new Date(Date.now() + Math.random() * 180 * 24 * 60 * 60 * 1000);
      const lastActivityDate = new Date(Date.now() - Math.random() * 30 * 24 * 60 * 60 * 1000);

      return {
        // === CORE 28 FIELDS - ensuring ALL are populated ===
        
        // 1. client_id (required)
        client_id: user.id,
        
        // 2. full_name (required)
        full_name: `${firstName} ${lastName}`,
        
        // 3. email (required)
        email: `${firstName.toLowerCase()}.${lastName.toLowerCase()}@${company.toLowerCase()}.com`,
        
        // 4. phone_number
        phone_number: `+33 6 ${Math.floor(Math.random() * 90) + 10} ${Math.floor(Math.random() * 90) + 10} ${Math.floor(Math.random() * 90) + 10} ${Math.floor(Math.random() * 90) + 10}`,
        
        // 5. job_title
        job_title: jobTitle,
        
        // 6. company
        company: company,
        
        // 7. location
        location: `${city}, France`,
        
        // 8. linkedin_url
        linkedin_url: `https://linkedin.com/in/${firstName.toLowerCase()}-${lastName.toLowerCase()}-${Math.floor(Math.random() * 1000)}`,
        
        // 9. status
        status: validStatuses[Math.floor(Math.random() * validStatuses.length)],
        
        // 10. created_at
        created_at: new Date().toISOString(),
        
        // 11. updated_at
        updated_at: new Date().toISOString(),
        
        // 12. enriched_from
        enriched_from: { 
          source: 'test_data_28_fields', 
          keyword: 'comprehensive_test',
          search_id: `test_${Date.now()}_${index}`,
          timestamp: new Date().toISOString()
        },
        
        // 13. linkedin_profile_data
        linkedin_profile_data: {
          headline: `${jobTitle} at ${company}`,
          summary: `Experienced ${jobTitle.toLowerCase()} with ${Math.floor(Math.random() * 15) + 3}+ years in ${industry.toLowerCase()}.`,
          experience: [`${company} - ${jobTitle}`],
          skills: languages.slice(0, 3),
          education: [`École Polytechnique - Master of Engineering`],
          languages: ["French", "English"],
          connections: Math.floor(Math.random() * 2000) + 500
        },
        
        // 14. last_contact_date
        last_contact_date: Math.random() > 0.5 ? new Date(Date.now() - Math.random() * 60 * 24 * 60 * 60 * 1000).toISOString() : null,
        
        // 15. experience_years
        experience_years: Math.floor(Math.random() * 15) + 3,
        
        // 16. skills (JSON)
        skills: languages.slice(0, 4),
        
        // 17. languages (JSON)
        languages: ["French", "English"],
        
        // 18. education (JSON)
        education: [{
          school: "École Polytechnique",
          degree: "Master of Engineering",
          field: "Computer Science",
          year: (2024 - Math.floor(Math.random() * 10) - 5).toString()
        }],
        
        // 19. certifications (JSON)
        certifications: [`${languages[0]} Certified`, "Scrum Master"],
        
        // 20. mrr (numeric)
        mrr: Math.floor(Math.random() * 15000) + 2000,
        
        // 21. arr (numeric)
        arr: Math.floor(Math.random() * 180000) + 24000,
        
        // 22. pipeline_stage
        pipeline_stage: pipelineStages[Math.floor(Math.random() * pipelineStages.length)],
        
        // 23. close_probability
        close_probability: Math.floor(Math.random() * 100),
        
        // 24. expected_close_date
        expected_close_date: expectedCloseDate.toISOString().split('T')[0],
        
        // 25. last_activity_date
        last_activity_date: lastActivityDate.toISOString().split('T')[0],
        
        // 26. technology_skills
        technology_skills: languages.slice(0, 3).join(', '),
        
        // 27. software_proficiency
        software_proficiency: JSON.stringify(["VS Code", "Git", "Docker"]),
        
        // 28. programming_languages
        programming_languages: languages.slice(0, 3).join(', '),
        
        // === ADDITIONAL COMPREHENSIVE FIELDS ===
        mobile_phone: `+33 7 ${Math.floor(Math.random() * 90) + 10} ${Math.floor(Math.random() * 90) + 10} ${Math.floor(Math.random() * 90) + 10} ${Math.floor(Math.random() * 90) + 10}`,
        work_email: `${firstName.toLowerCase()}.${lastName.toLowerCase()}@${company.toLowerCase()}.com`,
        personal_emails: JSON.stringify([`${firstName.toLowerCase()}${lastName.toLowerCase()}@gmail.com`]),
        
        // Job information
        job_location: `${city}, France`,
        job_seniority: seniorities[Math.floor(Math.random() * seniorities.length)],
        headline: `${jobTitle} at ${company}`,
        summary: `Experienced ${jobTitle.toLowerCase()} with ${Math.floor(Math.random() * 15) + 3}+ years in ${industry.toLowerCase()}.`,
        
        // Company details
        job_company_industry: industry,
        job_company_size: companySizes[Math.floor(Math.random() * companySizes.length)],
        job_company_website: `https://${company.toLowerCase()}.com`,
        job_company_founded_year: Math.floor(Math.random() * 25) + 2000,
        job_company_employees_count: Math.floor(Math.random() * 1000) + 50,
        job_company_revenue: `$${Math.floor(Math.random() * 100) + 10}M`,
        job_company_linkedin_url: `https://linkedin.com/company/${company.toLowerCase()}`,
        
        // Job dates
        job_start_date: jobStartDate.toISOString().split('T')[0],
        job_duration_months: Math.floor(Math.random() * 48) + 6,
        job_description: `Leading ${industry.toLowerCase()} initiatives and managing teams.`,
        
        // Skills and frameworks
        frameworks_used: frameworks.slice(0, 2).join(', '),
        databases_used: ["PostgreSQL", "MongoDB"].join(', '),
        cloud_platforms: ["AWS", "Azure"].slice(0, 1).join(', '),
        
        // Social media
        github_url: `https://github.com/${firstName.toLowerCase()}${lastName.toLowerCase()}`,
        twitter_url: Math.random() > 0.7 ? `https://twitter.com/${firstName.toLowerCase()}_${lastName.toLowerCase()}` : null,
        social_profiles: JSON.stringify({
          linkedin: `https://linkedin.com/in/${firstName.toLowerCase()}-${lastName.toLowerCase()}`,
          github: `https://github.com/${firstName.toLowerCase()}${lastName.toLowerCase()}`
        }),
        
        // Personal information
        birth_year: Math.floor(Math.random() * 25) + 1975,
        gender: Math.random() > 0.5 ? "Male" : "Female",
        street_address: `${Math.floor(Math.random() * 200) + 1} Rue de la Innovation`,
        city: city,
        state: "Île-de-France",
        postal_code: `${Math.floor(Math.random() * 90000) + 10000}`,
        country: "France",
        time_zone: "Europe/Paris",
        
        // Interests and skills
        interests: JSON.stringify(["Technology", "Innovation", "AI/ML"]),
        lifestyle_interests: JSON.stringify(["Travel", "Photography", "Reading"]),
        industry_experience: JSON.stringify([industry, "Software Development"]),
        
        // Work information
        management_level: ["Individual Contributor", "Manager", "Director"][Math.floor(Math.random() * 3)],
        departments: JSON.stringify(["Engineering"]),
        job_functions: JSON.stringify(["Software Development", "Team Leadership"]),
        job_history: JSON.stringify([{
          company: company,
          title: jobTitle,
          duration: "2 years"
        }]),
        
        // Education details
        education_history: JSON.stringify(["Master's in Computer Science"]),
        degree_names: JSON.stringify(["Master of Engineering"]),
        school_names: JSON.stringify(["École Polytechnique"]),
        major_fields: JSON.stringify(["Computer Science"]),
        graduation_dates: JSON.stringify(["2020"]),
        
        // Social metrics
        linkedin_connections: Math.floor(Math.random() * 2000) + 500,
        linkedin_followers: Math.floor(Math.random() * 1000) + 100,
        linkedin_premium: Math.random() > 0.6,
        github_followers: Math.floor(Math.random() * 200) + 10,
        github_repos: Math.floor(Math.random() * 50) + 5,
        recommendations_received: Math.floor(Math.random() * 20) + 2,
        
        // Tools and preferences
        project_management_tools: JSON.stringify(["Jira"]),
        communication_tools: JSON.stringify(["Slack", "Teams"]),
        mobile_devices: JSON.stringify(["iPhone"]),
        operating_systems: JSON.stringify(["macOS", "Linux"]),
        
        // Personal life
        family_status: ["Single", "Married"][Math.floor(Math.random() * 2)],
        children_count: Math.random() > 0.6 ? Math.floor(Math.random() * 3) : null,
        home_ownership: Math.random() > 0.5 ? "Owner" : "Renter",
        
        // Interests
        health_interests: JSON.stringify(["Fitness", "Nutrition"]),
        fitness_activities: JSON.stringify(["Running", "Cycling"]),
        environmental_interests: JSON.stringify(["Sustainability", "Green tech"]),
        personality_traits: JSON.stringify(["Analytical", "Creative"]),
        work_preferences: JSON.stringify(["Remote work", "Flexible hours"]),
        
        // Financial
        salary_range: `€${Math.floor(Math.random() * 80) + 60}K - €${Math.floor(Math.random() * 50) + 100}K`,
        net_worth: `€${Math.floor(Math.random() * 500) + 200}K`
      };
    });

    // Filter out leads that already exist
    const newLeads = testLeads.filter(lead => 
      lead.email && !existingEmails.has(lead.email.toLowerCase())
    );

    if (newLeads.length === 0) {
      console.log('All test leads already exist');
      return { message: 'All test leads already exist', count: 0 };
    }

    console.log('About to insert leads with these core 28 fields populated:');
    console.log('Sample lead fields:', Object.keys(newLeads[0]).filter(key => [
      'client_id', 'full_name', 'email', 'phone_number', 'job_title', 'company', 
      'location', 'linkedin_url', 'status', 'created_at', 'updated_at', 'enriched_from',
      'linkedin_profile_data', 'last_contact_date', 'experience_years', 'skills', 
      'languages', 'education', 'certifications', 'mrr', 'arr', 'pipeline_stage',
      'close_probability', 'expected_close_date', 'last_activity_date', 'technology_skills',
      'software_proficiency', 'programming_languages'
    ].includes(key)));

    // Insert only new leads
    const { data, error } = await supabase
      .from('leads')
      .insert(newLeads)
      .select();

    if (error) {
      console.error('Error seeding data:', error);
      throw error;
    }

    console.log('Test data seeded successfully with all 28 core fields:', data);
    return { message: `${newLeads.length} test leads added with all 28 core fields`, data, count: newLeads.length };
    
  } catch (error) {
    console.error('Error in seedWorkspaceData:', error);
    throw error;
  }
};
