
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
        "name": "Home",
        "item": "https://generativschool.com/"
      },
      {
        "@type": "ListItem",
        "position": 2,
        "name": "Page Not Found",
        "item": `https://generativschool.com${location.pathname}`
      }
    ]
  };

  return (
    <>
      <SEOMetadata
        title="Page Not Found (404)"
        description="We're sorry, but the page you are looking for does not exist or has been moved."
        canonicalUrl={location.pathname}
        structuredData={structuredData}
      />
      <NotFoundPage />
    </>
  );
};

export default NotFound;
