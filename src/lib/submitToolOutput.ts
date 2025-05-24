import { supabase } from '@/integrations/supabase/client';

interface ToolOutput {
  success: boolean;
  error?: string;
  context?: string;
  [key: string]: any;
}

export const submitToolOutput = async (
  threadId: string,
  runId: string,
  toolCallId: string,
  output: ToolOutput
) => {
  try {
    const { error } = await supabase.functions.invoke('submit-tool-output', {
      body: {
        thread_id: threadId,
        run_id: runId,
        tool_call_id: toolCallId,
        output
      }
    });

    if (error) {
      console.error('Error submitting tool output:', error);
      throw error;
    }
  } catch (error) {
    console.error('Failed to submit tool output:', error);
    throw error;
  }
}; 