import { createClient } from '@supabase/supabase-js'

const SUPABASE_URL = 'https://nosnibbbggmlzavfylcd.supabase.co'
const SUPABASE_ANON_KEY = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Im5vc25pYmJiZ2dtbHphdmZ5bGNkIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NzAxNjA2MDUsImV4cCI6MjA4NTczNjYwNX0.yhR2CYm7DKGl1x4qEUcgUe8NxyUrVFFJZ3yneGS-exg'

export const supabase = createClient(SUPABASE_URL, SUPABASE_ANON_KEY, {
  auth: {
    storage: localStorage,
    persistSession: true,
    autoRefreshToken: true,
  }
})
