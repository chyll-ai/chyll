
import { APIClient } from '@/lib/api-client';

interface FunctionCall {
  id: string;
  function: {
    name: string;
    arguments: string;
  };
}

export const handleFunctionCall = async (functionCall: FunctionCall, userId: string) => {
  const apiClient = APIClient.getInstance();
  
  try {
    const functionName = functionCall.function.name;
    const functionArgs = JSON.parse(functionCall.function.arguments);
    
    console.log(`Handling function call: ${functionName}`, functionArgs);
    
    // Handle different function calls based on their name
    switch (functionName) {
      case 'search_leads':
        return await apiClient.post('/lead-search', {
          ...functionArgs,
          userId
        });
      
      case 'send_email':
        return await apiClient.post('/send-email', {
          ...functionArgs,
          userId
        });
      
      default:
        throw new Error(`Unknown function: ${functionName}`);
    }
  } catch (error) {
    console.error('Error handling function call:', error);
    throw error;
  }
};
