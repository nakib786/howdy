# Supabase Sync Guide

## 🔧 Current Issue
The Supabase API key appears to be invalid or expired. This guide will help you sync your database structure and fix the connection issues.

## 📋 Steps to Fix

### 1. Get Your New API Key
1. Go to your Supabase project: https://kcyloqhhtyknzcvbmbba.supabase.co
2. Navigate to Settings → API
3. Copy your new `anon` public key
4. Update your `.env` file:

```env
VITE_SUPABASE_URL=https://kcyloqhhtyknzcvbmbba.supabase.co
VITE_SUPABASE_ANON_KEY=your_new_anon_key_here
```

### 2. Set Up Database Schema
Run the SQL commands in your Supabase SQL Editor:

```sql
-- Create categories table
CREATE TABLE IF NOT EXISTS categories (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  name VARCHAR(255) NOT NULL,
  icon VARCHAR(50) NOT NULL,
  gradient VARCHAR(100) NOT NULL,
  sort_order INTEGER DEFAULT 0,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create menu_items table
CREATE TABLE IF NOT EXISTS menu_items (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  name VARCHAR(255) NOT NULL,
  description TEXT,
  price DECIMAL(10,2) NOT NULL,
  image_url TEXT,
  category_id UUID REFERENCES categories(id) ON DELETE CASCADE,
  dietary_tags TEXT[] DEFAULT '{}',
  is_popular BOOLEAN DEFAULT FALSE,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create admin_users table
CREATE TABLE IF NOT EXISTS admin_users (
  id UUID REFERENCES auth.users(id) ON DELETE CASCADE PRIMARY KEY,
  email VARCHAR(255) NOT NULL,
  role VARCHAR(50) DEFAULT 'manager' CHECK (role IN ('admin', 'manager')),
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create indexes for better performance
CREATE INDEX IF NOT EXISTS idx_menu_items_category_id ON menu_items(category_id);
CREATE INDEX IF NOT EXISTS idx_menu_items_created_at ON menu_items(created_at);
CREATE INDEX IF NOT EXISTS idx_categories_sort_order ON categories(sort_order);

-- Enable Row Level Security
ALTER TABLE categories ENABLE ROW LEVEL SECURITY;
ALTER TABLE menu_items ENABLE ROW LEVEL SECURITY;
ALTER TABLE admin_users ENABLE ROW LEVEL SECURITY;

-- Create policies for categories
CREATE POLICY "Categories are viewable by everyone" ON categories
  FOR SELECT USING (true);

CREATE POLICY "Categories are insertable by admin users" ON categories
  FOR INSERT WITH CHECK (
    EXISTS (
      SELECT 1 FROM admin_users 
      WHERE admin_users.id = auth.uid() 
      AND (admin_users.role = 'admin' OR admin_users.role = 'manager')
    )
  );

CREATE POLICY "Categories are updatable by admin users" ON categories
  FOR UPDATE USING (
    EXISTS (
      SELECT 1 FROM admin_users 
      WHERE admin_users.id = auth.uid() 
      AND (admin_users.role = 'admin' OR admin_users.role = 'manager')
    )
  );

CREATE POLICY "Categories are deletable by admin users" ON categories
  FOR DELETE USING (
    EXISTS (
      SELECT 1 FROM admin_users 
      WHERE admin_users.id = auth.uid() 
      AND (admin_users.role = 'admin' OR admin_users.role = 'manager')
    )
  );

-- Create policies for menu_items
CREATE POLICY "Menu items are viewable by everyone" ON menu_items
  FOR SELECT USING (true);

CREATE POLICY "Menu items are insertable by admin users" ON menu_items
  FOR INSERT WITH CHECK (
    EXISTS (
      SELECT 1 FROM admin_users 
      WHERE admin_users.id = auth.uid() 
      AND (admin_users.role = 'admin' OR admin_users.role = 'manager')
    )
  );

CREATE POLICY "Menu items are updatable by admin users" ON menu_items
  FOR UPDATE USING (
    EXISTS (
      SELECT 1 FROM admin_users 
      WHERE admin_users.id = auth.uid() 
      AND (admin_users.role = 'admin' OR admin_users.role = 'manager')
    )
  );

CREATE POLICY "Menu items are deletable by admin users" ON menu_items
  FOR DELETE USING (
    EXISTS (
      SELECT 1 FROM admin_users 
      WHERE admin_users.id = auth.uid() 
      AND (admin_users.role = 'admin' OR admin_users.role = 'manager')
    )
  );

-- Create policies for admin_users
CREATE POLICY "Admin users can view their own record" ON admin_users
  FOR SELECT USING (auth.uid() = id);

CREATE POLICY "Admin users can update their own record" ON admin_users
  FOR UPDATE USING (auth.uid() = id);

-- Create function to automatically update updated_at timestamp
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = NOW();
    RETURN NEW;
END;
$$ language 'plpgsql';

-- Create triggers for updated_at
CREATE TRIGGER update_categories_updated_at BEFORE UPDATE ON categories
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_menu_items_updated_at BEFORE UPDATE ON menu_items
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_admin_users_updated_at BEFORE UPDATE ON admin_users
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
```

