
import React from 'react';
import { Link } from 'react-router-dom';

export function NotFoundPage() {
  return (
    <div className="flex flex-col items-center justify-center min-h-[70vh] py-16">
      <div className="text-center">
        <h1 className="text-6xl font-bold text-gray-900 mb-4">Page Non Trouvée</h1>
        <p className="text-xl text-gray-600 mb-8">
          Désolé, la page que vous recherchez n'existe pas ou a été déplacée.
        </p>
        <Link
          to="/"
          className="inline-flex items-center px-6 py-3 border border-transparent text-base font-medium rounded-md shadow-sm text-white bg-brand-blue hover:bg-brand-blue-dark transition-colors"
        >
          Retour à l'accueil
        </Link>
      </div>
    </div>
  );
}
