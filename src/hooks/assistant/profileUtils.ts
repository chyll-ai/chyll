
// Helper function to check if a message matches certain patterns for profile onboarding
export const isProfileQuestion = (message: string): string | null => {
  const lowerMessage = message.toLowerCase();
  
  if (lowerMessage.includes("company name") && lowerMessage.includes("what is")) {
    return "company_name";
  }
  if (lowerMessage.includes("industry") && (lowerMessage.includes("what") || lowerMessage.includes("which"))) {
    return "industry";
  }
  if (lowerMessage.includes("target audience") || lowerMessage.includes("ideal customer")) {
    return "icp";
  }
  if (lowerMessage.includes("value proposition") || lowerMessage.includes("value prop")) {
    return "value_prop";
  }
  if (lowerMessage.includes("tone") && lowerMessage.includes("prefer")) {
    return "tone";
  }
  
  return null;
};