### 3. Insert Sample Data
After setting up the schema, run this to insert sample data:

```sql
-- Insert default categories
INSERT INTO categories (name, icon, gradient, sort_order) VALUES
  ('Appetizers', '🥟', 'from-orange-400 to-red-500', 1),
  ('Fusion Specials', '🍁🔥', 'from-purple-500 to-pink-500', 2),
  ('Pakistani Classics', '🌶️', 'from-green-500 to-emerald-600', 3),
  ('Canadian Favorites', '🍯', 'from-red-500 to-orange-500', 4),
  ('Beverages', '🧋', 'from-blue-500 to-cyan-500', 5),
  ('Desserts', '🍰', 'from-pink-500 to-rose-500', 6)
ON CONFLICT DO NOTHING;

-- Insert sample menu items
INSERT INTO menu_items (name, description, price, image_url, category_id, dietary_tags, is_popular) VALUES
  ('Samosa Poutine Bites', 'Mini samosas filled with spiced potatoes, served with tamarind gravy and cheese curds', 12.99, 'https://images.unsplash.com/photo-1601050690597-df0568f70950?ixlib=rb-4.0.3&auto=format&fit=crop&w=500&q=80', (SELECT id FROM categories WHERE name = 'Appetizers'), ARRAY['🌱', '🌶️', 'halal'], true),
  ('Butter Chicken Poutine', 'Crispy fries topped with butter chicken, cheese curds, and naan crumbs', 16.99, 'https://images.unsplash.com/photo-1630384060421-cb20d0e0649d?ixlib=rb-4.0.3&auto=format&fit=crop&w=500&q=80', (SELECT id FROM categories WHERE name = 'Fusion Specials'), ARRAY['🌶️', '🥛', 'halal'], true),
  ('Chicken Karahi', 'Traditional wok-cooked chicken with tomatoes, ginger, and aromatic spices', 17.99, 'https://images.unsplash.com/photo-1565557623262-b51c2513a641?ixlib=rb-4.0.3&auto=format&fit=crop&w=500&q=80', (SELECT id FROM categories WHERE name = 'Pakistani Classics'), ARRAY['🌶️', 'halal'], true),
  ('Classic Poutine', 'Hand-cut fries with cheese curds and rich gravy', 12.99, 'https://images.unsplash.com/photo-1630384060421-cb20d0e0649d?ixlib=rb-4.0.3&auto=format&fit=crop&w=500&q=80', (SELECT id FROM categories WHERE name = 'Canadian Favorites'), ARRAY['🥛', 'halal'], true),
  ('Masala Chai Latte', 'Traditional spiced tea with steamed milk and a touch of maple syrup', 5.99, 'https://images.unsplash.com/photo-1571934811356-5cc061b6821f?ixlib=rb-4.0.3&auto=format&fit=crop&w=500&q=80', (SELECT id FROM categories WHERE name = 'Beverages'), ARRAY['🥛', '🌶️', 'halal'], true),
  ('Butter Tarts', 'Classic Canadian dessert with a sweet, gooey filling', 8.99, 'https://images.unsplash.com/photo-1509440159596-0249088772ff?ixlib=rb-4.0.3&auto=format&fit=crop&w=500&q=80', (SELECT id FROM categories WHERE name = 'Desserts'), ARRAY['🥛', 'halal'], true)
ON CONFLICT DO NOTHING;
```

### 4. Test the Connection
After updating your API key and setting up the database:

1. Update the API key in `setup-supabase-database.js`:
```javascript
const supabaseAnonKey = 'your_new_anon_key_here';
```

2. Run the setup script:
```bash
node setup-supabase-database.js
```

3. Start your development server:
```bash
npm run dev
```

### 5. Verify Everything Works
- Check that the menu loads without errors
- Verify categories are displayed
- Confirm menu items appear in each category
- Test the mobile and desktop navigation

## 🔍 Troubleshooting

### If you still get connection errors:
1. **Check API Key**: Make sure you're using the `anon` public key, not the `service_role` key
2. **Verify URL**: Ensure the Supabase URL is correct
3. **Check RLS Policies**: Make sure the policies allow public read access
4. **Network Issues**: Try accessing from a different network

### If tables don't exist:
1. Run the schema creation SQL in your Supabase SQL Editor
2. Check that all tables were created successfully
3. Verify the table names match exactly: `categories`, `menu_items`, `admin_users`

### If data doesn't load:
1. Check the browser console for specific error messages
2. Verify that sample data was inserted correctly
3. Test the connection using the Supabase dashboard

## 📞 Need Help?
If you're still having issues:
1. Check the browser console for detailed error messages
2. Verify your Supabase project settings
3. Test the connection using the Supabase dashboard
4. Make sure your environment variables are loaded correctly

The updated Menu component now includes better error handling and will show helpful error messages if there are connection issues. 