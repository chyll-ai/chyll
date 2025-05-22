
import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
import "https://deno.land/x/xhr@0.1.0/mod.ts";

const OPENAI_API_KEY = Deno.env.get('OPENAI_API_KEY');
const ASSISTANT_ID = 'asst_6NuMm7dgWLw3P6FcdVvD7uut';

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

serve(async (req) => {
  console.log("Requête reçue:", req.url);
  
  // Handle CORS preflight requests
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const requestData = await req.json();
    const { action, message, threadId, runId, toolOutputs } = requestData;
    console.log("Action:", action, "ThreadId:", threadId);

    if (!OPENAI_API_KEY) {
      console.error("OPENAI_API_KEY n'est pas configurée");
      throw new Error('OPENAI_API_KEY is not configured');
    }

    switch (action) {
      case 'create_thread':
        return handleCreateThread();
      case 'send_message':
        if (!threadId || !message) {
          throw new Error('Missing threadId or message');
        }
        return handleSendMessage(threadId, message);
      case 'submit_tool_outputs':
        if (!threadId || !runId || !toolOutputs) {
          throw new Error('Missing threadId, runId, or toolOutputs');
        }
        return handleSubmitToolOutputs(threadId, runId, toolOutputs);
      default:
        throw new Error(`Unknown action: ${action}`);
    }
  } catch (error) {
    console.error('Error:', error);
    return new Response(
      JSON.stringify({ error: error.message }),
      { 
        status: 400, 
        headers: { ...corsHeaders, 'Content-Type': 'application/json' }
      }
    );
  }
});

async function handleCreateThread() {
  try {
    console.log("Création d'un nouveau thread...");
    const response = await fetch('https://api.openai.com/v1/threads', {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${OPENAI_API_KEY}`,
        'Content-Type': 'application/json',
        'OpenAI-Beta': 'assistants=v2',  // Updated to v2
      },
      body: JSON.stringify({})
    });

    if (!response.ok) {
      const errorData = await response.json();
      console.error("Erreur de l'API OpenAI:", errorData);
      throw new Error(`OpenAI API Error: ${JSON.stringify(errorData)}`);
    }

    const thread = await response.json();
    console.log("Thread créé:", thread.id);
    
    return new Response(
      JSON.stringify({ threadId: thread.id }),
      { headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
    );
  } catch (error) {
    console.error("Erreur lors de la création du thread:", error);
    throw error;
  }
}

async function handleSendMessage(threadId: string, messageContent: string) {
  try {
    // Check if there's an active run on this thread
    console.log("Checking for active runs on thread:", threadId);
    const listRunsResponse = await fetch(`https://api.openai.com/v1/threads/${threadId}/runs`, {
      method: 'GET',
      headers: {
        'Authorization': `Bearer ${OPENAI_API_KEY}`,
        'Content-Type': 'application/json',
        'OpenAI-Beta': 'assistants=v2',
      }
    });
    
    if (!listRunsResponse.ok) {
      const errorData = await listRunsResponse.json();
      console.error("Error checking runs:", errorData);
    } else {
      const runsData = await listRunsResponse.json();
      const activeRuns = runsData.data.filter(run => 
        ['queued', 'in_progress', 'requires_action'].includes(run.status)
      );
      
      // Cancel any active runs before proceeding
      if (activeRuns.length > 0) {
        console.log(`Found ${activeRuns.length} active runs, cancelling them...`);
        for (const run of activeRuns) {
          try {
            const cancelResponse = await fetch(`https://api.openai.com/v1/threads/${threadId}/runs/${run.id}/cancel`, {
              method: 'POST',
              headers: {
                'Authorization': `Bearer ${OPENAI_API_KEY}`,
                'Content-Type': 'application/json',
                'OpenAI-Beta': 'assistants=v2',
              }
            });
            
            if (!cancelResponse.ok) {
              console.error(`Failed to cancel run ${run.id}:`, await cancelResponse.json());
            } else {
              console.log(`Successfully cancelled run ${run.id}`);
            }
          } catch (error) {
            console.error(`Error cancelling run ${run.id}:`, error);
          }
          
          // Wait briefly to ensure the cancellation is processed
          await new Promise(resolve => setTimeout(resolve, 1000));
        }
      }
    }

    // 1. Add the message to the thread
    console.log(`Ajout du message au thread ${threadId}:`, messageContent);
    const messageResponse = await fetch(`https://api.openai.com/v1/threads/${threadId}/messages`, {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${OPENAI_API_KEY}`,
        'Content-Type': 'application/json',
        'OpenAI-Beta': 'assistants=v2',  // Updated to v2
      },
      body: JSON.stringify({
        role: 'user',
        content: messageContent
      })
    });

    if (!messageResponse.ok) {
      const errorData = await messageResponse.json();
      console.error("Erreur lors de l'ajout du message:", errorData);
      throw new Error(`Failed to add message: ${JSON.stringify(errorData)}`);
    }

    // 2. Create a run with the assistant
    console.log("Création d'un run avec l'assistant...");
    const runResponse = await fetch(`https://api.openai.com/v1/threads/${threadId}/runs`, {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${OPENAI_API_KEY}`,
        'Content-Type': 'application/json',
        'OpenAI-Beta': 'assistants=v2',  // Updated to v2
      },
      body: JSON.stringify({
        assistant_id: ASSISTANT_ID
      })
    });

    if (!runResponse.ok) {
      const errorData = await runResponse.json();
      console.error("Erreur lors de la création du run:", errorData);
      throw new Error(`Failed to create run: ${JSON.stringify(errorData)}`);
    }

    const runData = await runResponse.json();
    const runId = runData.id;
    console.log("Run créé:", runId);

    // 3. Poll for the run completion
    console.log("Attente de la complétion du run...");
    let runStatus = await pollRunStatus(threadId, runId);

    // 4. If there were tool calls, capture them but don't process them in the edge function
    // Instead, return them to the frontend for processing
    let toolCalls = null;
    if (runStatus.required_action?.type === 'submit_tool_outputs') {
      console.log("Des appels d'outils sont requis");
      toolCalls = runStatus.required_action.submit_tool_outputs.tool_calls;
      
      // Since we're returning the tool calls to the frontend for processing,
      // we're not completing the run here. The frontend will handle it.
      console.log("Returning tool calls to frontend:", toolCalls);
    }

    // 5. Get the assistant's messages
    console.log("Récupération des messages de l'assistant...");
    const messagesResponse = await fetch(`https://api.openai.com/v1/threads/${threadId}/messages`, {
      method: 'GET',
      headers: {
        'Authorization': `Bearer ${OPENAI_API_KEY}`,
        'Content-Type': 'application/json',
        'OpenAI-Beta': 'assistants=v2',  // Updated to v2
      }
    });

    if (!messagesResponse.ok) {
      const errorData = await messagesResponse.json();
      console.error("Erreur lors de la récupération des messages:", errorData);
      throw new Error(`Failed to get messages: ${JSON.stringify(errorData)}`);
    }

    const messagesData = await messagesResponse.json();
    
    // Get the most recent assistant message
    const assistantMessages = messagesData.data
      .filter(msg => msg.role === 'assistant')
      .sort((a, b) => new Date(b.created_at).getTime() - new Date(a.created_at).getTime());

    const assistantResponse = assistantMessages.length > 0 
      ? assistantMessages[0].content[0]?.text?.value || ""
      : "Je n'ai pas pu générer une réponse.";

    console.log("Réponse de l'assistant:", assistantResponse.substring(0, 100) + "...");

    // Return the assistant's response along with any tool calls and the runId for the frontend
    return new Response(
      JSON.stringify({ 
        message: assistantResponse,
        toolCalls: toolCalls,
        runId: runId
      }),
      { headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
    );
  } catch (error) {
    console.error("Erreur lors de l'envoi du message:", error);
    throw error;
  }
}

