
import { FollowupButton } from "@/components/FollowupButton";
import { Button } from "@/components/ui/button";
import { Mail, Calendar, MessageSquare } from "lucide-react";

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
      
      <Button variant="outline" size="sm">
        <Calendar className="h-4 w-4 mr-2" />
        Schedule Call
      </Button>
      
      <Button variant="outline" size="sm">
        <MessageSquare className="h-4 w-4 mr-2" />
        Chat
      </Button>
    </div>
  );
};

export default LeadActions;
