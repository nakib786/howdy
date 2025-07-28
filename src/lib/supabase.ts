import { createClient } from '@supabase/supabase-js'

const supabaseUrl = import.meta.env.VITE_SUPABASE_URL
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY

// Debug logging (only in development)
if (import.meta.env.DEV) {
  console.log('🔧 Supabase Configuration:')
  console.log('  - URL exists:', !!supabaseUrl)
  console.log('  - Key exists:', !!supabaseAnonKey)
  console.log('  - URL:', supabaseUrl)
}

if (!supabaseUrl || !supabaseAnonKey) {
  console.error('❌ Missing Supabase environment variables:')
  console.error('  - VITE_SUPABASE_URL:', supabaseUrl)
  console.error('  - VITE_SUPABASE_ANON_KEY:', supabaseAnonKey ? '[HIDDEN]' : 'MISSING')
  throw new Error('Missing Supabase environment variables. Please check your Netlify environment configuration.')
}

export const supabase = createClient(supabaseUrl, supabaseAnonKey)

// Database types
export interface MenuItem {
  id: string
  name: string
  description: string
  price: number
  image_url: string
  category_id: string
  dietary_tags: string[]
  is_popular: boolean
  created_at: string
  updated_at: string
}

export interface Category {
  id: string
  name: string
  icon: string
  gradient: string
  sort_order: number
  created_at: string
}

export interface AdminUser {
  id: string
  email: string
  role: 'admin' | 'manager'
  created_at: string
} 