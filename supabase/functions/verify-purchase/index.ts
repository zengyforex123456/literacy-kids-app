// Supabase Edge Function: verify-purchase
// 部署: supabase functions deploy verify-purchase

import { createClient } from 'https://esm.sh/@supabase/supabase-js@2'
import { createHash } from 'node:crypto'

const SALT = Deno.env.get('PURCHASE_SALT') || 'literacy-kids-v1-salt'

interface VerifyRequest {
  user_id: string
  product_id: string
  transaction_id: string
  payment_sign: string   // platform-provided signature
}

Deno.serve(async (req: Request) => {
  if (req.method !== 'POST') {
    return new Response(JSON.stringify({ error: 'Method not allowed' }), { status: 405 })
  }

  try {
    const body: VerifyRequest = await req.json()
    const { user_id, product_id, transaction_id, payment_sign } = body

    if (!user_id || !product_id || !transaction_id) {
      return new Response(JSON.stringify({ valid: false, reason: 'missing_fields' }), { status: 400 })
    }

    // Generate token
    const tokenInput = `${user_id}:${product_id}:${SALT}`
    const token = createHash('sha256').update(tokenInput).digest('hex')

    // Verify with Supabase
    const supabase = createClient(
      Deno.env.get('SUPABASE_URL')!,
      Deno.env.get('SUPABASE_SERVICE_ROLE_KEY')!
    )

    // Check for existing purchase (幂等)
    const { data: existing } = await supabase
      .from('purchases')
      .select('id')
      .eq('transaction_id', transaction_id)
      .single()

    if (existing) {
      return new Response(JSON.stringify({ valid: true, token, cached: true }))
    }

    // Insert new purchase record
    const { error } = await supabase
      .from('purchases')
      .insert({
        user_id,
        product_id,
        transaction_id,
        token_hash: token,
        payment_method: payment_sign.startsWith('wx') ? 'wechat' : 'alipay',
      })

    if (error) {
      return new Response(JSON.stringify({ valid: false, reason: 'db_error' }), { status: 500 })
    }

    return new Response(JSON.stringify({ valid: true, token }))

  } catch (e) {
    return new Response(JSON.stringify({ valid: false, reason: 'server_error' }), { status: 500 })
  }
})
