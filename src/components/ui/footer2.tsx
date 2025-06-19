
import React from 'react';
import { Link } from 'react-router-dom';
import { useLanguage } from '@/context/LanguageContext';
import { Globe, Mail, Users } from "lucide-react";
import { Button } from '@/components/ui/button';

export function Footer2() {
  const { language } = useLanguage();
  const currentYear = new Date().getFullYear();
  
  return (
    <footer className="bg-gray-900 text-white">
      <div className="container-custom py-12 md:py-16">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          <div className="col-span-1 md:col-span-2">
            <div className="mb-6">
              <Link to="/">
                <img 
                  src="/lovable-uploads/6aebfbfd-ba13-4ef3-91a5-c262bd385900.png" 
                  alt="chyll.ai logo" 
                  className="h-10" 
                />
              </Link>
            </div>
            <p className="text-gray-300 mb-6 max-w-md">
              L'assistant commercial IA qui automatise votre prospection B2B.
            </p>
            <div className="flex space-x-4">
              <a href="https://twitter.com/chyllai" className="text-gray-400 hover:text-white transition-colors">
                <span className="sr-only">Twitter</span>
                <svg className="h-6 w-6" fill="currentColor" viewBox="0 0 24 24">
                  <path d="M8.29 20.251c7.547 0 11.675-6.253 11.675-11.675 0-.178 0-.355-.012-.53A8.348 8.348 0 0022 5.92a8.19 8.19 0 01-2.357.646 4.118 4.118 0 001.804-2.27 8.224 8.224 0 01-2.605.996 4.107 4.107 0 00-6.993 3.743 11.65 11.65 0 01-8.457-4.287 4.106 4.106 0 001.27 5.477A4.072 4.072 0 012.8 9.713v.052a4.105 4.105 0 003.292 4.022 4.095 4.095 0 01-1.853.07 4.108 4.108 0 003.834 2.85A8.233 8.233 0 012 18.407a11.616 11.616 0 006.29 1.84" />
                </svg>
              </a>
              <a href="https://linkedin.com/company/chyll-ai" className="text-gray-400 hover:text-white transition-colors">
                <span className="sr-only">LinkedIn</span>
                <svg className="h-6 w-6" fill="currentColor" viewBox="0 0 24 24">
                  <path d="M19 0h-14c-2.761 0-5 2.239-5 5v14c0 2.761 2.239 5 5 5h14c2.762 0 5-2.239 5-5v-14c0-2.761-2.238-5-5-5zm-11 19h-3v-11h3v11zm-1.5-12.268c-.966 0-1.75-.79-1.75-1.764s.784-1.764 1.75-1.764 1.75.79 1.75 1.764-.783 1.764-1.75 1.764zm13.5 12.268h-3v-5.604c0-3.368-4-3.113-4 0v5.604h-3v-11h3v1.765c1.396-2.586 7-2.777 7 2.476v6.759z" />
                </svg>
              </a>
            </div>
            <div className="mt-6 text-gray-400">
              <div className="flex items-center mb-2">
                <Mail className="w-4 h-4 mr-2" />
                <a href="mailto:contact@chyll.ai" className="hover:text-white transition-colors">contact@chyll.ai</a>
              </div>
              <div className="flex items-center">
                <Globe className="w-4 h-4 mr-2" />
                <span>+33 6 99 40 76 73</span>
              </div>
            </div>
            <p className="text-gray-500 mt-6 text-sm">
              © {currentYear} chyll.ai. Tous droits réservés.
            </p>
          </div>

          <div>
            <h3 className="text-lg font-medium mb-4">Ressources</h3>
            <div className="space-y-4">
              <div>
                <Link to="/blog" className="text-gray-300 hover:text-white transition-colors block">
                  Blog
                </Link>
              </div>
              <div>
                <Button size="sm" variant="rainbow" className="gap-2" asChild>
                  <Link to="/waitlist">
                    <Users className="w-4 h-4" />
                    Rejoindre la liste d'attente
                  </Link>
                </Button>
              </div>
            </div>
            
            <div className="mt-8">
              <h4 className="text-sm font-medium mb-3 text-gray-300">Légal</h4>
              <ul className="space-y-2">
                <li><Link to="/privacy" className="text-gray-400 hover:text-white transition-colors text-sm">Confidentialité</Link></li>
                <li><Link to="/terms" className="text-gray-400 hover:text-white transition-colors text-sm">Conditions d'utilisation</Link></li>
                <li><Link to="/cookies" className="text-gray-400 hover:text-white transition-colors text-sm">Cookies</Link></li>
              </ul>
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
}

export default Footer2;
