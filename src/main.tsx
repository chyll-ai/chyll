
import { createRoot } from 'react-dom/client';
import App from './App.tsx';
import './index.css';

// Set document title
document.title = "chyll.ai - La prospection B2B, automatisée";

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
          // Add missing alt attributes to images
          document.querySelectorAll('img:not([alt])').forEach((img) => {
            const imgElement = img as HTMLImageElement;
            imgElement.alt = imgElement.src.split('/').pop()?.split('.')[0] || 'Image chyll.ai';
          });
          
          // Add ARIA labels to interactive elements without labels
          document.querySelectorAll('button:not([aria-label]):not(:has(*))').forEach((button) => {
            if (!button.textContent?.trim()) {
              button.setAttribute('aria-label', 'Bouton');
            }
          });
          
          // Add title attributes to iframes
          document.querySelectorAll('iframe:not([title])').forEach((iframe) => {
            const iframeElement = iframe as HTMLIFrameElement;
            iframeElement.title = 'Contenu intégré';
          });
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
