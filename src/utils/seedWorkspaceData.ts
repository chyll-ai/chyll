
import { supabase } from '@/lib/supabase';

export const seedWorkspaceData = async () => {
  try {
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) {
      console.error('User not authenticated');
      return;
    }

    // Données de test pour les leads
    const testLeads = [
      {
        client_id: user.id,
        full_name: 'Marie Dubois',
        email: 'marie.dubois@techcorp.fr',
        company: 'TechCorp',
        job_title: 'CTO',
        status: 'new',
        linkedin_url: 'https://linkedin.com/in/marie-dubois'
      },
      {
        client_id: user.id,
        full_name: 'Pierre Martin',
        email: 'pierre.martin@saascompany.com',
        company: 'SaaS Company',
        job_title: 'CEO',
        status: 'enriched',
        linkedin_url: 'https://linkedin.com/in/pierre-martin'
      },
      {
        client_id: user.id,
        full_name: 'Julie Lefebvre',
        email: 'julie@startup.io',
        company: 'Startup.io',
        job_title: 'Head of Sales',
        status: 'contacted',
        linkedin_url: 'https://linkedin.com/in/julie-lefebvre'
      },
      {
        client_id: user.id,
        full_name: 'Thomas Rousseau',
        email: 'thomas.rousseau@enterprise.com',
        company: 'Enterprise Corp',
        job_title: 'VP Marketing',
        status: 'à relancer'
      },
      {
        client_id: user.id,
        full_name: 'Sophie Chen',
        email: 'sophie@aicompany.ai',
        company: 'AI Company',
        job_title: 'Product Manager',
        status: 'new'
      }
    ];

    // Insérer les leads de test
    const { data, error } = await supabase
      .from('leads')
      .insert(testLeads)
      .select();

    if (error) {
      console.error('Error seeding data:', error);
      return;
    }

    console.log('Test data seeded successfully:', data);
    return data;
    
  } catch (error) {
    console.error('Error in seedWorkspaceData:', error);
  }
};
