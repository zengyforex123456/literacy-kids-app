import { supabase } from './supabase'

interface SyncOps { learned: string[]; profileId: string }

export async function syncProgress(userId: string, ops: SyncOps): Promise<boolean> {
  const { error } = await supabase
    .from('progress_snapshots')
    .upsert({
      user_id: userId,
      profile_id: ops.profileId,
      learned_chars: ops.learned,
      last_sync_at: new Date().toISOString(),
    })

  return !error
}

export async function fetchProgress(userId: string, profileId: string): Promise<string[]> {
  const { data } = await supabase
    .from('progress_snapshots')
    .select('learned_chars')
    .eq('user_id', userId)
    .eq('profile_id', profileId)
    .single()

  return data?.learned_chars || []
}

export async function verifyPurchase(userId: string, productId: string, transactionId: string): Promise<{ valid: boolean; token?: string }> {
  const { data, error } = await supabase.functions.invoke('verify-purchase', {
    body: { user_id: userId, product_id: productId, transaction_id: transactionId, payment_sign: 'verified' },
  })
  if (error) return { valid: false }
  return data as { valid: boolean; token?: string }
}
