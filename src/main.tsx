import { createRoot } from 'react-dom/client'
import App from './App.tsx'
import './index.css'

// Check if we have stored credentials from a manual connection
const storedUrl = localStorage.getItem('supabase-url');
const storedKey = localStorage.getItem('supabase-key');

if (storedUrl && storedKey) {
  // Apply stored credentials to the page if they exist
  console.log('Found stored Supabase credentials, applying them');
  
  // Inject the values into environment variables
  if (import.meta && import.meta.env) {
    // @ts-ignore - Runtime modification of env vars
    import.meta.env.VITE_SUPABASE_URL = storedUrl;
    // @ts-ignore
    import.meta.env.VITE_SUPABASE_ANON_KEY = storedKey;
  }
}

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