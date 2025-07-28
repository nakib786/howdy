// Test script to debug promo creation
// Run this in the browser console to test database connection

import { createClient } from 'https://esm.sh/@supabase/supabase-js'

const supabaseUrl = 'https://kcyloqhhtyknzcvbmbba.supabase.co'
const supabaseKey = 'your_anon_key_here' // Replace with your actual anon key

const supabase = createClient(supabaseUrl, supabaseKey)

// Test 1: Check if we can read promos
async function testReadPromos() {
  console.log('Testing read access to promos...')
  const { data, error } = await supabase
    .from('promos')
    .select('*')
    .limit(1)
  
  if (error) {
    console.error('❌ Error reading promos:', error)
  } else {
    console.log('✅ Successfully read promos:', data)
  }
}

// Test 2: Check if we can insert a promo
async function testInsertPromo() {
  console.log('Testing insert access to promos...')
  const testPromo = {
    name: 'Test Promo',
    description: 'Test description',
    discount_type: 'percentage',
    discount_value: 10,
    start_date: new Date().toISOString(),
    end_date: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000).toISOString(),
    is_active: true,
    applies_to: 'all_items',
    category_ids: [],
    item_ids: [],
    current_uses: 0
  }
  
  const { data, error } = await supabase
    .from('promos')
    .insert([testPromo])
    .select()
  
  if (error) {
    console.error('❌ Error inserting promo:', error)
  } else {
    console.log('✅ Successfully inserted promo:', data)
  }
}

// Test 3: Check authentication status
async function testAuth() {
  console.log('Testing authentication...')
  const { data: { user }, error } = await supabase.auth.getUser()
  
  if (error) {
    console.error('❌ Auth error:', error)
  } else {
    console.log('✅ Auth status:', user ? 'Authenticated' : 'Not authenticated')
    console.log('User:', user)
  }
}

// Run all tests
async function runTests() {
  console.log('🧪 Starting promo debug tests...')
  await testAuth()
  await testReadPromos()
  await testInsertPromo()
  console.log('🏁 Tests completed')
}

// Export for use in browser console
window.runPromoTests = runTests 