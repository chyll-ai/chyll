import React, { useState } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { LogOut, LogIn, UserPlus, Home, Loader2 } from 'lucide-react';
import { useAuth } from '@/context/AuthContext';
import { toast } from '@/components/ui/sonner';

// Separate the auth-dependent part
const AuthButtons = () => {
  const { isAuthenticated, signOut, isLoading } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();
  const [isSigningOut, setIsSigningOut] = useState(false);

  const handleSignIn = () => {
    // Store the current location for redirect after login
    navigate('/login', { state: { from: location.pathname } });
  };

  const handleDashboard = () => {
    navigate('/dashboard');
  };

  const handleSignOut = async () => {
    if (isSigningOut) return; // Prevent multiple clicks
    
    try {
      setIsSigningOut(true);
      await signOut();
      toast.success('Successfully signed out');
    } catch (error) {
      console.error('Error signing out:', error);
      toast.error('Failed to sign out. Please try again.');
    } finally {
      setIsSigningOut(false);
    }
  };

  // Don't show buttons while auth is loading
  if (isLoading) {
    return (
      <div className="flex items-center gap-2">
        <div className="h-8 w-8 animate-pulse rounded-full bg-gray-200" />
      </div>
    );
  }

  if (isAuthenticated) {
    return (
      <div className="flex items-center gap-2">
        <Button
          variant="ghost"
          size="sm"
          onClick={handleDashboard}
          className="flex items-center gap-2"
          disabled={isSigningOut}
        >
          Dashboard
        </Button>
        <Button
          variant="ghost"
          size="icon"
          onClick={handleSignOut}
          className="h-8 w-8 relative"
          title="Sign out"
          disabled={isSigningOut}
        >
          {isSigningOut ? (
            <Loader2 className="h-4 w-4 animate-spin absolute" />
          ) : (
            <LogOut className="h-4 w-4" />
          )}
        </Button>
      </div>
    );
  }

  return (
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
  );
};

const Header = () => {
  const location = useLocation();
  const isHome = location.pathname === '/';

  return (
    <header className="sticky top-0 z-50 w-full border-b border-border/40 bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
      <div className="container flex h-14 max-w-screen-2xl items-center">
        <div className="flex flex-1 items-center justify-between">
          <Link 
            to="/" 
            className="flex items-center space-x-2"
          >
            {!isHome && <Home className="h-5 w-5" />}
            <span className="font-bold">Chyll</span>
          </Link>
          <AuthButtons />
        </div>
      </div>
    </header>
  );
};

export default Header;
