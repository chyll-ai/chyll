
import { useLocation } from "react-router-dom";
import { useEffect } from "react";
import { NotFoundPage } from "@/components/ui/404-page-not-found";
import SEOMetadata from "@/components/SEOMetadata";
import { useLanguage } from '@/context/LanguageContext';
import { Footer2 } from '@/components/ui/footer2';

const NotFound = () => {
  const location = useLocation();
  const { t } = useLanguage();
  
  // Set the proper HTTP status code to 404
  useEffect(() => {
    // Log the 404 error for tracking
    console.error(
      "404 Error: User attempted to access non-existent route:",
      location.pathname
    );
    
    // Set HTTP status code to 404 - this helps search engines identify true 404s
    document.title = `404 - ${t.notFound.title} | chyll.ai`;
    
    // Add meta tag for status code (helps some crawlers)
    const metaStatus = document.createElement('meta');
    metaStatus.setAttribute('name', 'prerender-status-code');
    metaStatus.setAttribute('content', '404');
    document.head.appendChild(metaStatus);

    return () => {
      // Clean up meta tag when component unmounts
      const existingMeta = document.querySelector('meta[name="prerender-status-code"]');
      if (existingMeta) {
        existingMeta.remove();
      }
    };
  }, [location.pathname, t.notFound.title]);

  // Define SEO metadata specific for the 404 page
  const structuredData = {
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    "itemListElement": [
      {
        "@type": "ListItem",
        "position": 1,
        "name": "Home",
        "item": "https://chyll.ai/"
      },
      {
        "@type": "ListItem",
        "position": 2,
        "name": "Page Not Found",
        "item": `https://chyll.ai${location.pathname}`
      }
    ]
  };

  return (
    <>
      <SEOMetadata
        title={`404 - ${t.notFound.title}`}
        description={t.notFound.message}
        canonicalUrl="/"
        structuredData={structuredData}
        pageUrl="https://chyll.ai/"
      />
      <NotFoundPage />
      <Footer2 />
    </>
  );
};

export default NotFound;
