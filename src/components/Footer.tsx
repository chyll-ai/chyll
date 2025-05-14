
import React from 'react';
import { Link } from 'react-router-dom';

const Footer = () => {
  const currentYear = new Date().getFullYear();

  return (
    <footer className="bg-gray-50 border-t border-gray-100">
      <div className="container-custom py-12">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
          <div className="col-span-1 md:col-span-2">
            <div className="mb-4">
              <Link to="/">
                <img 
                  src="/lovable-uploads/6aebfbfd-ba13-4ef3-91a5-c262bd385900.png" 
                  alt="chyll.ai logo" 
                  className="h-12" 
                />
              </Link>
            </div>
            <p className="text-gray-600 mb-4 max-w-md">
              L'agent IA qui transforme votre prospection B2B. Identifiez les bons prospects, obtenez leurs coordonnées complètes, suivez vos actions - automatiquement.
            </p>
            <p className="text-gray-500 text-sm">
              © 2025 chyll.ai
            </p>
          </div>

          <div>
            <h3 className="text-gray-800 font-medium mb-4">Produit</h3>
            <ul className="space-y-2">
              <li><a href="#features" className="text-gray-600 hover:text-brand-blue transition-colors">Fonctionnalités</a></li>
              <li><a href="#how-it-works" className="text-gray-600 hover:text-brand-blue transition-colors">Comment ça marche</a></li>
              <li><a href="#pricing" className="text-gray-600 hover:text-brand-blue transition-colors">Tarifs</a></li>
            </ul>
          </div>

          <div>
            <h3 className="text-gray-800 font-medium mb-4">Entreprise</h3>
            <ul className="space-y-2">
              <li><Link to="/about-us" className="text-gray-600 hover:text-brand-blue transition-colors">À propos</Link></li>
              <li><Link to="/careers" className="text-gray-600 hover:text-brand-blue transition-colors">Carrières</Link></li>
              <li><Link to="/contact" className="text-gray-600 hover:text-brand-blue transition-colors">Contact</Link></li>
              <li><Link to="/blog" className="text-gray-600 hover:text-brand-blue transition-colors">Blog</Link></li>
              <li><Link to="/faq" className="text-gray-600 hover:text-brand-blue transition-colors">FAQ</Link></li>
              <li><Link to="/support" className="text-gray-600 hover:text-brand-blue transition-colors">Support</Link></li>
              <li><Link to="/privacy" className="text-gray-600 hover:text-brand-blue transition-colors">Confidentialité</Link></li>
              <li><Link to="/terms" className="text-gray-600 hover:text-brand-blue transition-colors">Conditions</Link></li>
            </ul>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
