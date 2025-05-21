
import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
import "https://deno.land/x/xhr@0.1.0/mod.ts";

const OPENAI_API_KEY = Deno.env.get('OPENAI_API_KEY');
const ASSISTANT_ID = 'asst_6NuMm7dgWLw3P6FcdVvD7uut';

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

serve(async (req) => {
  // Handle CORS preflight requests
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const { action, message, threadId } = await req.json();

    if (!OPENAI_API_KEY) {
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
  const response = await fetch('https://api.openai.com/v1/threads', {
    method: 'POST',
    headers: {
      'Authorization': `Bearer ${OPENAI_API_KEY}`,
      'Content-Type': 'application/json',
      'OpenAI-Beta': 'assistants=v1',
    },
    body: JSON.stringify({})
  });

  const thread = await response.json();
  
  return new Response(
    JSON.stringify({ threadId: thread.id }),
    { headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
  );
}

async function handleSendMessage(threadId: string, messageContent: string) {
  // 1. Add the message to the thread
  const messageResponse = await fetch(`https://api.openai.com/v1/threads/${threadId}/messages`, {
    method: 'POST',
    headers: {
      'Authorization': `Bearer ${OPENAI_API_KEY}`,
      'Content-Type': 'application/json',
      'OpenAI-Beta': 'assistants=v1',
    },
    body: JSON.stringify({
      role: 'user',
      content: messageContent
    })
  });

  if (!messageResponse.ok) {
    const errorData = await messageResponse.json();
    throw new Error(`Failed to add message: ${JSON.stringify(errorData)}`);
  }

  // 2. Create a run with the assistant
  const runResponse = await fetch(`https://api.openai.com/v1/threads/${threadId}/runs`, {
    method: 'POST',
    headers: {
      'Authorization': `Bearer ${OPENAI_API_KEY}`,
      'Content-Type': 'application/json',
      'OpenAI-Beta': 'assistants=v1',
    },
    body: JSON.stringify({
      assistant_id: ASSISTANT_ID
    })
  });

  if (!runResponse.ok) {
    const errorData = await runResponse.json();
    throw new Error(`Failed to create run: ${JSON.stringify(errorData)}`);
  }

  const runData = await runResponse.json();
  const runId = runData.id;

  // 3. Poll for the run completion
  let runStatus = await pollRunStatus(threadId, runId);

  // 4. If there were tool calls, capture them but don't process for now (as per requirements)
  let toolCalls = null;
  if (runStatus.required_action?.type === 'submit_tool_outputs') {
    toolCalls = runStatus.required_action.submit_tool_outputs.tool_calls;
    
    // Since we're not processing tool calls yet, just complete the run
    const completeRunResponse = await fetch(`https://api.openai.com/v1/threads/${threadId}/runs/${runId}/submit_tool_outputs`, {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${OPENAI_API_KEY}`,
        'Content-Type': 'application/json',
        'OpenAI-Beta': 'assistants=v1',
      },
      body: JSON.stringify({
        tool_outputs: toolCalls.map(tool => ({
          tool_call_id: tool.id,
          output: JSON.stringify({ message: "Function not implemented yet" })
        }))
      })
    });

    if (!completeRunResponse.ok) {
      const errorData = await completeRunResponse.json();
      throw new Error(`Failed to submit tool outputs: ${JSON.stringify(errorData)}`);
    }

    // Poll again for completion
    runStatus = await pollRunStatus(threadId, runId);
  }

  // 5. Get the assistant's messages
  const messagesResponse = await fetch(`https://api.openai.com/v1/threads/${threadId}/messages`, {
    method: 'GET',
    headers: {
      'Authorization': `Bearer ${OPENAI_API_KEY}`,
      'Content-Type': 'application/json',
      'OpenAI-Beta': 'assistants=v1',
    }
  });

  if (!messagesResponse.ok) {
    const errorData = await messagesResponse.json();
    throw new Error(`Failed to get messages: ${JSON.stringify(errorData)}`);
  }

  const messagesData = await messagesResponse.json();
  
  // Get the most recent assistant message
  const assistantMessages = messagesData.data
    .filter(msg => msg.role === 'assistant')
    .sort((a, b) => new Date(b.created_at).getTime() - new Date(a.created_at).getTime());

  const assistantResponse = assistantMessages.length > 0 
    ? assistantMessages[0].content[0].text.value 
    : "Je n'ai pas pu générer une réponse.";

  return new Response(
    JSON.stringify({ 
      message: assistantResponse,
      toolCalls: toolCalls
    }),
    { headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
  );
}

async function pollRunStatus(threadId: string, runId: string) {
  let status = 'queued';
  let runStatus = null;
  
  while (['queued', 'in_progress'].includes(status)) {
    // Wait before polling again
    await new Promise(resolve => setTimeout(resolve, 1000));
    
    const runCheckResponse = await fetch(`https://api.openai.com/v1/threads/${threadId}/runs/${runId}`, {
      method: 'GET',
      headers: {
        'Authorization': `Bearer ${OPENAI_API_KEY}`,
        'Content-Type': 'application/json',
        'OpenAI-Beta': 'assistants=v1',
      }
    });

    runStatus = await runCheckResponse.json();
    status = runStatus.status;

    if (status === 'failed') {
      throw new Error(`Run failed: ${JSON.stringify(runStatus.last_error)}`);
    }
    
    if (status === 'requires_action') {
      return runStatus;
    }
  }
  
  return runStatus;
}
