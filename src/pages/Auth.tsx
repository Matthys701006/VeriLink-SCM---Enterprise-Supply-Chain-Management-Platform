import { useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import { useAuth } from '@/hooks/useAuth'
import { supabase, checkConnection } from '@/integrations/supabase/client'
import { AuthForm } from '@/components/auth/AuthForm'
import { Loader2, Database, Package } from 'lucide-react'
import { ConnectionDebugger } from '@/components/ConnectionDebugger'

export default function Auth() {
  const { user, loading, isAuthenticated } = useAuth()
  const navigate = useNavigate()

  useEffect(() => {
    console.log('Auth page - Auth state:', { user, loading, isAuthenticated })
    
    // Test connection when the auth page loads
    const testConnection = async () => {
      const result = await checkConnection()
      console.log('Auth page - Connection test:', result)
      return result
    }
    
    testConnection().then(result => {
      if (!result.connected) {
        // Try to ping the Supabase URL directly to see if it's accessible
        console.log('Attempting to ping Supabase URL directly...');
        fetch(import.meta.env.VITE_SUPABASE_URL || 'https://hdgdudabqytvtipadefg.supabase.co', { 
          method: 'HEAD',
          mode: 'no-cors' // This allows checking if the domain is reachable
        }).then(() => console.log('Supabase URL is reachable')).catch(err => console.error('Supabase URL is not reachable:', err));
      }
    });
    
    if (!loading && isAuthenticated) {
      console.log('Auth page - Redirecting to dashboard')
      navigate('/')
    }
  }, [user, loading, isAuthenticated, navigate])

  if (loading) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center">
        <div className="flex flex-col items-center mb-4">
          <Package className="h-10 w-10 text-primary mb-2" />
          <h1 className="text-xl font-bold">VeriLink SCM - Loading</h1>
        </div>
        <Loader2 className="h-8 w-8 animate-spin text-primary" />
        <p className="mt-4 text-muted-foreground">Loading authentication...</p>
      </div>
    )
  }

  if (isAuthenticated) {
    console.log('Auth page - User is authenticated, should redirect')
    return null
  }

  return (
    <>
      <AuthForm />
      <div className="fixed bottom-4 left-4 text-xs text-muted-foreground flex items-center">
        <Database className={`w-3 h-3 mr-1 ${import.meta.env.VITE_SUPABASE_URL ? 'text-green-500' : 'text-red-500'}`} />
        <span>{import.meta.env.VITE_SUPABASE_URL ? 'URL Set' : 'URL Missing'}</span>
      </div>
      <ConnectionDebugger />
    </>
  )
}