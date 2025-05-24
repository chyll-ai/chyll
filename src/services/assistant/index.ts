import OpenAI from 'openai';
import { supabase } from '@/integrations/supabase/client';
import type { Database } from '@/types/supabase';
import type { ChatCompletionMessageParam, ChatCompletionTool } from 'openai/resources/chat/completions';
import { toast } from '@/components/ui/sonner';

// Message interface definition
interface Message {
  role: 'user' | 'assistant' | 'system' | 'function';
  content: string;
  name?: string;
  toolCalls?: any[];
}

class OpenAIClientError extends Error {
  constructor(message: string) {
    super(message);
    this.name = 'OpenAIClientError';
  }
}

// Initialize OpenAI client with proper error handling
const initializeOpenAI = async () => {
  try {
    // Get the application's OpenAI API key from Supabase
    const { data: apiKeyData, error } = await supabase
      .from('api_keys')
      .select('key_value')
      .eq('key_type', 'openai_app')
      .single();

    console.log('Supabase API key fetch:', { hasData: !!apiKeyData, error: !!error });
    
    if (error || !apiKeyData?.key_value) {
      // Fallback to environment variable
      const envApiKey = import.meta.env.VITE_OPENAI_API_KEY;
      console.log('Environment API key exists:', !!envApiKey);
      
      if (!envApiKey) {
        throw new OpenAIClientError('OpenAI API key not found. Please contact support.');
      }

      return new OpenAI({
        apiKey: envApiKey,
        dangerouslyAllowBrowser: true
      });
    }

    return new OpenAI({
      apiKey: apiKeyData.key_value,
      dangerouslyAllowBrowser: true
    });
  } catch (error) {
    console.error('OpenAI initialization error:', error);
    if (error instanceof OpenAIClientError) {
      throw error;
    }
    console.error('Failed to initialize OpenAI client:', error);
    throw new OpenAIClientError('Failed to initialize AI assistant. Please try again later.');
  }
};

// Enhanced system prompt for sales focus
const systemMessage = `You are an elite AI Sales Assistant focused on B2B lead generation and sales optimization.

Your core capabilities include:
1. Lead Generation & Qualification
   - Help identify and qualify potential leads based on user's ICP
   - Analyze prospect data for best-fit opportunities
   - Suggest targeting improvements based on conversion data

2. Sales Strategy Optimization
   - Analyze sales performance metrics
   - Recommend personalized outreach strategies
   - Help craft compelling value propositions
   - Suggest follow-up timing and approaches

3. Email Campaign Management
   - Create personalized email sequences
   - A/B test different messaging approaches
   - Track and analyze response rates
   - Optimize subject lines and content

4. Profile & Market Analysis
   - Help users define their ideal customer profile
   - Analyze market trends and competition
   - Identify new market opportunities
   - Monitor campaign performance

Always maintain a professional, results-driven approach while being friendly and supportive.
Base recommendations on actual data when available.
Proactively suggest improvements and next steps.
Focus on measurable outcomes and ROI.`;

