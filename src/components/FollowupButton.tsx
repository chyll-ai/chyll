import { Button } from "@/components/ui/button";
import { useFollowup } from "@/hooks/useFollowup";

interface FollowupButtonProps {
  leadId: string;
  className?: string;
  variant?: "outline" | "default" | "destructive" | "secondary" | "ghost" | "link";
  size?: "default" | "sm" | "lg" | "icon";
}

const FollowupButton = ({ 
  leadId, 
  className, 
  variant = "outline", 
  size = "sm" 
}: FollowupButtonProps) => {
  const { sending, sendFollowup } = useFollowup();

  return (
    <Button
      variant={variant}
      size={size}
      className={className}
      onClick={() => sendFollowup(leadId)}
      disabled={sending}
    >
      {sending ? "Sending..." : "Follow Up"}
    </Button>
  );
};

export default FollowupButton;
