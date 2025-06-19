
import React from 'react';
import { Link } from 'react-router-dom';
import { ArrowLeft, Home } from 'lucide-react';

export function NotFoundPage() {
  return (
    <div className="flex flex-col items-center justify-center min-h-[70vh] py-16">
      <div className="text-center">
        <h1 className="text-6xl font-bold text-gray-900 mb-4">
          404 - Page non trouvée
        </h1>
        <p className="text-xl text-gray-600 mb-8">
          La page que vous recherchez n'existe pas.
        </p>
        
        <div className="flex flex-col sm:flex-row gap-4 justify-center">
          <Link
            to="/"
            className="inline-flex items-center px-6 py-3 border border-transparent text-base font-medium rounded-md shadow-sm text-white bg-brand-blue hover:bg-brand-blue-dark transition-colors"
          >
            <Home className="mr-2" size={18} />
            Retour à l'accueil
          </Link>
          
          <button 
            onClick={() => window.history.back()}
            className="inline-flex items-center px-6 py-3 border border-gray-300 text-base font-medium rounded-md shadow-sm text-gray-700 bg-white hover:bg-gray-50 transition-colors"
          >
            <ArrowLeft className="mr-2" size={18} />
            Retour à la page précédente
          </button>
        </div>
      </div>
    </div>
  );
}
