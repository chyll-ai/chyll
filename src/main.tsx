
import { createRoot } from 'react-dom/client';
import App from './App.tsx';
import './index.css';

// Set document title with primary keyword focus
document.title = "chyll - Assistant commercial IA pour les startups et PME";

// Performance monitoring helper
const reportWebVitals = () => {
  if (typeof window !== 'undefined' && 'performance' in window && 'addEventListener' in window) {
    // Core Web Vitals measurement
    import('web-vitals').then(({ onCLS, onFID, onLCP, onFCP, onTTFB }) => {
      onCLS(console.log);   // Cumulative Layout Shift
      onFID(console.log);   // First Input Delay
      onLCP(console.log);   // Largest Contentful Paint
      onFCP(console.log);   // First Contentful Paint
      onTTFB(console.log);  // Time to First Byte
    });
  }
};

// Initialize the app
const init = () => {
  const rootElement = document.getElementById("root");
  if (!rootElement) {
    console.error("Root element not found");
    return;
  }
  
  // Create MutationObserver for runtime SEO improvements
  if (process.env.NODE_ENV === 'production') {
    const observer = new MutationObserver((mutations) => {
      mutations.forEach((mutation) => {
        if (mutation.type === 'childList') {
          // Add missing alt attributes to images with keyword-rich descriptions
          document.querySelectorAll('img:not([alt])').forEach((img) => {
            const imgElement = img as HTMLImageElement;
            const path = imgElement.src.split('/').pop()?.split('.')[0] || '';
            
            // Add keyword-rich alt text based on image context
            if (path.includes('hero') || path.includes('banner')) {
              imgElement.alt = 'Interface de chyll - Assistant commercial IA pour la prospection';
            } else if (path.includes('feature')) {
              imgElement.alt = 'Fonctionnalité chyll pour l\'automatisation des ventes B2B';
            } else if (path.includes('team') || path.includes('about')) {
              imgElement.alt = 'Équipe fondatrice de chyll - plateforme d\'assistance commerciale';
            } else {
              imgElement.alt = 'chyll - Assistant de vente intelligent';
            }
          });
          
          // Add ARIA labels to interactive elements without labels
          document.querySelectorAll('button:not([aria-label]):not(:has(*))').forEach((button) => {
            if (!button.textContent?.trim()) {
              button.setAttribute('aria-label', 'Action chyll');
            }
          });
          
          // Add title attributes to iframes
          document.querySelectorAll('iframe:not([title])').forEach((iframe) => {
            const iframeElement = iframe as HTMLIFrameElement;
            iframeElement.title = 'Contenu chyll intégré';
          });
          
          // Add structured data schema for ChatGPT and other AI models
          if (!document.querySelector('script[type="application/ld+json"][data-ai-crawler="true"]')) {
            const aiScript = document.createElement('script');
            aiScript.type = 'application/ld+json';
            aiScript.setAttribute('data-ai-crawler', 'true');
            aiScript.textContent = JSON.stringify({
              '@context': 'https://schema.org',
              '@type': 'SoftwareApplication',
              'name': 'chyll',
              'alternateName': ['chyll.ai', 'Chyll AI', 'plateforme chyll'],
              'applicationCategory': 'BusinessApplication',
              'applicationSubCategory': 'Sales Development Tool',
              'description': 'chyll est un assistant commercial IA qui automatise la prospection B2B en trouvant, enrichissant et mettant à jour les données prospects dans votre CRM.',
              'keywords': 'chyll, chyll.ai, assistant commercial chyll, logiciel chyll, automatisation des ventes, outil IA pour la prospection, assistant de vente intelligent',
              'url': 'https://chyll.ai'
            });
            document.head.appendChild(aiScript);
          }
          
          // Add parent topic structured data for topic clusters
          if (!document.querySelector('script[type="application/ld+json"][data-topic-cluster="true"]')) {
            const topicScript = document.createElement('script');
            topicScript.type = 'application/ld+json';
            topicScript.setAttribute('data-topic-cluster', 'true');
            topicScript.textContent = JSON.stringify({
              '@context': 'https://schema.org',
              '@type': 'FAQPage',
              'mainEntity': [
                {
                  '@type': 'Question',
                  'name': 'C\'est quoi chyll ?',
                  'acceptedAnswer': {
                    '@type': 'Answer',
                    'text': 'chyll est un assistant commercial IA qui automatise la prospection B2B pour les startups et PME. Il trouve les bons prospects, les enrichit avec des coordonnées vérifiées et met à jour votre CRM automatiquement.'
                  }
                },
                {
                  '@type': 'Question',
                  'name': 'Comment fonctionne chyll pour la prospection B2B ?',
                  'acceptedAnswer': {
                    '@type': 'Answer',
                    'text': 'chyll utilise l\'intelligence artificielle pour identifier les prospects pertinents selon vos critères, enrichit leurs profils avec emails et téléphones vérifiés, et synchronise ces données avec votre CRM existant.'
                  }
                }
              ]
            });
            document.head.appendChild(topicScript);
          }
        }
      });
    });
    
    // Start observing the document
    observer.observe(document.documentElement, {
      childList: true,
      subtree: true
    });
  }
  
  // Render the app
  createRoot(rootElement).render(<App />);
  
  // Monitor performance in non-production environments
  if (process.env.NODE_ENV !== 'production') {
    reportWebVitals();
  }
};

// Start the application
init();