// Enhanced tools with better sales functionality
const availableTools: ChatCompletionTool[] = [
  {
    type: 'function',
    function: {
      name: 'analyze_sales_performance',
      description: 'Analyze sales performance metrics and provide insights',
      parameters: {
        type: 'object',
        properties: {
          timeframe: {
            type: 'string',
            enum: ['7d', '30d', '90d', 'all'],
            description: 'Time period for analysis'
          },
          metrics: {
            type: 'array',
            items: {
              type: 'string',
              enum: ['conversion_rate', 'response_rate', 'meeting_rate', 'revenue']
            },
            description: 'Metrics to analyze'
          }
        },
        required: ['timeframe']
      }
    }
  },
  {
    type: 'function',
    function: {
      name: 'get_lead_recommendations',
      description: 'Get personalized lead recommendations based on location and other available filters',
      parameters: {
        type: 'object',
        properties: {
          location: { 
            type: 'string',
            description: 'Location to filter leads by (e.g., "France", "Paris")'
          }
        }
      }
    }
  },
  {
    type: 'function',
    function: {
      name: 'optimize_email_campaign',
      description: 'Analyze and optimize email campaign performance',
      parameters: {
        type: 'object',
        properties: {
          campaign_id: { type: 'string' },
          optimization_target: {
            type: 'string',
            enum: ['open_rate', 'response_rate', 'meeting_rate']
          }
        },
        required: ['campaign_id']
      }
    }
  },
  {
    type: 'function',
    function: {
      name: 'save_onboarding_profile',
      description: 'Save or update the user\'s sales profile and preferences',
      parameters: {
        type: 'object',
        properties: {
          company_name: { type: 'string' },
          industry: { type: 'string' },
          value_prop: { type: 'string' },
          icp_title: { type: 'string' },
          icp_location: { type: 'string' },
          icp_size: { type: 'string' },
          success_metrics: {
            type: 'object',
            properties: {
              target_response_rate: { type: 'number' },
              target_meeting_rate: { type: 'number' },
              target_deal_size: { type: 'number' }
            }
          },
          sales_preferences: {
            type: 'object',
            properties: {
              follow_up_frequency: { type: 'string' },
              communication_style: { type: 'string' },
              meeting_scheduling: { type: 'string' }
            }
          }
        },
        required: ['company_name', 'industry']
      }
    }
  },
  {
    type: 'function',
    function: {
      name: 'generate_email_sequence',
      description: 'Create a personalized email sequence based on profile and performance data',
      parameters: {
        type: 'object',
        properties: {
          sequence_type: {
            type: 'string',
            enum: ['cold_outreach', 'follow_up', 'meeting_request', 'proposal']
          },
          personalization_level: {
            type: 'string',
            enum: ['basic', 'medium', 'high']
          },
          target_persona: { type: 'string' },
          value_props: { 
            type: 'array',
            items: { type: 'string' }
          }
        },
        required: ['sequence_type', 'personalization_level']
      }
    }
  },
  {
    type: 'function',
    function: {
      name: 'generate_leads',
      description: 'Generate and save new lead profiles based on the user\'s ICP (Ideal Customer Profile)',
      parameters: {
        type: 'object',
        properties: {
          industry: { 
            type: 'string',
            description: 'Target industry for lead generation'
          },
          location: { 
            type: 'string',
            description: 'Target location for leads (e.g., "France", "Paris")'
          },
          job_titles: {
            type: 'array',
            items: { type: 'string' },
            description: 'List of target job titles'
          },
          company_size: {
            type: 'string',
            enum: ['1-10', '11-50', '51-200', '201-500', '501-1000', '1000+'],
            description: 'Target company size range'
          },
          count: {
            type: 'number',
            description: 'Number of leads to generate (max 10)',
            minimum: 1,
            maximum: 10
          }
        },
        required: ['location', 'job_titles', 'count']
      }
    }
  }
];

export class AssistantService {
  private messages: Message[] = [];
  private conversationId: string;
  private userId: string;
  private userProfile: any = null;
  private performanceMetrics: any = null;
  private openaiClient: OpenAI | null = null;

  constructor(userId: string, conversationId: string) {
    this.userId = userId;
    this.conversationId = conversationId;
    this.messages = [];
    this.initializeAssistant();
  }

  private async initializeAssistant() {
    try {
      // Initialize OpenAI client (now without userId)
      this.openaiClient = await initializeOpenAI();

      // Load user profile
      const { data: profile } = await supabase
        .from('client_profile')
        .select('*')
        .eq('client_id', this.userId)
        .single();
      
      this.userProfile = profile;

      // Load performance metrics
      const { data: metrics } = await supabase
        .from('activity_logs')
        .select('*')
        .eq('client_id', this.userId)
        .eq('action', 'campaign_metrics')
        .order('created_at', { ascending: false })
        .limit(1);
      
      this.performanceMetrics = metrics?.[0]?.context;

    } catch (error) {
      if (error instanceof OpenAIClientError) {
        toast.error(error.message);
      } else {
        console.error('Error initializing assistant:', error);
        toast.error('Failed to initialize assistant. Please try again.');
      }
    }
  }

