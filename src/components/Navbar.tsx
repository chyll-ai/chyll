
import React, { useState } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { Button } from "@/components/ui/button";
import { Sheet, SheetContent, SheetDescription, SheetHeader, SheetTitle, SheetTrigger } from "@/components/ui/sheet";
import { Menu } from "lucide-react";
import { useTranslation } from '@/contexts/TranslationContext';
import LanguageSwitcher from './LanguageSwitcher';

interface NavbarProps {
  currentPath?: string;
}

interface NavLinkProps {
  to: string;
  children: React.ReactNode;
}

const NavLink: React.FC<NavLinkProps> = ({ to, children }) => {
  const location = useLocation();
  const isActive = location.pathname === to;
  return (
    <Link to={to} className={`px-3 py-2 rounded-md hover:bg-gray-100 ${isActive ? 'font-semibold text-indigo-600' : 'text-gray-700'}`}>
      {children}
    </Link>
  );
};

const Navbar: React.FC<NavbarProps> = ({ currentPath }) => {
  const [isOpen, setIsOpen] = useState(false);
  const location = useLocation();
  const { t } = useTranslation();
  
  // Use the currentPath prop if provided, otherwise use the location from the router
  const activePath = currentPath || location.pathname;
  
  const navLinkClasses = "inline-flex items-center justify-center whitespace-nowrap rounded-md text-sm font-medium transition-colors focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring disabled:pointer-events-none disabled:opacity-50 text-gray-700 hover:text-gray-900 px-3 py-2";

  const checkActivePath = (path: string) => {
    return location.hash === path ? 'text-indigo-600 font-semibold' : '';
  };

  return (
    <header className="border-b border-gray-100 bg-white/80 backdrop-blur-md fixed top-0 left-0 right-0 z-50">
      <div className="container-custom mx-auto flex h-16 items-center justify-between px-4">
        <div className="flex items-center">
          <Link to="/" className="flex items-center gap-2">
            <img src="/logo.svg" alt="Logo" className="h-8" />
            <span className="font-bold text-xl">GenerativSchool</span>
          </Link>
        </div>

        <nav className="hidden md:flex items-center space-x-1">
          <Link to="/#features" className={`${navLinkClasses} ${checkActivePath('/#features')}`}>{t('features')}</Link>
          <Link to="/#how-it-works" className={`${navLinkClasses} ${checkActivePath('/#how-it-works')}`}>{t('how_it_works')}</Link>
          <Link to="/#pricing" className={`${navLinkClasses} ${checkActivePath('/#pricing')}`}>{t('pricing')}</Link>
          <Link to="/documentation" className={`${navLinkClasses} ${checkActivePath('/documentation')}`}>{t('documentation')}</Link>
          <Link to="/faq" className={`${navLinkClasses} ${checkActivePath('/faq')}`}>{t('faq')}</Link>
          <Link to="/blog" className={`${navLinkClasses} ${checkActivePath('/blog')}`}>{t('blog')}</Link>
          <Link to="/contact" className={`${navLinkClasses} ${checkActivePath('/contact')}`}>{t('contact')}</Link>
          <LanguageSwitcher />
        </nav>

        <Sheet open={isOpen} onOpenChange={setIsOpen}>
          <SheetTrigger asChild>
            <Button variant="ghost" className="md:hidden">
              <Menu className="h-4 w-4" />
            </Button>
          </SheetTrigger>
          <SheetContent side="right" className="w-full sm:w-64">
            <SheetHeader>
              <SheetTitle>Menu</SheetTitle>
              <SheetDescription>
                Explore the platform and discover new possibilities.
              </SheetDescription>
            </SheetHeader>
            <div className="grid gap-4 py-4">
              <NavLink to="/#features">Features</NavLink>
              <NavLink to="/#how-it-works">How It Works</NavLink>
              <NavLink to="/#pricing">Pricing</NavLink>
              <NavLink to="/documentation">Documentation</NavLink>
              <NavLink to="/faq">FAQ</NavLink>
              <NavLink to="/blog">Blog</NavLink>
              <NavLink to="/contact">Contact</NavLink>
            </div>
          </SheetContent>
        </Sheet>
      </div>
    </header>
  );
};

export default Navbar;
