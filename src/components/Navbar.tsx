
import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Menu, X, ChevronDown } from 'lucide-react';
import { Link } from 'react-router-dom';
import {
  NavigationMenu,
  NavigationMenuContent,
  NavigationMenuItem,
  NavigationMenuLink,
  NavigationMenuList,
  NavigationMenuTrigger,
} from "@/components/ui/navigation-menu";

const Navbar = () => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  return (
    <nav className="bg-white/90 backdrop-blur-sm sticky top-0 z-50 border-b border-gray-100">
      <div className="container-custom flex justify-between items-center py-4">
        <div className="flex items-center">
          <Link to="/" className="text-2xl font-bold text-gray-800">
            GenerativSchool
          </Link>
        </div>

        {/* Desktop Navigation */}
        <div className="hidden md:flex items-center space-x-8">
          <a href="#features" className="text-gray-700 hover:text-brand-blue transition-colors">Features</a>
          <a href="#how-it-works" className="text-gray-700 hover:text-brand-blue transition-colors">How It Works</a>
          <a href="#pricing" className="text-gray-700 hover:text-brand-blue transition-colors">Pricing</a>
          
          <NavigationMenu>
            <NavigationMenuList>
              <NavigationMenuItem>
                <NavigationMenuTrigger className="text-gray-700 hover:text-brand-blue transition-colors">
                  Company
                </NavigationMenuTrigger>
                <NavigationMenuContent>
                  <div className="grid w-[400px] gap-3 p-4">
                    <NavigationMenuLink asChild>
                      <Link 
                        to="/about-us"
                        className="block p-3 space-y-1 rounded-md hover:bg-gray-50"
                      >
                        <div className="font-medium">About Us</div>
                        <div className="text-sm text-gray-600">
                          Learn about our mission and vision
                        </div>
                      </Link>
                    </NavigationMenuLink>
                    <NavigationMenuLink asChild>
                      <Link 
                        to="/careers"
                        className="block p-3 space-y-1 rounded-md hover:bg-gray-50"
                      >
                        <div className="font-medium">Careers</div>
                        <div className="text-sm text-gray-600">
                          Join our team and help build the future
                        </div>
                      </Link>
                    </NavigationMenuLink>
                    <NavigationMenuLink asChild>
                      <Link 
                        to="/contact"
                        className="block p-3 space-y-1 rounded-md hover:bg-gray-50"
                      >
                        <div className="font-medium">Contact Us</div>
                        <div className="text-sm text-gray-600">
                          Get in touch with our team
                        </div>
                      </Link>
                    </NavigationMenuLink>
                  </div>
                </NavigationMenuContent>
              </NavigationMenuItem>
              
              <NavigationMenuItem>
                <NavigationMenuTrigger className="text-gray-700 hover:text-brand-blue transition-colors">
                  Resources
                </NavigationMenuTrigger>
                <NavigationMenuContent>
                  <div className="grid w-[400px] gap-3 p-4">
                    <NavigationMenuLink asChild>
                      <Link 
                        to="/blog"
                        className="block p-3 space-y-1 rounded-md hover:bg-gray-50"
                      >
                        <div className="font-medium">Blog</div>
                        <div className="text-sm text-gray-600">
                          Insights and updates from our team
                        </div>
                      </Link>
                    </NavigationMenuLink>
                    <NavigationMenuLink asChild>
                      <Link 
                        to="/faq"
                        className="block p-3 space-y-1 rounded-md hover:bg-gray-50"
                      >
                        <div className="font-medium">FAQ</div>
                        <div className="text-sm text-gray-600">
                          Answers to common questions
                        </div>
                      </Link>
                    </NavigationMenuLink>
                    <NavigationMenuLink asChild>
                      <Link 
                        to="/support"
                        className="block p-3 space-y-1 rounded-md hover:bg-gray-50"
                      >
                        <div className="font-medium">Support</div>
                        <div className="text-sm text-gray-600">
                          Get help with our platform
                        </div>
                      </Link>
                    </NavigationMenuLink>
                    <NavigationMenuLink asChild>
                      <Link 
                        to="/documentation"
                        className="block p-3 space-y-1 rounded-md hover:bg-gray-50"
                      >
                        <div className="font-medium">Documentation</div>
                        <div className="text-sm text-gray-600">
                          Detailed guides and reference materials
                        </div>
                      </Link>
                    </NavigationMenuLink>
                  </div>
                </NavigationMenuContent>
              </NavigationMenuItem>
            </NavigationMenuList>
          </NavigationMenu>
          
          <Button variant="rainbow" asChild>
            <a href="https://api.leadconnectorhq.com/widget/booking/XvUg6399vyVtvCXETgsY" target="_blank" rel="noopener noreferrer">
              Book a Demo
            </a>
          </Button>
        </div>

        {/* Mobile Menu Button */}
        <div className="md:hidden">
          <button 
            onClick={() => setIsMenuOpen(!isMenuOpen)}
            className="text-gray-700 hover:text-brand-blue"
          >
            {isMenuOpen ? <X size={24} /> : <Menu size={24} />}
          </button>
        </div>
      </div>

      {/* Mobile Menu */}
      {isMenuOpen && (
        <div className="md:hidden bg-white border-t border-gray-100 animate-fade-in">
          <div className="container-custom py-4 flex flex-col space-y-4">
            <a 
              href="#features" 
              className="text-gray-700 hover:text-brand-blue py-2 transition-colors"
              onClick={() => setIsMenuOpen(false)}
            >
              Features
            </a>
            <a 
              href="#how-it-works" 
              className="text-gray-700 hover:text-brand-blue py-2 transition-colors"
              onClick={() => setIsMenuOpen(false)}
            >
              How It Works
            </a>
            <a 
              href="#pricing" 
              className="text-gray-700 hover:text-brand-blue py-2 transition-colors"
              onClick={() => setIsMenuOpen(false)}
            >
              Pricing
            </a>
            
            {/* Mobile Company submenu */}
            <div className="py-2">
              <div className="flex items-center justify-between">
                <span className="text-gray-700 font-medium">Company</span>
                <ChevronDown size={16} className="text-gray-500" />
              </div>
              <div className="pl-4 mt-2 space-y-2 border-l border-gray-200">
                <Link 
                  to="/about-us" 
                  className="block text-gray-700 hover:text-brand-blue py-1 transition-colors"
                  onClick={() => setIsMenuOpen(false)}
                >
                  About Us
                </Link>
                <Link 
                  to="/careers" 
                  className="block text-gray-700 hover:text-brand-blue py-1 transition-colors"
                  onClick={() => setIsMenuOpen(false)}
                >
                  Careers
                </Link>
                <Link 
                  to="/contact" 
                  className="block text-gray-700 hover:text-brand-blue py-1 transition-colors"
                  onClick={() => setIsMenuOpen(false)}
                >
                  Contact Us
                </Link>
              </div>
            </div>
            
            {/* Mobile Resources submenu */}
            <div className="py-2">
              <div className="flex items-center justify-between">
                <span className="text-gray-700 font-medium">Resources</span>
                <ChevronDown size={16} className="text-gray-500" />
              </div>
              <div className="pl-4 mt-2 space-y-2 border-l border-gray-200">
                <Link 
                  to="/blog" 
                  className="block text-gray-700 hover:text-brand-blue py-1 transition-colors"
                  onClick={() => setIsMenuOpen(false)}
                >
                  Blog
                </Link>
                <Link 
                  to="/faq" 
                  className="block text-gray-700 hover:text-brand-blue py-1 transition-colors"
                  onClick={() => setIsMenuOpen(false)}
                >
                  FAQ
                </Link>
                <Link 
                  to="/support" 
                  className="block text-gray-700 hover:text-brand-blue py-1 transition-colors"
                  onClick={() => setIsMenuOpen(false)}
                >
                  Support
                </Link>
                <Link 
                  to="/documentation" 
                  className="block text-gray-700 hover:text-brand-blue py-1 transition-colors"
                  onClick={() => setIsMenuOpen(false)}
                >
                  Documentation
                </Link>
              </div>
            </div>
            
            <Button 
              variant="rainbow"
              className="w-full"
              onClick={() => setIsMenuOpen(false)}
              asChild
            >
              <a href="https://api.leadconnectorhq.com/widget/booking/XvUg6399vyVtvCXETgsY" target="_blank" rel="noopener noreferrer">
                Book a Demo
              </a>
            </Button>
          </div>
        </div>
      )}
    </nav>
  );
};

export default Navbar;