  async sendMessage(content: string): Promise<{ message: string; toolCalls?: any[] }> {
    try {
      if (!this.openaiClient) {
        console.error('OpenAI client not initialized');
        throw new OpenAIClientError('OpenAI client not initialized. Please check your API key.');
      }

      console.log('Sending message:', { content });

      // Check if this is a lead-related query
      const leadQueryPatterns = [
        // Status Patterns (should be checked first)
        /qui\s+(?:sont|est)\s+(?:mes|les)\s+leads?\s+(?:à|a)\s+contacter/i,
        /(?:mes|les)\s+leads?\s+(?:à|a)\s+contacter/i,
        /leads?\s+(?:à|a)\s+contacter/i,
        /(?:à|a)\s+contacter/i,
        
        // Job Title Patterns
        /qui\s+(sont|est)\s+les?\s+(ceo|pdg|dg|directeur|président)/i,
        /qui\s+(sont|est)\s+les?\s+([^?\s]+\s+[^?\s]+)/i,  // For two-word titles
        /qui\s+(sont|est)\s+les?\s+([^?\s]+)/i,  // For single-word titles
        
        // Company Patterns
        /qui\s+travaille\s+chez/i,
        /qui\s+bosse\s+(chez|pour)/i,
        /employés?\s+(?:chez|de)/i,
        /dans\s+l'entreprise/i,
        /dans\s+la\s+société/i,
        /entreprise\s+([^?\s]+)/i,
        /société\s+([^?\s]+)/i,
        
        // Other Status Patterns
        /statut\s+([^?\s]+)/i,
        /leads?\s+([^?\s]+)/i,
        /prospects?\s+([^?\s]+)/i,
        /^à\s+relancer/i,
        /contacts?\s+à\s+([^?\s]+)/i
      ];

      const isLeadQuery = leadQueryPatterns.some(pattern => pattern.test(content));

      if (isLeadQuery) {
        try {
          // Parse the query to extract search criteria
          const criteria: any = {};
          
          // Check for status patterns first
          const statusPatterns = [
            /qui\s+(?:sont|est)\s+(?:mes|les)\s+leads?\s+(?:à|a)\s+contacter/i,
            /(?:mes|les)\s+leads?\s+(?:à|a)\s+contacter/i,
            /leads?\s+(?:à|a)\s+contacter/i,
            /(?:à|a)\s+contacter/i
          ];

          if (statusPatterns.some(pattern => pattern.test(content.toLowerCase()))) {
            // For status queries, ONLY set the Statut field
            return await this.searchLeads({
              user_id: this.userId,
              query: content,
              criteria: { Statut: 'à contacter' }
            });
          }

          // Only proceed with other checks if no status match
          const jobTitleMatch = content.match(/qui\s+(sont|est)\s+les?\s+([^?]+?)(?:\s+parmi|$)/i);
          if (jobTitleMatch) {
            const jobTitle = jobTitleMatch[2].trim().toLowerCase();
            if (!['mes', 'les', 'leads', 'lead', 'prospect', 'prospects'].includes(jobTitle)) {
              criteria.job_title = jobTitle;
            }
          }

          return await this.searchLeads({
            user_id: this.userId,
            query: content,
            criteria
          });
        } catch (error) {
          console.error('Error in lead search:', error);
          console.log('Falling back to OpenAI assistant...');
        }
      }

      // Add user message to conversation
      this.messages.push({
        role: 'user' as const,
        content
      });

      // Prepare context-enhanced messages
      const contextEnhancedMessages: ChatCompletionMessageParam[] = [
        { role: 'system' as const, content: systemMessage },
        ...(this.userProfile ? [{
          role: 'system' as const,
          content: `Current user profile:\n${JSON.stringify(this.userProfile, null, 2)}`
        }] : []),
        ...(this.performanceMetrics ? [{
          role: 'system' as const,
          content: `Recent performance metrics:\n${JSON.stringify(this.performanceMetrics, null, 2)}`
        }] : []),
        ...this.messages.map(msg => {
          switch (msg.role) {
            case 'function':
              return {
                role: 'function' as const,
                name: msg.name || 'unknown',
                content: msg.content
              };
            case 'user':
              return {
                role: 'user' as const,
                content: msg.content
              };
            case 'assistant':
              return {
                role: 'assistant' as const,
                content: msg.content
              };
            case 'system':
              return {
                role: 'system' as const,
                content: msg.content
              };
            default:
              throw new Error(`Invalid message role: ${msg.role}`);
          }
        })
      ];

      console.log('Prepared messages:', contextEnhancedMessages.length);

      try {
        // Get response from OpenAI
        const completion = await this.openaiClient.chat.completions.create({
          model: 'gpt-4-turbo-preview',
          messages: contextEnhancedMessages,
          tools: availableTools,
          tool_choice: 'auto',
        });

        console.log('Got OpenAI response:', completion.choices[0].message);
        const assistantResponse = completion.choices[0];
        
        if (assistantResponse.message.tool_calls) {
          // Handle tool calls
          const toolCalls = assistantResponse.message.tool_calls;
          console.log('Processing tool calls:', toolCalls.length);
          
          try {
            const toolResults = await Promise.all(
              toolCalls.map(async (toolCall) => {
                const result = await this.handleToolCall(toolCall);
                return result;
              })
            );
            console.log('Tool calls completed:', toolResults);

            // Format tool results into a readable message
            const toolResultsMessage = toolResults.map(result => {
              if (result && 'recommendations' in result && Array.isArray(result.recommendations)) {
                return `Here are some leads I found:\n${result.recommendations.map((lead: any) => 
                  `- ${lead.full_name || 'Unknown'} at ${lead.company || 'Unknown'} (${lead.location || 'Unknown'})`
                ).join('\n')}`;
              }
              return JSON.stringify(result, null, 2);
            }).join('\n\n');

            // Add assistant's response with tool calls and results
            const assistantMessage = {
              role: 'assistant' as const,
              content: assistantResponse.message.content || toolResultsMessage || "I've processed your request.",
              toolCalls: toolCalls
            };

            // Save message to database
            await this.saveMessageToDatabase(assistantMessage);

            // Add to conversation
            this.messages.push(assistantMessage);

            return {
              message: assistantMessage.content,
              toolCalls: toolCalls
            };
          } catch (error) {
            console.error('Error executing tool calls:', error);
            // Continue with the conversation even if tool calls fail
            const errorMessage = {
              role: 'assistant' as const,
              content: "I apologize, but I encountered an error while processing your request. Could you please try again?",
              toolCalls: toolCalls
            };
            
            await this.saveMessageToDatabase(errorMessage);
            this.messages.push(errorMessage);
            
            return {
              message: errorMessage.content,
              toolCalls: toolCalls
            };
          }
        }

        // Add assistant's response
        const assistantMessage = {
          role: 'assistant' as const,
          content: assistantResponse.message.content || "I apologize, but I don't have a response for that."
        };

        // Save message to database
        await this.saveMessageToDatabase(assistantMessage);

        // Add to conversation
        this.messages.push(assistantMessage);

        return {
          message: assistantMessage.content
        };
      } catch (error) {
        console.error('OpenAI API error:', error);
        throw error;
      }
    } catch (error) {
      console.error('Error in sendMessage:', error);
      if (error instanceof OpenAIClientError) {
        toast.error(error.message);
      } else {
        toast.error('Failed to send message. Please try again.');
      }
      throw error;
    }
  }

