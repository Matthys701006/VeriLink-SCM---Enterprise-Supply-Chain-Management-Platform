import { serve } from 'https://deno.land/std@0.168.0/http/server.ts'
import { createClient } from 'https://esm.sh/@supabase/supabase-js@2.38.0'
import { TOTP } from 'https://esm.sh/otpauth@9.1.5'

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
}

serve(async (req) => {
  // Handle CORS preflight requests
  if (req.method === 'OPTIONS') {
    return new Response('ok', { headers: corsHeaders })
  }

  try {
    const { userId, secret, token } = await req.json()

    if (!userId || !secret || !token) {
      return new Response(
        JSON.stringify({ error: 'User ID, secret, and token are required' }),
        {
          status: 400,
          headers: { ...corsHeaders, 'Content-Type': 'application/json' },
        }
      )
    }

    // Create a TOTP object with the secret
    const totp = new TOTP({
      issuer: 'VeriLink SCM',
      label: 'Supply Chain Account',
      algorithm: 'SHA1',
      digits: 6,
      period: 30,
      secret: secret,
    })

    // Verify the token
    const delta = totp.validate({ token, window: 1 }) // Allow 1 period before/after (±30s window)
    const isValid = delta !== null

    // Log verification attempt for security audit purposes
    console.log(`TOTP verification for user ${userId}: ${isValid ? 'success' : 'failure'}`)

    return new Response(
      JSON.stringify({ valid: isValid }),
      {
        status: 200,
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      }
    )
  } catch (error) {
    return new Response(
      JSON.stringify({ error: error.message }),
      {
        status: 500,
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      }
    )
  }
})