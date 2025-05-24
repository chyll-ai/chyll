// @ts-ignore
import OpenAI from 'npm:openai@4.24.1';

declare const Deno: {
  env: {
    get: (key: string) => string | undefined;
  };
};

interface EmailContext {
  type: 'cold_email' | 'followup';
  lead: {
    full_name: string;
    job_title?: string;
    company?: string;
    industry?: string;
    linkedin_url?: string;
  };
  user: {
    full_name: string;
    job_title?: string;
    company_name?: string;
    industry?: string;
    value_proposition?: string;
    target_industries?: string[];
    expertise_areas?: string[];
    achievements?: string[];
    company_description?: string;
    unique_selling_points?: string[];
    preferred_meeting_duration?: string;
  };
  previousContact?: {
    daysSince?: number;
    lastEmailSubject?: string;
  };
}

export const generateEmailContent = async (context: EmailContext): Promise<string> => {
  const openai = new OpenAI({
    apiKey: Deno.env.get('OPENAI_API_KEY')
  });

  const systemPrompt = `You are an expert in writing professional French business emails. 
Your task is to write a personalized ${context.type === 'cold_email' ? 'first contact' : 'follow-up'} email.
The tone should be professional yet friendly, and the content should be concise and engaging.

The email should be in French and follow these guidelines:
- Keep it under 150 words
- Be polite and respectful
- Focus on value proposition and relevance to the recipient's industry/role
- Include a clear call to action (usually requesting a meeting)
- Use formal French business etiquette
- Do not use exclamation marks
- Do not be too pushy
- Use proper French formatting and signatures
- Mention specific, relevant aspects of both the sender's and recipient's backgrounds
- If the sender's expertise/industry aligns with the recipient's, highlight this connection
- If the sender has achievements or experience relevant to the recipient's industry, incorporate this naturally
- Keep the tone professional but warm
- Make the value proposition clear and specific to the recipient's context`;

  const userPrompt = context.type === 'cold_email' 
    ? `Write a first contact email with the following context:

SENDER INFORMATION:
- Name: ${context.user.full_name}
- Role: ${context.user.job_title || 'Professional'}
- Company: ${context.user.company_name || 'their company'}
${context.user.company_description ? `- Company Description: ${context.user.company_description}` : ''}
${context.user.industry ? `- Industry: ${context.user.industry}` : ''}
${context.user.value_proposition ? `- Value Proposition: ${context.user.value_proposition}` : ''}
${context.user.expertise_areas?.length ? `- Areas of Expertise: ${context.user.expertise_areas.join(', ')}` : ''}
${context.user.achievements?.length ? `- Key Achievements: ${context.user.achievements.join(', ')}` : ''}
${context.user.unique_selling_points?.length ? `- Unique Selling Points: ${context.user.unique_selling_points.join(', ')}` : ''}
${context.user.preferred_meeting_duration ? `- Preferred Meeting Duration: ${context.user.preferred_meeting_duration}` : ''}

RECIPIENT INFORMATION:
- Name: ${context.lead.full_name}
- Role: ${context.lead.job_title || 'Professional'}
- Company: ${context.lead.company || 'their company'}
${context.lead.industry ? `- Industry: ${context.lead.industry}` : ''}
${context.lead.linkedin_url ? `- LinkedIn: ${context.lead.linkedin_url}` : ''}

OBJECTIVE:
- Establish professional connection
- Highlight relevant expertise and value proposition
- Request a brief meeting to discuss potential synergies
${context.user.preferred_meeting_duration ? `- Suggest a ${context.user.preferred_meeting_duration} meeting` : ''}

Use this information to craft a personalized email that demonstrates understanding of the recipient's context and clearly communicates the potential value of connecting.`
    : `Write a follow-up email with the following context:

SENDER INFORMATION:
- Name: ${context.user.full_name}
- Role: ${context.user.job_title || 'Professional'}
- Company: ${context.user.company_name || 'their company'}
${context.user.value_proposition ? `- Value Proposition: ${context.user.value_proposition}` : ''}

RECIPIENT INFORMATION:
- Name: ${context.lead.full_name}
- Role: ${context.lead.job_title || 'Professional'}
- Company: ${context.lead.company || 'their company'}

PREVIOUS CONTACT:
- Last Email: ${context.previousContact?.daysSince ? `Sent ${context.previousContact.daysSince} days ago` : 'Recently'}
- Subject: ${context.previousContact?.lastEmailSubject || 'Professional contact'}

OBJECTIVE:
- Gentle reminder
- Maintain professional interest
- Reiterate value proposition briefly
- Request meeting response`;

  const completion = await openai.chat.completions.create({
    model: "gpt-4-1106-preview",
    messages: [
      { role: "system", content: systemPrompt },
      { role: "user", content: userPrompt }
    ],
    temperature: 0.7,
    max_tokens: 500
  });

  return completion.choices[0].message.content || '';
}; 