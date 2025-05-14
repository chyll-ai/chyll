
import { Footer2 } from "@/components/ui/footer2";
import { Link } from 'react-router-dom';

function Footer2Demo() {
  const demoData = {
    tagline: "L'agent IA qui transforme votre prospection B2B. Identifiez les bons prospects, obtenez leurs coordonnées complètes, suivez vos actions - automatiquement.",
    menuItems: [
      {
        title: "Produit",
        links: [
          { text: "Présentation", url: "#" },
          { text: "Fonctionnalités", url: "#features" },
          { text: "Comment ça marche", url: "#how-it-works" },
          { text: "Tarifs", url: "#pricing" },
        ],
      },
      {
        title: "Entreprise",
        links: [
          { text: "À propos", url: "/about-us" },
          { text: "Carrières", url: "/careers" },
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
      {
        title: "Connexion",
        links: [
          { text: "Twitter", url: "#" },
          { text: "LinkedIn", url: "#" },
          { text: "Instagram", url: "#" },
          { text: "YouTube", url: "#" },
        ],
      },
    ],
    copyright: "© 2025 chyll.ai",
    bottomLinks: [
      { text: "Conditions", url: "/terms" },
      { text: "Confidentialité", url: "/privacy" },
      { text: "Cookies", url: "/cookies" },
    ],
  };

  return <Footer2 {...demoData} />;
}

export { Footer2Demo };
