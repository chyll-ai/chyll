// @ts-ignore: Deno imports
import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
// @ts-ignore: Deno imports
import "https://deno.land/x/xhr@0.1.0/mod.ts";

interface RequestData {
  message: string;
  userId: string;
}

interface AssistantMessage {
  role: string;
  content: Array<{
    text: {
      value: string;
    };
  }>;
  created_at: string;
}

interface ToolOutput {
  threadId: string;
  runId: string;
  toolCallId: string;
  output: any;
}

const OPENAI_API_KEY = Deno.env.get('OPENAI_API_KEY');
const ASSISTANT_ID = 'asst_6NuMm7dgWLw3P6FcdVvD7uut';

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

serve(async (req: Request) => {
  console.log("Request received:", req.url);
  
  // Handle CORS preflight requests
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const requestData: RequestData = await req.json();
    const { message, userId } = requestData;
    
    if (!message) {
      throw new Error('Message is required');
    }

    if (!userId) {
      throw new Error('UserId is required');
    }

    console.log("Processing message for userId:", userId);

    if (!OPENAI_API_KEY) {
      console.error("OPENAI_API_KEY is not configured");
      throw new Error('OPENAI_API_KEY is not configured');
    }

    // Check if this is a tool output submission
    try {
      const toolOutput: ToolOutput = JSON.parse(message);
      if (toolOutput.threadId && toolOutput.runId && toolOutput.toolCallId) {
        // Handle tool output submission
        const response = await fetch(`https://api.openai.com/v1/threads/${toolOutput.threadId}/runs/${toolOutput.runId}/submit_tool_outputs`, {
          method: 'POST',
          headers: {
            'Authorization': `Bearer ${OPENAI_API_KEY}`,
            'Content-Type': 'application/json',
            'OpenAI-Beta': 'assistants=v2',
          },
          body: JSON.stringify({
            tool_outputs: [{
              tool_call_id: toolOutput.toolCallId,
              output: JSON.stringify(toolOutput.output)
            }]
          })
        });

        if (!response.ok) {
          const errorData = await response.json();
          throw new Error(`Failed to submit tool outputs: ${JSON.stringify(errorData)}`);
        }

        return new Response(
          JSON.stringify({ message: "Tool outputs submitted successfully" }),
          { headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
        );
      }
    } catch (e) {
      // Not a tool output, continue with regular message processing
      console.log("Not a tool output, processing as regular message");
    }

    // Create a new thread for each message
    const threadResponse = await fetch('https://api.openai.com/v1/threads', {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${OPENAI_API_KEY}`,
        'Content-Type': 'application/json',
        'OpenAI-Beta': 'assistants=v2',
      },
      body: JSON.stringify({})
    });

    if (!threadResponse.ok) {
      const errorData = await threadResponse.json();
      console.error("Error creating thread:", errorData);
      throw new Error(`Failed to create thread: ${JSON.stringify(errorData)}`);
    }

    const thread = await threadResponse.json();
    const threadId = thread.id;
    console.log("Thread created:", threadId);

    // Add the message to the thread
    console.log(`Adding message to thread ${threadId}:`, message);
    const messageResponse = await fetch(`https://api.openai.com/v1/threads/${threadId}/messages`, {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${OPENAI_API_KEY}`,
        'Content-Type': 'application/json',
        'OpenAI-Beta': 'assistants=v2',
      },
      body: JSON.stringify({
        role: 'user',
        content: message
      })
    });

    if (!messageResponse.ok) {
      const errorData = await messageResponse.json();
      console.error("Error adding message:", errorData);
      throw new Error(`Failed to add message: ${JSON.stringify(errorData)}`);
    }

    // Create a run with the assistant
    console.log("Creating run with assistant...");
    const runResponse = await fetch(`https://api.openai.com/v1/threads/${threadId}/runs`, {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${OPENAI_API_KEY}`,
        'Content-Type': 'application/json',
        'OpenAI-Beta': 'assistants=v2',
      },
      body: JSON.stringify({
        assistant_id: ASSISTANT_ID
      })
    });

    if (!runResponse.ok) {
      const errorData = await runResponse.json();
      console.error("Error creating run:", errorData);
      throw new Error(`Failed to create run: ${JSON.stringify(errorData)}`);
    }

    const runData = await runResponse.json();
    const runId = runData.id;
    console.log("Run created:", runId);

    // Poll for the run completion
    console.log("Waiting for run completion...");
    let runStatus = await pollRunStatus(threadId, runId);

    // Get the assistant's messages
    console.log("Retrieving assistant messages...");
    const messagesResponse = await fetch(`https://api.openai.com/v1/threads/${threadId}/messages`, {
      method: 'GET',
      headers: {
        'Authorization': `Bearer ${OPENAI_API_KEY}`,
        'Content-Type': 'application/json',
        'OpenAI-Beta': 'assistants=v2',
      }
    });

    if (!messagesResponse.ok) {
      const errorData = await messagesResponse.json();
      console.error("Error retrieving messages:", errorData);
      throw new Error(`Failed to get messages: ${JSON.stringify(errorData)}`);
    }

    const messagesData = await messagesResponse.json();
    
    // Get the most recent assistant message
    const assistantMessages = (messagesData.data as AssistantMessage[])
      .filter(msg => msg.role === 'assistant')
      .sort((a, b) => new Date(b.created_at).getTime() - new Date(a.created_at).getTime());

    const assistantResponse = assistantMessages.length > 0 
      ? assistantMessages[0].content[0]?.text?.value || ""
      : "I couldn't generate a response.";

    console.log("Assistant response:", assistantResponse.substring(0, 100) + "...");

    // Return the assistant's response
    return new Response(
      JSON.stringify({ 
        message: assistantResponse
      }),
      { headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
    );
  } catch (error: unknown) {
    console.error('Error:', error);
    return new Response(
      JSON.stringify({ error: error instanceof Error ? error.message : 'An unknown error occurred' }),
      { 
        status: 400, 
        headers: { ...corsHeaders, 'Content-Type': 'application/json' }
      }
    );
  }
});

