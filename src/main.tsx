
import React from 'react'
import ReactDOM from 'react-dom/client'
import App from './App.tsx'
import './index.css'

console.log('Main: Starting React app...');
console.log('Environment check:', {
  NODE_ENV: import.meta.env.NODE_ENV,
  VITE_SUPABASE_URL: import.meta.env.VITE_SUPABASE_URL ? 'present' : 'missing',
  VITE_SUPABASE_ANON_KEY: import.meta.env.VITE_SUPABASE_ANON_KEY ? 'present' : 'missing',
  origin: window.location.origin
});

try {
  ReactDOM.createRoot(document.getElementById('root')!).render(
    <React.StrictMode>
      <App />
    </React.StrictMode>,
  )
  console.log('Main: React app rendered successfully');
} catch (error) {
  console.error('Main: Error rendering React app:', error);
}
