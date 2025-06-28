import { createContext, useContext, useEffect, useState } from 'react'
import { User, Session, AuthError } from '@supabase/supabase-js'
import { supabase } from '@/integrations/supabase/client'
import { useToast } from '@/hooks/use-toast'
import { useAppStore } from '@/stores/appStore'

interface AuthContextType {
  user: User | null
  session: Session | null
  loading: boolean
  signIn: (email: string, password: string) => Promise<{ error: AuthError | null }>
  signUp: (email: string, password: string, fullName: string) => Promise<{ error: AuthError | null }>
  signOut: () => Promise<void>
  resetPassword: (email: string) => Promise<{ error: AuthError | null }>
  isAuthenticated: boolean
}

const AuthContext = createContext<AuthContextType | undefined>(undefined)

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<User | null>(null)
  const [session, setSession] = useState<Session | null>(null)
  const [loading, setLoading] = useState(true)
  const { toast } = useToast()
  const { addNotification } = useAppStore()

  // Check connection on mount
  useEffect(() => {
    const checkConnection = async () => {
      try {
        // We're using a public endpoint that doesn't require auth
        const { data, error } = await supabase
          .from('organizations')
          .select('id')
          .limit(1)

        if (error) {
          console.error('Failed to connect to Supabase:', error)
          toast({
            title: "Connection Error",
            description: "Failed to connect to the database. Some features may be limited.",
            variant: "destructive",
          })
        } else {
          console.log('Successfully connected to Supabase:', data)
        }
      } catch (err) {
        console.error('Unexpected error testing connection:', err)
      }
    }

    checkConnection()
  }, [toast])

  useEffect(() => {
    // Set up auth state listener
    const { data: { subscription } } = supabase.auth.onAuthStateChange(
      async (event, session) => {
        console.log('Auth state changed:', event)
        setSession(session)
        setUser(session?.user ?? null)
        setLoading(false)
        
        if (event === 'SIGNED_IN' || event === 'TOKEN_REFRESHED') {
          // User signed in or token refreshed
          toast({
            title: "Welcome back!",
            description: "You have been signed in successfully.",
          })

          // Create or update user profile if needed
          if (session?.user) {
            try {
              const { error: profileError } = await supabase
                .from('profiles')
                .upsert({
                  id: session.user.id,
                  email: session.user.email,
                  full_name: session.user.user_metadata?.full_name || '',
                  organization_id: "550e8400-e29b-41d4-a716-446655440000" // Default organization
                }, {
                  onConflict: 'id'
                })

              if (profileError) {
                console.error('Error updating profile:', profileError)
              }
            } catch (err) {
              console.error('Error in profile update:', err)
            }
          }
        } else if (event === 'SIGNED_OUT') {
          // User signed out
          toast({
            title: "Signed out",
            description: "You have been signed out successfully.",
          })
        }
      }
    )

    // Check for existing session
    supabase.auth.getSession().then(({ data: { session } }) => {
      setSession(session)
      setUser(session?.user ?? null)
      setLoading(false)
    })

    return () => subscription.unsubscribe()
  }, [toast, addNotification])

  const signIn = async (email: string, password: string) => {
    try {
      const { data, error } = await supabase.auth.signInWithPassword({
        email,
        password,
      })
      
      if (error) {
        console.error('Sign in error:', error)
        toast({
          title: "Sign in failed",
          description: error.message,
          variant: "destructive",
        })
      } else {
        console.log('Sign in successful:', data)
      }
      
      return { error }
    } catch (err) {
      console.error('Unexpected error during sign in:', err)
      toast({
        title: "Sign in failed",
        description: "An unexpected error occurred",
        variant: "destructive",
      })
      return { error: err as AuthError }
    }
  }

  const signUp = async (email: string, password: string, fullName: string) => {
    const redirectUrl = `${window.location.origin}/`
    
    try {
      const { data, error } = await supabase.auth.signUp({
        email,
        password,
        options: {
          emailRedirectTo: redirectUrl,
          data: {
            full_name: fullName
          }
        }
      })
      
      if (error) {
        console.error('Sign up error:', error)
        toast({
          title: "Sign up failed",
          description: error.message,
          variant: "destructive",
        })
      } else {
        console.log('Sign up successful:', data)
        toast({
          title: "Sign up successful",
          description: "Your account has been created. You may need to verify your email.",
        })
      }
      
      return { error }
    } catch (err) {
      console.error('Unexpected error during sign up:', err)
      toast({
        title: "Sign up failed",
        description: "An unexpected error occurred",
        variant: "destructive",
      })
      return { error: err as AuthError }
    }
  }

  const signOut = async () => {
    try {
      await supabase.auth.signOut()
    } catch (err) {
      console.error('Sign out error:', err)
      toast({
        title: "Sign out failed",
        description: "An error occurred while signing out",
        variant: "destructive",
      })
    }
  }

  const resetPassword = async (email: string) => {
    try {
      const { error } = await supabase.auth.resetPasswordForEmail(email, {
        redirectTo: `${window.location.origin}/reset-password`,
      })
      
      if (error) {
        console.error('Password reset error:', error)
        toast({
          title: "Password reset failed",
          description: error.message,
          variant: "destructive",
        })
      } else {
        toast({
          title: "Check your email",
          description: "We've sent you a password reset link.",
        })
      }
      
      return { error }
    } catch (err) {
      console.error('Unexpected error during password reset:', err)
      toast({
        title: "Password reset failed",
        description: "An unexpected error occurred",
        variant: "destructive",
      })
      return { error: err as AuthError }
    }
  }

  const value = {
    user,
    session,
    loading,
    signIn,
    signUp,
    signOut,
    resetPassword,
    isAuthenticated: !!user
  }

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  )
}

export const useAuth = () => {
  const context = useContext(AuthContext)
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider')
  }
  return context
}