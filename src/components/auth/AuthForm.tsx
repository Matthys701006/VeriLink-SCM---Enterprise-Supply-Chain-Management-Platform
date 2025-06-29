import { useState, useEffect } from 'react'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { useNavigate } from 'react-router-dom'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { signInSchema, signUpSchema, type SignInFormData, type SignUpFormData } from '@/schemas/validationSchemas'
import { useAuth } from '@/hooks/useAuth'
import { Package, Eye, EyeOff } from 'lucide-react'
import { checkConnection } from '@/integrations/supabase/client'
import { toast } from '@/hooks/use-toast'

export function AuthForm() {
  const [showPassword, setShowPassword] = useState(false)
  const [showConfirmPassword, setShowConfirmPassword] = useState(false)
  const [activeTab, setActiveTab] = useState('signin')
  const [submitError, setSubmitError] = useState<string | null>(null)
  const { signIn, signUp, resetPassword, loading: authLoading } = useAuth()
  const [connectionStatus, setConnectionStatus] = useState<{
    checked: boolean;
    connected: boolean;
    error: string | null;
  }>({
    checked: false,
    connected: false,
    error: null
  })
  const [isSubmitting, setIsSubmitting] = useState(false)
  const navigate = useNavigate()

  // Clear errors when switching tabs
  useEffect(() => {
    setSubmitError(null)
  }, [activeTab])

  const signInForm = useForm<SignInFormData>({
    resolver: zodResolver(signInSchema),
    defaultValues: {
      email: '',
      password: '',
    },
  })

  const signUpForm = useForm<SignUpFormData>({
    resolver: zodResolver(signUpSchema),
    defaultValues: {
      email: '',
      password: '',
      confirmPassword: '',
      fullName: '',
    },
  })

  // Check connection on mount
  useEffect(() => {
    const testConnection = async () => {
      const result = await checkConnection()
      setConnectionStatus({
        checked: true,
        connected: result.connected,
        error: result.error || null
      })
    }
    
    testConnection()
  }, [])
  
  const onSignIn = async (data: SignInFormData) => {
    try {
      setIsSubmitting(true)
      setSubmitError(null)
      const { error } = await signIn(data.email, data.password)
      if (error) {
        console.error('Sign in error:', error)
        setSubmitError(error.message)
        return
      }
      
      toast({
        title: "Success",
        description: "Signing you in...",
      })

      // Brief delay to allow the toast to be seen before navigation
      await new Promise(resolve => setTimeout(resolve, 500))
      navigate('/')
    } catch (err) {
      console.error('Unexpected error during sign in:', err)
      setSubmitError('An unexpected error occurred. Please try again.')
    } finally {
      setIsSubmitting(false)
    }
  }

  const onSignUp = async (data: SignUpFormData) => {
    try {
      setIsSubmitting(true)
      setSubmitError(null)
      const { error } = await signUp(data.email, data.password, data.fullName)
      if (error) {
        console.error('Sign up error:', error)
        setSubmitError(error.message)
        return
      }
      
      toast({
        title: "Account created",
        description: "Your account has been created successfully.",
      })
      setActiveTab('signin')
    } catch (err) {
      console.error('Unexpected error during sign up:', err)
      setSubmitError('An unexpected error occurred. Please try again.')
    } finally {
      setIsSubmitting(false)
    }
  }

  const handleForgotPassword = async () => {
    const email = signInForm.getValues('email')
    if (!email) {
      signInForm.setError('email', { message: 'Please enter your email first' })
      return
    }
    await resetPassword(email)
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50 px-4">
      <Card className="w-full max-w-md">
        <CardHeader className="space-y-1 text-center">
          <div className="flex items-center justify-center gap-2 mb-4">
            <Package className="h-8 w-8 text-primary" />
            <span className="text-2xl font-bold">VeriLink</span>
          </div>
          <CardTitle className="text-2xl">Welcome</CardTitle>
          <CardDescription>
            Sign in to your account or create a new one
          </CardDescription>
        </CardHeader>
        <CardContent>
          <Tabs value={activeTab} onValueChange={setActiveTab}>
            <TabsList className="grid w-full grid-cols-2">
              <TabsTrigger value="signin">Sign In</TabsTrigger>
              <TabsTrigger value="signup">Sign Up</TabsTrigger>
            </TabsList>
            
            <TabsContent value="signin" className="space-y-4">
              {/* Connection warning */}
              {connectionStatus.checked && !connectionStatus.connected && (
                <div className="bg-amber-50 border border-amber-200 text-amber-800 p-3 text-sm rounded-md mb-4">
                  <p className="font-medium">Connection Issue</p>
                  <p className="text-xs mt-1">
                    Not connected to Supabase. Sign-in may not work properly.
                    {connectionStatus.error && (
                      <span className="block mt-1 text-xs break-words">{connectionStatus.error}</span>
                    )}
                  </p>
                </div>
              )}

              <Form {...signInForm}>
                <form onSubmit={signInForm.handleSubmit(onSignIn)} className="space-y-4">
                  <FormField
                    control={signInForm.control}
                    name="email"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Email</FormLabel>
                        <FormControl>
                          <Input
                            type="email"
                            placeholder="Enter your email"
                            {...field}
                          />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  
                  <FormField
                    control={signInForm.control}
                    name="password"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Password</FormLabel>
                        <FormControl>
                          <div className="relative">
                            <Input
                              type={showPassword ? 'text' : 'password'}
                              placeholder="Enter your password"
                              {...field}
                            />
                            <Button
                              type="button"
                              variant="ghost"
                              size="icon"
                              className="absolute right-0 top-0 h-full px-3 py-2 hover:bg-transparent"
                              onClick={() => setShowPassword(!showPassword)}
                            >
                              {showPassword ? (
                                <EyeOff className="h-4 w-4" />
                              ) : (
                                <Eye className="h-4 w-4" />
                              )}
                            </Button>
                          </div>
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  
                  {submitError && (
                    <div className="bg-red-50 text-red-800 p-3 text-sm rounded-md mt-3">
                      {submitError}
                    </div>
                  )}
                  
                  <Button
                    type="submit"
                    className="w-full"
                    disabled={signInForm.formState.isSubmitting || authLoading || isSubmitting}
                  >
                    {signInForm.formState.isSubmitting || authLoading || isSubmitting ? 'Signing in...' : 'Sign In'}
                  </Button>
                  
                  <Button
                    type="button"
                    variant="link"
                    className="w-full"
                    onClick={handleForgotPassword}
                  >
                    Forgot your password?
                  </Button>
                </form>
              </Form>
            </TabsContent>
            
            <TabsContent value="signup" className="space-y-4">
              {/* Connection warning for signup too */}
              {connectionStatus.checked && !connectionStatus.connected && (
                <div className="bg-amber-50 border border-amber-200 text-amber-800 p-3 text-sm rounded-md mb-4">
                  <p className="font-medium">Connection Issue</p>
                  <p className="text-xs mt-1">
                    Not connected to Supabase. Sign-up may not work properly.
                    {connectionStatus.error && (
                      <span className="block mt-1 text-xs break-words">{connectionStatus.error}</span>
                    )}
                  </p>
                </div>
              )}

              <Form {...signUpForm}>
                <form onSubmit={signUpForm.handleSubmit(onSignUp)} className="space-y-4">
                  <FormField
                    control={signUpForm.control}
                    name="fullName"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Full Name</FormLabel>
                        <FormControl>
                          <Input
                            placeholder="Enter your full name"
                            autoComplete="name"
                            disabled={isSubmitting}
                            {...field}
                          />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  
                  <FormField
                    control={signUpForm.control}
                    name="email"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Email</FormLabel>
                        <FormControl>
                          <Input
                            type="email"
                            placeholder="Enter your email"
                            autoComplete="email"
                            disabled={isSubmitting}
                            {...field}
                          />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  
                  <FormField
                    control={signUpForm.control}
                    name="password"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Password</FormLabel>
                        <FormControl>
                          <div className="relative">
                            <Input
                              type={showPassword ? 'text' : 'password'}
                              autoComplete="new-password"
                              disabled={isSubmitting}
                              placeholder="Create a password"
                              {...field}
                            />
                            <Button
                              type="button"
                              variant="ghost"
                              size="icon"
                              className="absolute right-0 top-0 h-full px-3 py-2 hover:bg-transparent"
                              onClick={() => setShowPassword(!showPassword)}
                            >
                              {showPassword ? (
                                <EyeOff className="h-4 w-4" />
                              ) : (
                                <Eye className="h-4 w-4" />
                              )}
                            </Button>
                          </div>
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  
                  <FormField
                    control={signUpForm.control}
                    name="confirmPassword"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Confirm Password</FormLabel>
                        <FormControl>
                          <div className="relative">
                            <Input
                              type={showConfirmPassword ? 'text' : 'password'}
                              autoComplete="new-password"
                              disabled={isSubmitting}
                              placeholder="Confirm your password"
                              {...field}
                            />
                            <Button
                              type="button"
                              variant="ghost"
                              size="icon"
                              className="absolute right-0 top-0 h-full px-3 py-2 hover:bg-transparent"
                              onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                            >
                              {showConfirmPassword ? (
                                <EyeOff className="h-4 w-4" />
                              ) : (
                                <Eye className="h-4 w-4" />
                              )}
                            </Button>
                          </div>
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  
                  {submitError && (
                    <div className="bg-red-50 text-red-800 p-3 text-sm rounded-md mt-3">
                      {submitError}
                    </div>
                  )}
                  
                  <Button
                    type="submit"
                    className="w-full"
                    disabled={signUpForm.formState.isSubmitting || authLoading || isSubmitting}
                  >
                    {signUpForm.formState.isSubmitting || authLoading || isSubmitting ? 'Creating account...' : 'Create Account'}
                  </Button>
                </form>
              </Form>
            </TabsContent>
          </Tabs>
        </CardContent>
      </Card>
    </div>
  )
}