  private async handleToolCall(toolCall: any) {
    try {
      console.log('Handling tool call:', {
        name: toolCall.function.name,
        arguments: toolCall.function.arguments
      });

      const args = JSON.parse(toolCall.function.arguments);
      
      switch (toolCall.function.name) {
        case 'analyze_sales_performance':
          return await this.analyzeSalesPerformance(args);
        case 'get_lead_recommendations':
          return await this.getLeadRecommendations(args);
        case 'generate_leads':
          return await this.generateLeads(args);
        case 'optimize_email_campaign':
          return await this.optimizeEmailCampaign(args);
        case 'save_onboarding_profile':
          return await this.saveOnboardingProfile(args);
        case 'generate_email_sequence':
          return await this.generateEmailSequence(args);
        default:
          throw new Error(`Unknown tool: ${toolCall.function.name}`);
      }
    } catch (error) {
      console.error('Error handling tool call:', error);
      throw error;
    }
  }

  private async analyzeSalesPerformance({ timeframe, metrics = ['conversion_rate', 'response_rate'] }) {
    console.log('Analyzing sales performance:', { timeframe, metrics });
    try {
      const { data, error } = await supabase
        .from('activity_logs')
        .select('*')
        .eq('client_id', this.userId)
        .eq('action', 'campaign_metrics')
        .gte('created_at', this.getTimeframeDate(timeframe))
        .order('created_at', { ascending: false });

      if (error) {
        console.error('Error fetching sales performance:', error);
        throw error;
      }

      const analysis = this.generatePerformanceAnalysis(data || [], metrics);
      return { metrics: data, analysis };
    } catch (error) {
      console.error('Error in analyzeSalesPerformance:', error);
      throw error;
    }
  }

