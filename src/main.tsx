
import { createRoot } from 'react-dom/client';
import App from './App.tsx';
import './index.css';

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
  createRoot(document.getElementById("root")!).render(<App />);
  
  // Monitor performance in non-production environments
  if (process.env.NODE_ENV !== 'production') {
    reportWebVitals();
  }
};

// Start the application
init();
