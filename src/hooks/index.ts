
// This is a barrel file to export all hooks
export { default as useAssistantChat } from './assistant/useAssistantChat';
export { handleFunctionCall } from '@/lib/handleFunctionCall';
export { isProfileQuestion } from './assistant/profileUtils';
export type { Message, ToolCall, ClientProfile } from './assistant/types';
