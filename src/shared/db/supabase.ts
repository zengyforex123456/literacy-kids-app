import { createClient } from '@supabase/supabase-js'

const SUPABASE_URL = 'https://fafuzylullustmlpwwxw.supabase.co'
const SUPABASE_ANON_KEY = 'sb_publishable_WjmUMZzUmHGYmnm-lKJ7iw_HB0Ew1MI'

export const supabase = createClient(SUPABASE_URL, SUPABASE_ANON_KEY)
