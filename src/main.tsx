
import { createRoot } from 'react-dom/client';
import App from './App.tsx';
import './index.css';

// Performance monitoring helper
const reportWebVitals = () => {
  if (typeof window !== 'undefined' && 'performance' in window && 'addEventListener' in window) {
    // Core Web Vitals measurement
    import('web-vitals').then(({ getCLS, getFID, getLCP, getFCP, getTTFB }) => {
      getCLS(console.log);   // Cumulative Layout Shift
      getFID(console.log);   // First Input Delay
      getLCP(console.log);   // Largest Contentful Paint
      getFCP(console.log);   // First Contentful Paint
      getTTFB(console.log);  // Time to First Byte
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
