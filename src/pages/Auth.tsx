
import { useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import { useAuth } from '@/hooks/useAuth'
import { checkConnection } from '@/integrations/supabase/client'
import { AuthForm } from '@/components/auth/AuthForm'
import { Loader2, Database } from 'lucide-react'

export default function Auth() {
  const { user, loading, isAuthenticated } = useAuth()
  const navigate = useNavigate()

  useEffect(() => {
    console.log('Auth page - Auth state:', { user, loading, isAuthenticated })
    
    // Test connection when the auth page loads
    const testConnection = async () => {
      const result = await checkConnection()
      console.log('Auth page - Connection test:', result)
    }
    
    testConnection()
    
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
          <h1 className="text-xl font-bold">VeriLink SCM</h1>
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
        <Database className="w-3 h-3 mr-1" />
        <span>{import.meta.env.VITE_SUPABASE_URL ? 'Connected' : 'Connection Issue'}</span>
      </div>
    </>
  )
}
