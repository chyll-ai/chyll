
import { useState } from 'react';
import { Button } from "@/components/ui/button";
import { Calendar } from "lucide-react";
import { supabase } from "@/lib/supabase";
import { toast } from "@/components/ui/sonner";

interface ScheduleCallButtonProps {
  leadId?: string;
  email?: string;
  className?: string;
  variant?: "default" | "destructive" | "outline" | "secondary" | 
            "ghost" | "link" | null | undefined;
  size?: "default" | "sm" | "lg" | "icon" | null | undefined;
}

const ScheduleCallButton = ({ 
  leadId, 
  email, 
  className, 
  variant = "default", 
  size = "sm" 
}: ScheduleCallButtonProps) => {
  const [scheduling, setScheduling] = useState(false);

  const handleScheduleCall = async () => {
    try {
      setScheduling(true);
      
      // If no leadId provided (homepage usage), open default Calendly
      if (!leadId) {
        window.open('https://cal.com/chyll.ai/30min', '_blank');
        toast.success("Calendly scheduling page opened");
        return;
      }
      
      // Get current user session
      const { data: sessionData } = await supabase.auth.getSession();
      if (!sessionData?.session) {
        toast.error("You need to be logged in to schedule calls");
        return;
      }
      
      // Get client profile to check if they have a calendly URL
      const { data: profileData, error: profileError } = await supabase
        .from('client_profile')
        .select('calendly_url')
        .eq('client_id', sessionData.session.user.id)
        .maybeSingle();
      
      if (profileError) {
        console.error("Error fetching profile:", profileError);
        toast.error("Could not access your profile information");
        return;
      }
      
      const calendlyUrl = profileData?.calendly_url;
      
      if (!calendlyUrl) {
        toast.error("Please set your Calendly URL in your profile first");
        return;
      }

      // If we have an email, add it as a prefilled parameter to the Calendly URL
      let finalUrl = calendlyUrl;
      if (email) {
        const separator = calendlyUrl.includes('?') ? '&' : '?';
        finalUrl += `${separator}email=${encodeURIComponent(email)}`;
      }
      
      // Open Calendly in a new tab
      window.open(finalUrl, '_blank');
      
      toast.success("Calendly scheduling page opened");
      
    } catch (error) {
      console.error("Error scheduling call:", error);
      toast.error("An error occurred while trying to schedule the call");
    } finally {
      setScheduling(false);
    }
  };

  return (
    <Button
      onClick={handleScheduleCall}
      disabled={scheduling}
      className={className}
      variant={variant}
      size={size}
    >
      {scheduling ? (
        <span className="flex items-center gap-2">
          <svg className="animate-spin h-4 w-4" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
            <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
            <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
          </svg>
          Opening...
        </span>
      ) : (
        <span className="flex items-center gap-2">
          <Calendar className="h-4 w-4" />
          {leadId ? "Schedule Call" : "Réserver une démo"}
        </span>
      )}
    </Button>
  );
};

export default ScheduleCallButton;
