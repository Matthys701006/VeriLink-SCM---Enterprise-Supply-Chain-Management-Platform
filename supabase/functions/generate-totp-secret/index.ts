import { serve } from 'https://deno.land/std@0.168.0/http/server.ts'
import { createClient } from 'https://esm.sh/@supabase/supabase-js@2.38.0'
import { toDataURL } from 'https://esm.sh/qrcode@1.5.3'
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
    const { userId } = await req.json()

    if (!userId) {
      return new Response(
        JSON.stringify({ error: 'User ID is required' }),
        {
          status: 400,
          headers: { ...corsHeaders, 'Content-Type': 'application/json' },
        }
      )
    }

    // Create a TOTP object
    const secret = generateRandomBase32()
    const totp = new TOTP({
      issuer: 'VeriLink SCM',
      label: 'Supply Chain Account',
      algorithm: 'SHA1',
      digits: 6,
      period: 30,
      secret: secret,
    })

    // Get the provisioning URI for generating a QR code
    const provisioningUri = totp.toString()

    // Generate QR code as a data URL
    const qrCodeUrl = await toDataURL(provisioningUri)

    return new Response(
      JSON.stringify({ 
        secret, 
        qrCodeUrl,
        uri: provisioningUri
      }),
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

// Generate a random base32 secret
function generateRandomBase32(length = 20) {
  const chars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ234567'
  let result = ''
  const randomValues = new Uint8Array(length)
  crypto.getRandomValues(randomValues)
  
  for (let i = 0; i < length; i++) {
    result += chars[randomValues[i] % chars.length]
  }
  
  return result
}