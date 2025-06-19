
import { supabase } from './supabase';

export const seedDummyData = async (userId: string) => {
  try {
    // First, create or update client profile
    const { data: profile, error: profileError } = await supabase
      .from('client_profile')
      .upsert({
        client_id: userId,
        company_name: 'Tech Innovators Inc.',
        industry: 'SaaS',
        value_prop: 'Helping businesses scale through innovative software solutions',
        icp_title: 'CTO',
        icp_location: 'France',
        icp_size: 'pme',
        is_complete: true,
      })
      .select()
      .single();

    if (profileError) {
      console.error('Error seeding profile:', profileError);
      throw profileError;
    }

    // Check for existing leads to avoid duplicates
    const { data: existingLeads } = await supabase
      .from('leads')
      .select('email')
      .eq('client_id', userId);
    
    const existingEmails = new Set((existingLeads || []).map(lead => lead.email?.toLowerCase()).filter(Boolean));

    // Then, create dummy leads - only add if they don't exist
    const dummyLeads = [
      {
        client_id: userId,
        full_name: 'Sophie Martin',
        job_title: 'CTO',
        company: 'Digital Solutions SA',
        location: 'Paris, France',
        email: 'sophie.martin@example.com',
        linkedin_url: 'https://linkedin.com/in/sophie-martin',
        status: 'new',
        notes: 'Interested in AI solutions'
      },
      {
        client_id: userId,
        full_name: 'Thomas Bernard',
        job_title: 'Head of Technology',
        company: 'InnoTech SARL',
        location: 'Lyon, France',
        email: 'thomas.bernard@example.com',
        linkedin_url: 'https://linkedin.com/in/thomas-bernard',
        status: 'contacted',
        notes: 'Follow up next week'
      },
      {
        client_id: userId,
        full_name: 'Marie Dubois',
        job_title: 'Director of Engineering',
        company: 'TechForward',
        location: 'Bordeaux, France',
        email: 'marie.dubois@example.com',
        linkedin_url: 'https://linkedin.com/in/marie-dubois',
        status: 'new',
        notes: 'Looking for automation solutions'
      },
      {
        client_id: userId,
        full_name: 'Pierre Leroy',
        job_title: 'CTO',
        company: 'StartupFlow',
        location: 'Nantes, France',
        email: 'pierre.leroy@example.com',
        linkedin_url: 'https://linkedin.com/in/pierre-leroy',
        status: 'interested',
        notes: 'Schedule demo next month'
      },
      {
        client_id: userId,
        full_name: 'Claire Moreau',
        job_title: 'Technical Director',
        company: 'DataTech Solutions',
        location: 'Marseille, France',
        email: 'claire.moreau@example.com',
        linkedin_url: 'https://linkedin.com/in/claire-moreau',
        status: 'new',
        notes: 'Expanding tech team'
      }
    ];

    // Filter out leads that already exist
    const newLeads = dummyLeads.filter(lead => 
      lead.email && !existingEmails.has(lead.email.toLowerCase())
    );

    if (newLeads.length > 0) {
      const { error: leadsError } = await supabase
        .from('leads')
        .insert(newLeads);

      if (leadsError) {
        console.error('Error seeding leads:', leadsError);
        throw leadsError;
      }
    }

    return { success: true, profile, leadsCount: newLeads.length, message: `${newLeads.length} new leads added` };
  } catch (error) {
    console.error('Error in seedDummyData:', error);
    throw error;
  }
}; 
