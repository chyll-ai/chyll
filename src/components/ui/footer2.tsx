
import React from 'react';
import { Link } from 'react-router-dom';

interface MenuItem {
  title: string;
  links: {
    text: string;
    url: string;
  }[];
}

interface Footer2Props {
  tagline?: string;
  menuItems?: MenuItem[];
  copyright?: string;
  bottomLinks?: {
    text: string;
    url: string;
  }[];
}

export function Footer2({
  tagline = "L'agent IA qui transforme votre prospection B2B. Identifiez les bons prospects, obtenez leurs coordonnées complètes, suivez vos actions - automatiquement.",
  menuItems = [
    {
      title: "Produit",
      links: [
        { text: "Fonctionnalités", url: "#features" },
        { text: "Comment ça marche", url: "#how-it-works" },
        { text: "Tarifs", url: "#pricing" },
      ],
    },
    {
      title: "Entreprise",
      links: [
        { text: "À propos", url: "#" },
        { text: "Contact", url: "#" },
      ],
    },
    {
      title: "Ressources",
      links: [
        { text: "FAQ", url: "#faq" },
        { text: "Support", url: "#" },
      ],
    },
  ],
  copyright = "© 2025 chyll.ai",
  bottomLinks = [
    { text: "Conditions Générales", url: "/terms" },
    { text: "Politique de Confidentialité", url: "/privacy" },
    { text: "Politique des Cookies", url: "/cookies" },
  ],
}: Footer2Props) {
  return (
    <section className="py-16 bg-[#1A1F2C] text-white">
      <div className="container">
        <footer>
          <div className="grid grid-cols-2 gap-8 lg:grid-cols-6">
            <div className="col-span-2 mb-8 lg:mb-0">
              <Link to="/" className="inline-block">
                <img 
                  src="/lovable-uploads/6aebfbfd-ba13-4ef3-91a5-c262bd385900.png" 
                  alt="chyll.ai logo" 
                  className="h-12 mb-4" 
                />
              </Link>
              <p className="mt-4 font-bold text-[#aaadb0]">{tagline}</p>
              <p className="mt-2 text-[#8E9196]">hello@chyll.ai</p>
            </div>
            {menuItems.map((section, sectionIdx) => (
              <div key={sectionIdx}>
                <h3 className="mb-4 font-bold text-white">{section.title}</h3>
                <ul className="space-y-4 text-[#8E9196]">
                  {section.links.map((link, linkIdx) => (
                    <li
                      key={linkIdx}
                      className="font-medium hover:text-[#9b87f5] transition-colors"
                    >
                      {link.url.startsWith("#") || link.url.startsWith("http") ? (
                        <a href={link.url}>{link.text}</a>
                      ) : (
                        <Link to={link.url}>{link.text}</Link>
                      )}
                    </li>
                  ))}
                </ul>
              </div>
            ))}
          </div>
          <div className="mt-16 flex flex-col justify-between gap-4 border-t border-gray-700 pt-8 text-sm font-medium text-[#8E9196] md:flex-row md:items-center">
            <p>{copyright}</p>
            <ul className="flex flex-wrap gap-4">
              {bottomLinks.map((link, linkIdx) => (
                <li key={linkIdx} className="hover:text-[#9b87f5] transition-colors">
                  {link.url.startsWith("#") || link.url.startsWith("http") ? (
                    <a href={link.url}>{link.text}</a>
                  ) : (
                    <Link to={link.url}>{link.text}</Link>
                  )}
                </li>
              ))}
            </ul>
          </div>
        </footer>
      </div>
    </section>
  );
}