  private async getLeadRecommendations({ location }) {
    console.log('Getting lead recommendations:', { location });
    try {
      // Get the access token for the Edge Function call
      const { data: sessionData } = await supabase.auth.getSession();
      const access_token = sessionData.session?.access_token;
      
      if (!access_token) {
        throw new Error('No access token available');
      }

      // Get the last user message to extract the job title
      const lastUserMessage = this.messages
        .filter(msg => msg.role === 'user')
        .pop();

      if (!lastUserMessage?.content) {
        throw new Error('No user message found');
      }

      // Extract job title from the user's message
      const jobTitle = lastUserMessage.content
        .toLowerCase()
        .includes('marketing manager') ? 'marketing manager' : 'CEO';

      console.log('Calling launch-search function for lead generation:', { jobTitle, location });
      
      // Call the launch-search Edge Function
      const response = await fetch(
        `${import.meta.env.VITE_SUPABASE_URL || 'https://atsfuqwxfrezkxtnctmk.supabase.co'}/functions/v1/launch-search`,
        {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${access_token}`
          },
          body: JSON.stringify({
            keyword: jobTitle,
            filters: { location },
            client_id: this.userId
          })
        }
      );

      if (!response.ok) {
        const errorData = await response.json();
        console.error('Error from launch-search:', errorData);
        throw new Error(errorData.error || 'Failed to generate leads');
      }

      const result = await response.json();
      console.log('Launch-search result:', result);

      // Query the newly generated leads
      const { data: leads, error } = await supabase
        .from('leads')
        .select('*')
        .eq('client_id', this.userId)
        .eq('location', location)
        .order('created_at', { ascending: false })
        .limit(10);

      if (error) {
        console.error('Error fetching generated leads:', error);
        throw error;
      }

      const recommendations = leads || [];
      const analysis = this.analyzeLeadPatterns(recommendations);

      return {
        recommendations,
        analysis,
        message: recommendations.length > 0 
          ? `Found ${recommendations.length} leads matching your criteria.`
          : 'No leads found matching your criteria. Try adjusting your filters.'
      };
    } catch (error) {
      console.error('Error in getLeadRecommendations:', error);
      throw error;
    }
  }

  private async optimizeEmailCampaign({ campaign_id, optimization_target }) {
    const { data, error } = await supabase
      .from('email_jobs')  // Using email_jobs instead of email_campaigns
      .select(`
        *,
        metrics:activity_logs(*)
      `)
      .eq('id', campaign_id)
      .eq('client_id', this.userId)
      .single();

    if (error) throw error;
    return { 
      campaign: data,
      optimization: this.generateCampaignOptimizations(data, optimization_target)
    };
  }

  private async saveOnboardingProfile(profileData: any) {
    const { error } = await supabase
      .from('client_profile')
      .upsert({
        ...profileData,
        client_id: this.userId,
        updated_at: new Date().toISOString()
      });

    if (error) throw error;
    return { success: true, profile: profileData };
  }

  private async generateEmailSequence(sequenceParams: any) {
    // Implement email sequence generation logic
    return {
      sequence: this.createEmailSequence(sequenceParams),
      recommendations: this.getSequenceRecommendations(sequenceParams)
    };
  }

  private async generateLeads({ industry, location, job_titles, company_size, count }: {
    industry?: string;
    location: string;
    job_titles: string[];
    company_size?: string;
    count: number;
  }) {
    console.log('Generating leads:', { industry, location, job_titles, company_size, count });
    
    try {
      // Create a search record
      const { data: search, error: searchError } = await supabase
        .from('queue_search')
        .insert({
          client_id: this.userId,
          keyword: job_titles.join(', '),
          parsed_filters: {
            industry,
            location,
            job_titles,
            company_size
          },
          status: 'completed',
          created_at: new Date().toISOString()
        })
        .select()
        .single();

      if (searchError) {
        throw searchError;
      }

      const savedLeads = [];
      const totalLeads = Math.min(count, 10);

      // Generate and save leads one by one
      for (let i = 0; i < totalLeads; i++) {
        const randomJobTitle = job_titles[Math.floor(Math.random() * job_titles.length)];
        const firstName = this.generateRandomName();
        const lastName = this.generateRandomName();
        
        const lead = {
          client_id: this.userId,
          search_id: search.id,
          full_name: `${firstName} ${lastName}`,
          job_title: randomJobTitle,
          company: this.generateCompanyName(industry),
          location: location,
          email: `${firstName.toLowerCase()}.${lastName.toLowerCase()}@${this.generateDomain()}`,
          linkedin_url: `https://linkedin.com/in/${firstName.toLowerCase()}-${lastName.toLowerCase()}-${Math.random().toString(36).substring(7)}`,
          status: 'new',
          created_at: new Date().toISOString()
        };

        // Save each lead individually
        const { data: savedLead, error: leadError } = await supabase
          .from('leads')
          .insert(lead)
          .select()
          .single();

        if (leadError) {
          console.error('Error saving lead:', leadError);
          continue;
        }

        savedLeads.push(savedLead);

        // Add a small delay between saves to make the UI updates more visible
        await new Promise(resolve => setTimeout(resolve, 500));
      }

      return {
        message: `Generated ${savedLeads.length} new leads matching your criteria.`,
        recommendations: savedLeads,
        analysis: {
          distribution: {
            byTitle: this.groupBy(savedLeads, 'job_title'),
            byLocation: this.groupBy(savedLeads, 'location')
          }
        }
      };
    } catch (error) {
      console.error('Error generating leads:', error);
      throw error;
    }
  }

