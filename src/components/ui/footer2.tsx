
import React from "react";
import { Link } from "react-router-dom";

export function Footer2() {
  return (
    <footer className="bg-white border-t border-gray-200">
      <div className="container-custom py-12">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
          <div className="col-span-1 md:col-span-2">
            <Link to="/" className="inline-block mb-4">
              <span className="text-2xl font-bold text-blue-600">chyll.ai</span>
            </Link>
            <p className="text-gray-600 mb-4">
              chyll.ai est une solution d'automatisation de prospection commerciale qui trouve les bons prospects, 
              les enrichit avec emails et téléphones vérifiés, et met à jour votre CRM.
            </p>
            <p className="text-gray-500 text-sm">
              © {new Date().getFullYear()} chyll.ai. Tous droits réservés.
            </p>
          </div>
          
          <div>
            <h3 className="font-semibold mb-4">Mentions légales</h3>
            <ul className="space-y-2">
              <li>
                <Link to="/terms" className="text-gray-600 hover:text-blue-600">
                  Conditions d'utilisation
                </Link>
              </li>
              <li>
                <Link to="/privacy" className="text-gray-600 hover:text-blue-600">
                  Politique de confidentialité
                </Link>
              </li>
              <li>
                <Link to="/cookies" className="text-gray-600 hover:text-blue-600">
                  Politique des cookies
                </Link>
              </li>
            </ul>
          </div>
          
          <div>
            <h3 className="font-semibold mb-4">Contact</h3>
            <address className="not-italic text-gray-600">
              <p>60 RUE FRANCOIS IER</p>
              <p>75008 PARIS, FRANCE</p>
              <p className="mt-2">
                <a href="mailto:contact@chyll.ai" className="hover:text-blue-600">
                  contact@chyll.ai
                </a>
              </p>
            </address>
          </div>
        </div>
      </div>
    </footer>
  );
}
