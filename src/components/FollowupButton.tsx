
import { useState } from 'react';
import { Button } from "@/components/ui/button";
import { Mail } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "@/components/ui/sonner";

interface FollowupButtonProps {
  leadId: string;
  className?: string;
  variant?: "default" | "destructive" | "outline" | "secondary" | 
            "ghost" | "link" | null | undefined;
  size?: "default" | "sm" | "lg" | "icon" | null | undefined;
}

const FollowupButton = ({ leadId, className, variant = "outline", size = "sm" }: FollowupButtonProps) => {
  const [sending, setSending] = useState(false);

  const sendFollowup = async () => {
    try {
      setSending(true);
      
      // Get current user session
      const { data: sessionData } = await supabase.auth.getSession();
      if (!sessionData?.session) {
        toast.error("You need to be logged in to send followups");
        return;
      }
      
      // Call the edge function
      const { error: invokeError } = await supabase.functions.invoke("send-followup", {
        body: {
          user_id: sessionData.session.user.id,
          lead_id: leadId
        }
      });
      
      if (invokeError) {
        console.error("Error sending followup:", invokeError);
        toast.error("Failed to send followup email");
        return;
      }
      
      toast.success("Followup email sent successfully!");
    } catch (error) {
      console.error("Error sending followup:", error);
      toast.error("An error occurred while sending the followup");
    } finally {
      setSending(false);
    }
  };

  return (
    <Button
      onClick={sendFollowup}
      disabled={sending}
      className={className}
      variant={variant}
      size={size}
    >
      {sending ? (
        <span className="flex items-center gap-2">
          <svg className="animate-spin h-4 w-4" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
            <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
            <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
          </svg>
          Sending...
        </span>
      ) : (
        <span className="flex items-center gap-2">
          <Mail className="h-4 w-4" />
          Send Followup
        </span>
      )}
    </Button>
  );
};

export default FollowupButton;
