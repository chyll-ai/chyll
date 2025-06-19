
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

    // Comprehensive data arrays for realistic generation
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
      "AlphaCode", "ZenithTech", "PulseLogic", "StreamlineOps", "FutureForge"
    ];

    const cities = ["Paris", "Lyon", "Marseille", "Bordeaux", "Lille", "Toulouse", "Nice", "Strasbourg", "Nantes", "Montpellier"];
    const jobTitles = ["CEO", "CTO", "VP Engineering", "Head of Product", "Lead Developer", "Product Manager", "Engineering Manager", "Data Scientist", "DevOps Engineer"];
    const pipelineStages = ["prospect", "qualified", "proposal", "negotiation", "closed_won", "closed_lost"];
    const industries = ["Technology", "SaaS", "E-commerce", "FinTech", "HealthTech", "EdTech", "IoT"];
    const companySizes = ["1-10", "11-50", "51-200", "201-500", "501-1000", "1000+"];
    const seniorities = ["Junior", "Mid-level", "Senior", "Lead", "Principal", "Director", "VP", "C-level"];
    const managementLevels = ["Individual Contributor", "Team Lead", "Manager", "Director", "VP", "C-Suite"];
    const departments = ["Engineering", "Product", "Sales", "Marketing", "Operations", "Finance", "HR"];
    const programmingLanguages = ["JavaScript", "Python", "Java", "Go", "TypeScript", "C++", "Ruby", "PHP", "Rust", "Kotlin"];
    const frameworks = ["React", "Vue.js", "Angular", "Django", "Spring", "Express", "Flask", "Laravel", "Rails"];
    const cloudPlatforms = ["AWS", "Azure", "Google Cloud", "Digital Ocean", "Heroku"];
    const databases = ["PostgreSQL", "MySQL", "MongoDB", "Redis", "Elasticsearch", "Cassandra"];

    // Generate comprehensive test leads
    const testLeads = Array.from({ length: 15 }).map((_, index) => {
      const firstName = firstNames[Math.floor(Math.random() * firstNames.length)];
      const lastName = lastNames[Math.floor(Math.random() * lastNames.length)];
      const fullName = `${firstName} ${lastName}`;
      const company = companies[Math.floor(Math.random() * companies.length)];
      const email = `${firstName.toLowerCase()}.${lastName.toLowerCase()}@${company.toLowerCase()}.com`;
      const jobTitle = jobTitles[Math.floor(Math.random() * jobTitles.length)];
      const city = cities[Math.floor(Math.random() * cities.length)];
      const industry = industries[Math.floor(Math.random() * industries.length)];
      const companySize = companySizes[Math.floor(Math.random() * companySizes.length)];
      const seniority = seniorities[Math.floor(Math.random() * seniorities.length)];
      
      // Generate skills and tech stacks
      const selectedLanguages = programmingLanguages.slice(0, Math.floor(Math.random() * 4) + 2);
      const selectedFrameworks = frameworks.slice(0, Math.floor(Math.random() * 3) + 1);
      const selectedClouds = cloudPlatforms.slice(0, Math.floor(Math.random() * 2) + 1);
      const selectedDbs = databases.slice(0, Math.floor(Math.random() * 3) + 1);

      return {
        client_id: user.id,
        
        // Basic contact information
        full_name: fullName,
        email: email,
        phone_number: `+33 6 ${Math.floor(Math.random() * 90) + 10} ${Math.floor(Math.random() * 90) + 10} ${Math.floor(Math.random() * 90) + 10} ${Math.floor(Math.random() * 90) + 10}`,
        mobile_phone: `+33 7 ${Math.floor(Math.random() * 90) + 10} ${Math.floor(Math.random() * 90) + 10} ${Math.floor(Math.random() * 90) + 10} ${Math.floor(Math.random() * 90) + 10}`,
        work_phone: Math.random() > 0.7 ? `+33 1 ${Math.floor(Math.random() * 90) + 10} ${Math.floor(Math.random() * 90) + 10} ${Math.floor(Math.random() * 90) + 10} ${Math.floor(Math.random() * 90) + 10}` : null,
        work_email: Math.random() > 0.6 ? `${firstName.toLowerCase()}.${lastName.toLowerCase()}@${company.toLowerCase()}.com` : null,
        personal_emails: JSON.stringify([`${firstName.toLowerCase()}${lastName.toLowerCase()}@gmail.com`]),
        
        // Job information
        job_title: jobTitle,
        company: company,
        location: `${city}, France`,
        job_location: `${city}, France`,
        job_seniority: seniority,
        experience_years: Math.floor(Math.random() * 15) + 3,
        headline: `${jobTitle} at ${company} | ${industry} Innovation Leader`,
        summary: `Experienced ${jobTitle.toLowerCase()} with ${Math.floor(Math.random() * 15) + 3}+ years in ${industry.toLowerCase()}. Passionate about building scalable solutions and driving digital transformation.`,
        
        // Skills and languages
        skills: JSON.stringify([...selectedLanguages, ...selectedFrameworks].slice(0, 6)),
        languages: JSON.stringify(["French", "English", ...(Math.random() > 0.7 ? ["Spanish"] : [])]),
        technology_skills: JSON.stringify([...selectedLanguages, ...selectedFrameworks]),
        programming_languages: JSON.stringify(selectedLanguages),
        frameworks_used: JSON.stringify(selectedFrameworks),
        databases_used: JSON.stringify(selectedDbs),
        cloud_platforms: JSON.stringify(selectedClouds),
        
        // Company details
        job_company_industry: industry,
        job_company_size: companySize,
        job_company_website: `https://${company.toLowerCase()}.com`,
        job_company_founded_year: Math.floor(Math.random() * 25) + 2000,
        job_company_employees_count: Math.floor(Math.random() * 1000) + 50,
        job_company_revenue: Math.random() > 0.5 ? `$${Math.floor(Math.random() * 100) + 10}M` : null,
        job_company_funding: Math.random() > 0.6 ? `Series ${String.fromCharCode(65 + Math.floor(Math.random() * 4))}` : null,
        job_company_tags: JSON.stringify([industry, "B2B", "Software"]),
        job_company_linkedin_url: `https://linkedin.com/company/${company.toLowerCase()}`,
        job_company_twitter_url: Math.random() > 0.6 ? `https://twitter.com/${company.toLowerCase()}` : null,
        job_company_facebook_url: Math.random() > 0.8 ? `https://facebook.com/${company.toLowerCase()}` : null,
        
        // Job history and dates
        job_start_date: new Date(Date.now() - Math.random() * 3 * 365 * 24 * 60 * 60 * 1000).toISOString().split('T')[0],
        job_end_date: Math.random() > 0.8 ? new Date(Date.now() + Math.random() * 365 * 24 * 60 * 60 * 1000).toISOString().split('T')[0] : null,
        job_duration_months: Math.floor(Math.random() * 48) + 6,
        job_description: `Leading ${industry.toLowerCase()} initiatives and managing cross-functional teams to deliver innovative solutions.`,
        job_history: JSON.stringify([{
          company: company,
          title: jobTitle,
          duration: `${Math.floor(Math.random() * 4) + 1} years`,
          description: "Led technical initiatives and team development"
        }]),
        
        // Education
        education: JSON.stringify([{
          school: ["École Polytechnique", "INSA", "Université Paris-Saclay", "CentraleSupélec"][Math.floor(Math.random() * 4)],
          degree: "Master of Engineering",
          field: ["Computer Science", "Software Engineering", "Data Science"][Math.floor(Math.random() * 3)],
          year: (2024 - Math.floor(Math.random() * 15) - 5).toString()
        }]),
        education_history: JSON.stringify(["Master's in Computer Science", "Bachelor's in Engineering"]),
        degree_names: JSON.stringify(["Master of Engineering", "Bachelor of Science"]),
        school_names: JSON.stringify(["École Polytechnique", "Université de Lyon"]),
        major_fields: JSON.stringify(["Computer Science", "Mathematics"]),
        graduation_dates: JSON.stringify(["2020", "2018"]),
        gpa_scores: JSON.stringify(["3.8/4.0"]),
        honors: Math.random() > 0.7 ? JSON.stringify(["Magna Cum Laude"]) : null,
        activities: JSON.stringify(["Programming Club", "Tech Society"]),
        societies: Math.random() > 0.8 ? JSON.stringify(["IEEE", "ACM"]) : null,
        
        // Certifications and achievements
        certifications: Math.random() > 0.6 ? JSON.stringify([`${selectedClouds[0]} Certified`, "Scrum Master"]) : null,
        awards: Math.random() > 0.8 ? JSON.stringify(["Innovation Award 2023"]) : null,
        patents: Math.random() > 0.9 ? JSON.stringify(["US Patent 12345678"]) : null,
        publications: Math.random() > 0.8 ? JSON.stringify(["AI in Software Development - IEEE 2023"]) : null,
        
        // Social media and networking
        linkedin_url: `https://linkedin.com/in/${firstName.toLowerCase()}-${lastName.toLowerCase()}-${Math.floor(Math.random() * 1000)}`,
        github_url: Math.random() > 0.3 ? `https://github.com/${firstName.toLowerCase()}${lastName.toLowerCase()}` : null,
        twitter_url: Math.random() > 0.7 ? `https://twitter.com/${firstName.toLowerCase()}_${lastName.toLowerCase()}` : null,
        facebook_url: Math.random() > 0.8 ? `https://facebook.com/${firstName.toLowerCase()}.${lastName.toLowerCase()}` : null,
        social_profiles: JSON.stringify({
          linkedin: `https://linkedin.com/in/${firstName.toLowerCase()}-${lastName.toLowerCase()}`,
          github: Math.random() > 0.3 ? `https://github.com/${firstName.toLowerCase()}${lastName.toLowerCase()}` : null
        }),
        
        // Social metrics
        linkedin_connections: Math.floor(Math.random() * 2000) + 500,
        linkedin_followers: Math.floor(Math.random() * 1000) + 100,
        linkedin_premium: Math.random() > 0.6,
        linkedin_verified: Math.random() > 0.8,
        github_followers: Math.random() > 0.3 ? Math.floor(Math.random() * 200) + 10 : null,
        github_following: Math.random() > 0.3 ? Math.floor(Math.random() * 100) + 5 : null,
        github_repos: Math.random() > 0.3 ? Math.floor(Math.random() * 80) + 5 : null,
        twitter_followers: Math.random() > 0.7 ? Math.floor(Math.random() * 500) + 50 : null,
        twitter_following: Math.random() > 0.7 ? Math.floor(Math.random() * 300) + 20 : null,
        facebook_friends: Math.random() > 0.8 ? Math.floor(Math.random() * 800) + 100 : null,
        recommendations_received: Math.floor(Math.random() * 20) + 2,
        recommendations_given: Math.floor(Math.random() * 15) + 1,
        
        // Personal information
        birth_year: Math.floor(Math.random() * 25) + 1975,
        birth_date: Math.random() > 0.7 ? `${Math.floor(Math.random() * 25) + 1975}-${String(Math.floor(Math.random() * 12) + 1).padStart(2, '0')}-${String(Math.floor(Math.random() * 28) + 1).padStart(2, '0')}` : null,
        gender: Math.random() > 0.5 ? "Male" : "Female",
        street_address: `${Math.floor(Math.random() * 200) + 1} Rue de la ${["Paix", "République", "Liberté", "Innovation"][Math.floor(Math.random() * 4)]}`,
        city: city,
        state: "Île-de-France",
        postal_code: `${Math.floor(Math.random() * 90000) + 10000}`,
        country: "France",
        time_zone: "Europe/Paris",
        
        // Interests and lifestyle
        interests: JSON.stringify(["Technology", "Innovation", "Startups", "AI/ML", "Open Source"]),
        lifestyle_interests: JSON.stringify(["Travel", "Photography", "Cycling", "Reading"]),
        industry_experience: JSON.stringify([industry, "Software Development", "Digital Transformation"]),
        investment_interests: JSON.stringify(["SaaS", "B2B Technology", "AI/ML", "FinTech"]),
        
        // Work and management
        management_level: managementLevels[Math.floor(Math.random() * managementLevels.length)],
        departments: JSON.stringify([departments[Math.floor(Math.random() * departments.length)]]),
        subdepartments: JSON.stringify(["Software Engineering", "Product Development"]),
        job_functions: JSON.stringify(["Software Development", "Team Leadership", "Architecture"]),
        
        // Tools and software
        software_proficiency: JSON.stringify(["VS Code", "IntelliJ", "Git", "Docker", "Kubernetes"]),
        project_management_tools: JSON.stringify([["Jira", "Trello", "Asana"][Math.floor(Math.random() * 3)]]),
        design_tools: Math.random() > 0.6 ? JSON.stringify(["Figma", "Sketch"]) : null,
        marketing_tools: Math.random() > 0.8 ? JSON.stringify(["HubSpot", "Mailchimp"]) : null,
        sales_tools: Math.random() > 0.7 ? JSON.stringify(["Salesforce", "Pipedrive"]) : null,
        communication_tools: JSON.stringify(["Slack", "Microsoft Teams", "Zoom"]),
        
        // Technology preferences
        mobile_devices: JSON.stringify([["iPhone", "Android"][Math.floor(Math.random() * 2)]]),
        operating_systems: JSON.stringify(["macOS", "Linux", "Windows"].slice(0, Math.floor(Math.random() * 2) + 1)),
        browser_preferences: JSON.stringify([["Chrome", "Firefox", "Safari"][Math.floor(Math.random() * 3)]]),
        
        // Personal preferences and lifestyle
        shopping_preferences: JSON.stringify(["Online", "Tech gadgets", "Books"]),
        travel_preferences: JSON.stringify(["Business travel", "Tech conferences", "European destinations"]),
        media_consumption: JSON.stringify(["Tech blogs", "Podcasts", "LinkedIn articles"]),
        work_preferences: JSON.stringify(["Remote work", "Flexible hours", "Innovation time"]),
        
        // Family and personal life
        family_status: ["Single", "Married", "In a relationship"][Math.floor(Math.random() * 3)],
        children_count: Math.random() > 0.6 ? Math.floor(Math.random() * 3) : null,
        pet_ownership: Math.random() > 0.7 ? JSON.stringify([["Dog", "Cat"][Math.floor(Math.random() * 2)]]) : null,
        home_ownership: Math.random() > 0.5 ? "Owner" : "Renter",
        vehicle_ownership: JSON.stringify(Math.random() > 0.3 ? ["Car"] : []),
        
        // Health and wellness
        health_interests: JSON.stringify(["Fitness", "Nutrition", "Mental wellness"]),
        fitness_activities: JSON.stringify(["Running", "Cycling", "Gym", "Yoga"].slice(0, Math.floor(Math.random() * 3) + 1)),
        dietary_preferences: Math.random() > 0.8 ? JSON.stringify(["Vegetarian", "Organic"]) : null,
        environmental_interests: JSON.stringify(["Sustainability", "Green tech", "Renewable energy"]),
        
        // Professional networking and achievements
        volunteer_work: Math.random() > 0.7 ? JSON.stringify(["Tech mentorship", "Open source contributions"]) : null,
        personality_traits: JSON.stringify(["Analytical", "Creative", "Leadership", "Problem-solving"]),
        
        // Financial and business
        salary_range: `€${Math.floor(Math.random() * 80) + 60}K - €${Math.floor(Math.random() * 50) + 100}K`,
        net_worth: Math.random() > 0.8 ? `€${Math.floor(Math.random() * 500) + 200}K` : null,
        
        // Sales and pipeline data
        mrr: Math.random() > 0.4 ? Math.floor(Math.random() * 15000) + 2000 : null,
        arr: Math.random() > 0.4 ? Math.floor(Math.random() * 180000) + 24000 : null,
        pipeline_stage: pipelineStages[Math.floor(Math.random() * pipelineStages.length)],
        close_probability: Math.floor(Math.random() * 100),
        expected_close_date: new Date(Date.now() + Math.random() * 180 * 24 * 60 * 60 * 1000).toISOString().split('T')[0],
        last_activity_date: new Date(Date.now() - Math.random() * 30 * 24 * 60 * 60 * 1000).toISOString().split('T')[0],
        
        // Status and metadata
        status: ['new', 'contacted', 'qualified', 'à relancer', 'interested'][Math.floor(Math.random() * 5)],
        enriched_from: { 
          source: 'test_data_comprehensive', 
          keyword: 'test_seed',
          search_id: `test_${Date.now()}_${index}`,
          timestamp: new Date().toISOString(),
          comprehensive: true
        },
        created_at: new Date().toISOString(),
        updated_at: new Date().toISOString(),
        last_contact_date: Math.random() > 0.8 ? new Date(Date.now() - Math.random() * 60 * 24 * 60 * 60 * 1000).toISOString() : null
      };
    });

    // Filter out leads that already exist
    const newLeads = testLeads.filter(lead => 
      lead.email && !existingEmails.has(lead.email.toLowerCase())
    );

    if (newLeads.length === 0) {
      console.log('All comprehensive test leads already exist');
      return { message: 'All comprehensive test leads already exist', count: 0 };
    }

    // Insert only new leads
    const { data, error } = await supabase
      .from('leads')
      .insert(newLeads)
      .select();

    if (error) {
      console.error('Error seeding comprehensive data:', error);
      throw error;
    }

    console.log('Comprehensive test data seeded successfully:', data);
    return { message: `${newLeads.length} comprehensive test leads added`, data, count: newLeads.length };
    
  } catch (error) {
    console.error('Error in seedWorkspaceData:', error);
    throw error;
  }
};
