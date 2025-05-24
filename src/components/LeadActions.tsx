
import FollowupButton from "@/components/FollowupButton";
import ScheduleCallButton from "@/components/ScheduleCallButton";
import ChatButton from "@/components/ChatButton";
import { Button } from "@/components/ui/button";
import { Mail } from "lucide-react";
import { useState, useEffect } from "react";
import { supabase } from "@/lib/supabase";

interface LeadActionsProps {
  leadId: string;
  email?: string;
}

export const LeadActions = ({ leadId, email }: LeadActionsProps) => {
  const [isAuthenticated, setIsAuthenticated] = useState<boolean>(false);

  useEffect(() => {
    const checkAuth = async () => {
      const { data } = await supabase.auth.getSession();
      setIsAuthenticated(!!data.session);
    };
    
    checkAuth();
    
    // Set up auth state listener
    const { data: { subscription } } = supabase.auth.onAuthStateChange(
      (_, session) => {
        setIsAuthenticated(!!session);
      }
    );
    
    return () => {
      subscription.unsubscribe();
    };
  }, []);

  if (!isAuthenticated) {
    return (
      <div className="text-sm text-muted-foreground">
        Please <a href="/login" className="underline">login</a> to interact with leads
      </div>
    );
  }

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
