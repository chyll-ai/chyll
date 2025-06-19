
import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Mail, Sparkles } from 'lucide-react';
import { useWaitlist } from '@/hooks/useWaitlist';

interface WaitlistJoinFormProps {
  onSuccess: (data: any) => void;
  referralCode?: string;
}

const WaitlistJoinForm: React.FC<WaitlistJoinFormProps> = ({ onSuccess, referralCode }) => {
  const [email, setEmail] = useState('');
  const { joinWaitlist, loading } = useWaitlist();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!email) return;

    try {
      const data = await joinWaitlist(email, referralCode);
      onSuccess(data);
    } catch (error) {
      // Error is handled in the hook
    }
  };

  return (
    <Card className="w-full max-w-md mx-auto">
      <CardHeader className="text-center">
        <CardTitle className="flex items-center justify-center gap-2">
          <Sparkles className="h-5 w-5 text-primary" />
          Rejoindre la liste d'attente
        </CardTitle>
        {referralCode && (
          <p className="text-sm text-green-600">
            🎉 Vous avez été parrainé ! +10 points bonus
          </p>
        )}
      </CardHeader>
      <CardContent>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="relative">
            <Mail className="absolute left-3 top-3 h-5 w-5 text-gray-400" />
            <Input
              type="email"
              placeholder="Votre adresse email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
              className="pl-10"
            />
          </div>
          
          <Button 
            type="submit" 
            className="w-full"
            variant="rainbow"
            disabled={loading || !email}
          >
            {loading ? 'Inscription...' : 'Rejoindre la liste d\'attente'}
          </Button>
          
          <p className="text-xs text-gray-500 text-center">
            En vous inscrivant, vous acceptez nos conditions d'utilisation et notre politique de confidentialité.
          </p>
        </form>
      </CardContent>
    </Card>
  );
};

export default WaitlistJoinForm;
