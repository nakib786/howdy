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
  category_id?: string // Temporary for current database structure
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

export interface MenuItemCategory {
  id: string
  menu_item_id: string
  category_id: string
  created_at: string
}

export interface AdminUser {
  id: string
  email: string
  role: 'admin' | 'manager'
  created_at: string
}

// Promo types
export interface Promo {
  id: string
  name: string
  description: string
  discount_type: 'percentage' | 'fixed_amount'
  discount_value: number
  start_date: string
  end_date: string
  is_active: boolean
  applies_to: 'all_items' | 'specific_categories' | 'specific_items'
  category_ids?: string[]
  item_ids?: string[]
  promo_code?: string
  max_uses?: number
  current_uses: number
  created_at: string
  updated_at: string
}

export interface PromoItem {
  id: string
  promo_id: string
  menu_item_id: string
  original_price: number
  discounted_price: number
  created_at: string
} 