async function handleSubmitToolOutputs(threadId: string, runId: string, toolOutputs: any[]) {
  try {
    console.log(`Submitting tool outputs for thread ${threadId}, run ${runId}:`);
    console.log("Tool outputs:", JSON.stringify(toolOutputs));
    
    const response = await fetch(`https://api.openai.com/v1/threads/${threadId}/runs/${runId}/submit_tool_outputs`, {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${OPENAI_API_KEY}`,
        'Content-Type': 'application/json',
        'OpenAI-Beta': 'assistants=v2',
      },
      body: JSON.stringify({
        tool_outputs: toolOutputs
      })
    });

    if (!response.ok) {
      const errorData = await response.json();
      console.error("Error submitting tool outputs:", errorData);
      throw new Error(`Failed to submit tool outputs: ${JSON.stringify(errorData)}`);
    }

    const data = await response.json();
    console.log("Tool outputs submitted successfully, run status:", data.status);
    
    // After submitting tool outputs, poll for completion and return the assistant's message
    let runStatus = await pollRunStatus(threadId, runId);
    console.log("Run status after tool outputs:", runStatus.status);
    
    // Get the assistant's messages after tool output submission
    const messagesResponse = await fetch(`https://api.openai.com/v1/threads/${threadId}/messages`, {
      method: 'GET',
      headers: {
        'Authorization': `Bearer ${OPENAI_API_KEY}`,
        'Content-Type': 'application/json',
        'OpenAI-Beta': 'assistants=v2',
      }
    });

    if (!messagesResponse.ok) {
      console.error("Error retrieving messages after tool outputs:", await messagesResponse.json());
      return new Response(
        JSON.stringify({ success: true, status: data.status }),
        { headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      );
    }

    const messagesData = await messagesResponse.json();
    
    // Get the most recent assistant message
    const assistantMessages = messagesData.data
      .filter(msg => msg.role === 'assistant')
      .sort((a, b) => new Date(b.created_at).getTime() - new Date(a.created_at).getTime());

    const assistantResponse = assistantMessages.length > 0 
      ? assistantMessages[0].content[0]?.text?.value || ""
      : "";

    console.log("Latest assistant response after tool outputs:", assistantResponse.substring(0, 100) + "...");
    
    return new Response(
      JSON.stringify({ 
        success: true, 
        status: data.status,
        message: assistantResponse,
        // If there are new tool calls, include them
        toolCalls: runStatus.required_action?.type === 'submit_tool_outputs' 
          ? runStatus.required_action.submit_tool_outputs.tool_calls 
          : null
      }),
      { headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
    );
  } catch (error) {
    console.error("Error submitting tool outputs:", error);
    throw error;
  }
}

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
          'OpenAI-Beta': 'assistants=v2',  // Updated to v2
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
