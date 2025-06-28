import { createRoot } from 'react-dom/client'
import App from './App.tsx'
import './index.css'

// Log environment variables for debugging (sanitized)
console.log('Environment:', {
  mode: import.meta.env.MODE,
  prod: import.meta.env.PROD,
  dev: import.meta.env.DEV,
  supabaseUrlSet: !!import.meta.env.VITE_SUPABASE_URL,
  supabaseKeySet: !!import.meta.env.VITE_SUPABASE_ANON_KEY
});

// Mount the app
createRoot(document.getElementById("root")!).render(<App />);