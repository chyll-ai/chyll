import React from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { LogOut, LogIn, UserPlus } from 'lucide-react';
import { useAuth } from '@/context/AuthContext';
import { AuthProvider } from '@/context/AuthContext';

const HeaderContent = () => {
  const { isAuthenticated, signOut, user } = useAuth();
  const navigate = useNavigate();

  const handleSignIn = () => {
    navigate('/login');
  };

  const handleDashboard = () => {
    navigate('/dashboard');
  };

  return (
    <header className="sticky top-0 z-50 w-full border-b border-border bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
      <div className="container flex h-14 items-center justify-between">
        <Link to="/" className="flex items-center space-x-2">
          <img 
            src="/lovable-uploads/6aebfbfd-ba13-4ef3-91a5-c262bd385900.png" 
            alt="chyll.ai logo" 
            className="h-8" 
          />
          <span className="font-bold">Chyll</span>
        </Link>

        <nav className="flex items-center gap-4">
          {isAuthenticated ? (
            <div className="flex items-center gap-2">
              <Button
                variant="ghost"
                size="sm"
                onClick={handleDashboard}
                className="flex items-center gap-2"
              >
                Dashboard
              </Button>
              <Button
                variant="ghost"
                size="icon"
                onClick={signOut}
                className="h-8 w-8"
                title="Sign out"
              >
                <LogOut className="h-4 w-4" />
              </Button>
            </div>
          ) : (
            <div className="flex items-center gap-2">
              <Button
                variant="ghost"
                size="sm"
                onClick={handleSignIn}
                className="flex items-center gap-2"
              >
                <LogIn className="h-4 w-4" />
                Sign in
              </Button>
              <Button
                variant="default"
                size="sm"
                onClick={handleSignIn}
                className="flex items-center gap-2"
              >
                <UserPlus className="h-4 w-4" />
                Sign up
              </Button>
            </div>
          )}
        </nav>
      </div>
    </header>
  );
};

const Header = () => (
  <AuthProvider>
    <HeaderContent />
  </AuthProvider>
);

export default Header;
