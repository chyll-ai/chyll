import React from 'react';
import { Link, useLocation } from 'react-router-dom';
import { useLanguage } from '@/context/LanguageContext';
import LanguageSwitcher from '@/components/LanguageSwitcher';

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
  tagline,
  menuItems,
  copyright = "© 2025 chyll.ai",
  bottomLinks = [
    { text: "Conditions Générales", url: "/terms" },
    { text: "Politique de Confidentialité", url: "/privacy" },
    { text: "Politique des Cookies", url: "/cookies" },
  ],
}: Footer2Props) {
  const { t } = useLanguage();
  const location = useLocation();
  const isBlogPage = location.pathname === '/blog' || location.pathname.startsWith('/blog/');
  
  // Define simplified menu items for blog pages
  const defaultBlogMenuItems = [
    {
      title: "Entreprise",
      links: [
        { text: "À propos", url: "/about-us" },
        { text: "Contact", url: "/contact" },
      ],
    },
    {
      title: "Ressources",
      links: [
        { text: "Blog", url: "/blog" },
        { text: "FAQ", url: "/faq" },
      ],
    },
  ];
  
  // Define default menu items for other pages
  const defaultMenuItems = [
    {
      title: "Produit",
      links: [
        { text: "Fonctionnalités", url: "#features" },
        { text: "Comment ça marche", url: "#how-it-works" },
        { text: "Tarifs", url: "#pricing" },
        { text: "Blog", url: "/blog" },
      ],
    },
    {
      title: "Entreprise",
      links: [
        { text: "À propos", url: "/about-us" },
        { text: "Contact", url: "/contact" },
      ],
    },
    {
      title: "Ressources",
      links: [
        { text: "Blog", url: "/blog" },
        { text: "FAQ", url: "/faq" },
        { text: "Support", url: "/support" },
      ],
    },
  ];
  
  // Use provided menu items or fallback to defaults based on page type
  const displayMenuItems = menuItems || (isBlogPage ? defaultBlogMenuItems : defaultMenuItems);
  
  // Use provided props or fallback to translations
  const displayTagline = tagline || t.footer.tagline;
  const displayCopyright = copyright || "© 2025 chyll.ai";

  // Map bottom links to translations if not provided explicitly
  const displayBottomLinks = bottomLinks.map(link => {
    if (link.text === "Terms of Service" || link.text === "Conditions Générales") {
      return { ...link, text: t.footer.links.terms };
    }
    if (link.text === "Privacy Policy" || link.text === "Politique de Confidentialité") {
      return { ...link, text: t.footer.links.privacy };
    }
    if (link.text === "Cookie Policy" || link.text === "Politique de Cookies") {
      return { ...link, text: t.footer.links.cookies };
    }
    return link;
  });

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
              <p className="mt-4 font-bold text-[#aaadb0]">{displayTagline}</p>
              <p className="mt-2 text-[#8E9196]">hello@chyll.ai</p>
              <div className="mt-4">
                <LanguageSwitcher />
              </div>
            </div>
            {displayMenuItems.map((section, sectionIdx) => (
              <div key={sectionIdx}>
                <h3 className="mb-4 font-bold text-white">{
                  section.title === "Product" || section.title === "Produit" ? t.footer.menuTitles.product :
                  section.title === "Company" || section.title === "Entreprise" ? t.footer.menuTitles.company :
                  section.title === "Resources" || section.title === "Ressources" ? t.footer.menuTitles.resources :
                  section.title === "Connect" || section.title === "Contact" ? t.footer.menuTitles.connect :
                  section.title
                }</h3>
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
            <p>{displayCopyright}</p>
            <ul className="flex flex-wrap gap-4">
              {displayBottomLinks.map((link, linkIdx) => (
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
