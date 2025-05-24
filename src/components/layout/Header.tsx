import React from 'react';
import { Link } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { LogOut } from 'lucide-react';
import { useAuth } from '@/context/AuthContext';

const Header = () => {
  const { isAuthenticated, signOut } = useAuth();

  return (
    <header className="sticky top-0 z-50 w-full border-b border-border bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
      <div className="container flex h-14 items-center justify-between">
        <Link to="/" className="flex items-center space-x-2">
          <span className="font-bold">Chyll</span>
        </Link>

        <nav className="flex items-center gap-4">
          {isAuthenticated && (
            <Button
              variant="ghost"
              size="icon"
              onClick={signOut}
              className="h-8 w-8"
              title="Sign out"
            >
              <LogOut className="h-4 w-4" />
            </Button>
          )}
        </nav>
      </div>
    </header>
  );
};

export default Header; 