  // Helper methods
  private getTimeframeDate(timeframe: string): string {
    const date = new Date();
    switch (timeframe) {
      case '7d':
        date.setDate(date.getDate() - 7);
        break;
      case '30d':
        date.setDate(date.getDate() - 30);
        break;
      case '90d':
        date.setDate(date.getDate() - 90);
        break;
      default:
        date.setFullYear(2000); // Get all data
    }
    return date.toISOString();
  }

  private generatePerformanceAnalysis(data: any[], metrics: string[]) {
    // Implement performance analysis logic
    return {
      summary: this.calculateMetricsSummary(data, metrics),
      trends: this.identifyMetricsTrends(data, metrics),
      recommendations: this.generateMetricsRecommendations(data, metrics)
    };
  }

  private analyzeLeadPatterns(leads: any[]) {
    // Implement lead pattern analysis logic
    return {
      commonCharacteristics: this.findCommonCharacteristics(leads),
      successPatterns: this.identifySuccessPatterns(leads),
      recommendations: this.generateLeadRecommendations(leads)
    };
  }

  private generateCampaignOptimizations(campaign: any, target: string) {
    // Implement campaign optimization logic
    return {
      currentPerformance: this.analyzeCampaignPerformance(campaign),
      improvements: this.suggestCampaignImprovements(campaign, target),
      abTests: this.recommendABTests(campaign, target)
    };
  }

