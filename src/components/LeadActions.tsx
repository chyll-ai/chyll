
import FollowupButton from "@/components/FollowupButton";
import ScheduleCallButton from "@/components/ScheduleCallButton";
import ChatButton from "@/components/ChatButton";
import { Button } from "@/components/ui/button";
import { Mail } from "lucide-react";

interface LeadActionsProps {
  leadId: string;
  email?: string;
}

export const LeadActions = ({ leadId, email }: LeadActionsProps) => {
  return (
    <div className="flex flex-wrap gap-2">
      {email && (
        <Button
          variant="outline"
          size="sm"
          onClick={() => window.location.href = `mailto:${email}`}
        >
          <Mail className="h-4 w-4 mr-2" />
          Direct Email
        </Button>
      )}
      
      <FollowupButton leadId={leadId} />
      
      <ScheduleCallButton leadId={leadId} email={email} />
      
      <ChatButton leadId={leadId} />
    </div>
  );
};

export default LeadActions;
