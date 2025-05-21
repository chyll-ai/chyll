
import { useState } from 'react';
import { Button } from "@/components/ui/button";
import { Send } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "@/components/ui/sonner";

interface FollowupButtonProps {
  leadId: string;
  className?: string;
  variant?: "default" | "destructive" | "outline" | "secondary" | 
            "ghost" | "link" | null | undefined;
  size?: "default" | "sm" | "lg" | "icon" | null | undefined;
}

const FollowupButton = ({ 
  leadId, 
  className, 
  variant = "outline", 
  size = "sm" 
}: FollowupButtonProps) => {
  const [sending, setSending] = useState(false);

  const handleFollowUp = async () => {
    try {
      setSending(true);
      
      // Check authentication status
      const { data: sessionData } = await supabase.auth.getSession();
      if (!sessionData?.session) {
        toast.error("You need to be logged in to send follow-ups");
        return;
      }
      
      // Get client profile to check if they have a Calendly URL
      const { data: profileData, error: profileError } = await supabase
        .from('client_profile')
        .select('*')
        .eq('client_id', sessionData.session.user.id)
        .maybeSingle();
      
      if (profileError) {
        console.error("Error fetching profile:", profileError);
        toast.error("Could not access your profile information");
        return;
      }
      
      if (!profileData) {
        toast.error("Please complete your profile first");
        return;
      }
      
      // Call the send-followup function with the lead ID
      const { data, error } = await supabase.functions.invoke('send-followup', {
        body: { 
          lead_id: leadId,
          user_id: sessionData.session.user.id
        }
      });
      
      if (error) {
        console.error("Error sending follow-up:", error);
        toast.error("Failed to send follow-up message");
        return;
      }
      
      toast.success("Follow-up message sent successfully!");
      
    } catch (error) {
      console.error("Error in follow-up process:", error);
      toast.error("An error occurred while processing your request");
    } finally {
      setSending(false);
    }
  };

  return (
    <Button
      onClick={handleFollowUp}
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
          <Send className="h-4 w-4" />
          Send Follow-up
        </span>
      )}
    </Button>
  );
};

export default FollowupButton;