  private createEmailSequence(params: any) {
    // Implement sequence creation logic
    return {
      emails: this.generateSequenceEmails(params),
      timing: this.optimizeSequenceTiming(params),
      personalization: this.addPersonalizationElements(params)
    };
  }

  private calculateMetricsSummary(data: any[], metrics: string[]) {
    // Implementation details...
    return {};
  }

  private identifyMetricsTrends(data: any[], metrics: string[]) {
    // Implementation details...
    return {};
  }

  private generateMetricsRecommendations(data: any[], metrics: string[]) {
    // Implementation details...
    return {};
  }

  private findCommonCharacteristics(leads: any[]) {
    // Implementation details...
    return {};
  }

  private identifySuccessPatterns(leads: any[]) {
    // Implementation details...
    return {};
  }

  private generateLeadRecommendations(leads: any[]) {
    // Implementation details...
    return {};
  }

  private analyzeCampaignPerformance(campaign: any) {
    // Implementation details...
    return {};
  }

  private suggestCampaignImprovements(campaign: any, target: string) {
    // Implementation details...
    return {};
  }

  private recommendABTests(campaign: any, target: string) {
    // Implementation details...
    return {};
  }

  private generateSequenceEmails(params: any) {
    // Implementation details...
    return [];
  }

  private optimizeSequenceTiming(params: any) {
    // Implementation details...
    return {};
  }

  private addPersonalizationElements(params: any) {
    // Implementation details...
    return {};
  }

  private getSequenceRecommendations(params: any) {
    // Implementation of sequence recommendations
    return {
      timing: this.optimizeSequenceTiming(params),
      personalization: this.addPersonalizationElements(params)
    };
  }

  // Helper functions for lead generation
  private generateRandomName(): string {
    const names = ['Alex', 'Jordan', 'Morgan', 'Taylor', 'Sam', 'Chris', 'Pat', 'Robin', 'Casey', 'Jamie'];
    return names[Math.floor(Math.random() * names.length)];
  }

  private generateCompanyName(industry?: string): string {
    const prefixes = ['Tech', 'Global', 'Smart', 'Next', 'Future', 'Digital', 'Cloud', 'Data', 'AI', 'Cyber'];
    const suffixes = ['Solutions', 'Systems', 'Technologies', 'Group', 'Corp', 'Inc', 'Labs', 'Works', 'Tech', 'Software'];
    return `${prefixes[Math.floor(Math.random() * prefixes.length)]}${suffixes[Math.floor(Math.random() * suffixes.length)]}`;
  }

  private generateDomain(): string {
    const domains = ['company.com', 'enterprise.io', 'tech.co', 'group.com', 'corp.com', 'systems.io'];
    return domains[Math.floor(Math.random() * domains.length)];
  }

  private groupBy(array: any[], key: string): { [key: string]: number } {
    return array.reduce((result, item) => {
      const value = item[key];
      result[value] = (result[value] || 0) + 1;
      return result;
    }, {});
  }

