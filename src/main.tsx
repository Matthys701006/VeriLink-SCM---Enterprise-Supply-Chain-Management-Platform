import { createRoot } from 'react-dom/client'
import App from './App.tsx'
import './index.css'

// Log environment variables for debugging (sanitized)
console.log('Environment:', {
  mode: import.meta.env.MODE,
  prod: import.meta.env.PROD,
  dev: import.meta.env.DEV,
  supabaseUrl: import.meta.env.VITE_SUPABASE_URL ? 
    `${import.meta.env.VITE_SUPABASE_URL.substring(0, 20)}...` : 
    'Not set',
  supabaseKeySet: import.meta.env.VITE_SUPABASE_ANON_KEY ? 'Set' : 'Not set'
});

// Mount the app
createRoot(document.getElementById("root")!).render(<App />);