async function pollRunStatus(threadId: string, runId: string) {
  let status = 'queued';
  let runStatus = null;
  let attempts = 0;
  const maxAttempts = 30; // Limite de nombre d'essais pour éviter les boucles infinies
  
  while (['queued', 'in_progress'].includes(status) && attempts < maxAttempts) {
    attempts++;
    // Wait before polling again
    await new Promise(resolve => setTimeout(resolve, 1000));
    
    try {
      const runCheckResponse = await fetch(`https://api.openai.com/v1/threads/${threadId}/runs/${runId}`, {
        method: 'GET',
        headers: {
          'Authorization': `Bearer ${OPENAI_API_KEY}`,
          'Content-Type': 'application/json',
          'OpenAI-Beta': 'assistants=v2',
        }
      });

      if (!runCheckResponse.ok) {
        const errorData = await runCheckResponse.json();
        console.error("Erreur lors de la vérification du run:", errorData);
        throw new Error(`Run check failed: ${JSON.stringify(errorData)}`);
      }

      runStatus = await runCheckResponse.json();
      status = runStatus.status;
      console.log(`Status du run: ${status} (tentative ${attempts}/${maxAttempts})`);

      if (status === 'failed') {
        console.error("Run échoué:", runStatus.last_error);
        throw new Error(`Run failed: ${JSON.stringify(runStatus.last_error)}`);
      }
      
      if (status === 'requires_action') {
        console.log("Le run nécessite une action");
        return runStatus;
      }
      
      if (status === 'completed') {
        console.log("Run completed successfully");
        return runStatus;
      }
    } catch (error) {
      console.error("Erreur lors de la vérification du status du run:", error);
      throw error;
    }
  }
  
  if (attempts >= maxAttempts && ['queued', 'in_progress'].includes(status)) {
    console.error("Délai dépassé pour le run");
    throw new Error("Run timed out after maximum polling attempts");
  }
  
  return runStatus;
}
