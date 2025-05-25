import React from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '@/context/AuthContext';
import { Button } from '@/components/ui/button';

const Onboarding = () => {
  const navigate = useNavigate();
  const { user } = useAuth();

  const handleContinue = () => {
    navigate('/dashboard');
  };

  if (!user) {
    return null;
  }

  return (
    <div className="flex min-h-screen flex-col items-center justify-center p-4">
      <div className="w-full max-w-md space-y-8">
        <div className="text-center">
          <h1 className="text-4xl font-bold">Welcome!</h1>
          <p className="mt-2 text-gray-600">
            Let's get started with your AI assistant.
          </p>
        </div>
        <Button onClick={handleContinue} className="w-full">
          Continue to Dashboard
        </Button>
      </div>
    </div>
  );
};

export default Onboarding;
