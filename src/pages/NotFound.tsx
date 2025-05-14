
import { useLocation } from "react-router-dom";
import { useEffect } from "react";
import { NotFoundPage } from "@/components/ui/404-page-not-found";
import SEOMetadata from "@/components/SEOMetadata";

const NotFound = () => {
  const location = useLocation();

  useEffect(() => {
    console.error(
      "404 Error: User attempted to access non-existent route:",
      location.pathname
    );
  }, [location.pathname]);

  // Define SEO metadata specific for the 404 page
  const structuredData = {
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    "itemListElement": [
      {
        "@type": "ListItem",
        "position": 1,
        "name": "Accueil",
        "item": "https://generativschool.com/"
      },
      {
        "@type": "ListItem",
        "position": 2,
        "name": "Page Non Trouvée",
        "item": `https://generativschool.com${location.pathname}`
      }
    ]
  };

  return (
    <>
      <SEOMetadata
        title="Page Non Trouvée"
        description="Désolé, la page que vous recherchez n'existe pas ou a été déplacée."
        canonicalUrl={location.pathname}
        structuredData={structuredData}
      />
      <NotFoundPage />
    </>
  );
};

export default NotFound;
