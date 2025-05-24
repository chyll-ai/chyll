import { toast } from "@/components/ui/sonner";
import { submitToolOutput } from "@/lib/submitToolOutput";

interface ErrorHandlerOptions {
  threadId?: string;
  runId?: string;
  toolCallId?: string;
  context?: string;
  showToast?: boolean;
}

export const handleError = async (error: any, options: ErrorHandlerOptions) => {
  const { threadId, runId, toolCallId, context, showToast = true } = options;
  
  // Log the error with context
  console.error(`Error ${context ? `in ${context}` : ''}:`, error);
  
  // Show toast notification if enabled
  if (showToast) {
    toast.error(error.message || "An error occurred");
  }
  
  // Submit error to OpenAI if thread info is available
  if (threadId && runId && toolCallId) {
    try {
      await submitToolOutput(threadId, runId, toolCallId, {
        success: false,
        error: error.message || "Unknown error",
        context
      });
    } catch (submitError) {
      console.error("Failed to submit error response:", submitError);
    }
  }
  
  return error;
}; 