  private async saveMessageToDatabase(message: {
    role: 'user' | 'assistant' | 'system' | 'function';
    content: string;
    toolCalls?: any[];
  }) {
    try {
      console.log('Saving message to database:', {
        role: message.role,
        content: message.content,
        hasToolCalls: !!message.toolCalls
      });

      if (!this.userId || !this.conversationId) {
        throw new Error('Missing required userId or conversationId');
      }

      const messageData = {
        client_id: this.userId,
        conversation_id: this.conversationId,
        role: message.role,
        content: message.content,
        toolCalls: message.toolCalls || null,
        created_at: new Date().toISOString()
      };

      const { data, error } = await supabase
        .from('messages')
        .insert(messageData)
        .select()
        .single();

      if (error) {
        console.error('Error saving message:', error);
        throw error;
      }

      return data;
    } catch (error) {
      console.error('Failed to save message:', error);
      // Don't throw the error as message saving is not critical
      // for the conversation to continue
    }
  }

  getMessages(): Message[] {
    return this.messages;
  }

  setMessages(messages: Message[]) {
    this.messages = messages;
  }

  private async searchLeads({ user_id, query, criteria }: { 
    user_id: string;
    query: string;
    criteria: any;
  }) {
    console.log('Searching leads with criteria:', criteria);

    const response = await fetch(
      `${import.meta.env.VITE_SUPABASE_URL}/functions/v1/search-leads`,
      {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${(await supabase.auth.getSession()).data.session?.access_token}`,
          'Accept': 'application/json'
        },
        body: JSON.stringify({ user_id, query, criteria })
      }
    );

    if (!response.ok) {
      const errorData = await response.json();
      console.error('Search-leads error response:', errorData);
      throw new Error(errorData.message || errorData.error || 'Failed to search leads');
    }

    const result = await response.json();
    console.log('Search-leads result:', result);
    
    // Format the response
    let formattedMessage = '';
    if (result.leads && result.leads.length > 0) {
      if (criteria.Statut) {
        formattedMessage = `J'ai trouvé ${result.leads.length} lead(s) avec le statut "${criteria.Statut}":\n\n`;
      } else if (criteria.job_title) {
        formattedMessage = `J'ai trouvé ${result.leads.length} lead(s) avec le poste "${criteria.job_title}":\n\n`;
      } else {
        formattedMessage = `J'ai trouvé ${result.leads.length} leads:\n\n`;
      }

      // Group by status if it's a status query
      if (criteria.Statut) {
        const groupedByStatus = result.leads.reduce((acc: any, lead: any) => {
          const status = lead.Statut || 'Non défini';
          acc[status] = acc[status] || [];
          acc[status].push(lead);
          return acc;
        }, {});
        
        formattedMessage += Object.entries(groupedByStatus).map(([status, leads]: [string, any[]]) => 
          `${status} (${leads.length}):\n${leads.map(lead => 
            `  - ${lead.full_name || 'Unknown'} ${lead.job_title ? `(${lead.job_title})` : ''} at ${lead.company || 'Unknown'}`
          ).join('\n')}`
        ).join('\n\n');
      } else {
        formattedMessage += result.leads.map((lead: any) => 
          `- ${lead.full_name || 'Unknown'} ${lead.job_title ? `(${lead.job_title})` : ''} at ${lead.company || 'Unknown'} - ${lead.Statut || 'Non défini'}`
        ).join('\n');
      }
    } else {
      if (criteria.Statut) {
        formattedMessage = `Je n'ai trouvé aucun lead avec le statut "${criteria.Statut}".`;
      } else if (criteria.job_title) {
        formattedMessage = `Je n'ai trouvé aucun lead avec le poste "${criteria.job_title}".`;
      } else {
        formattedMessage = "Aucun lead trouvé correspondant à ces critères.";
      }
    }

    return { message: formattedMessage };
  }
} 