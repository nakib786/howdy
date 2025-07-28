# Howdy Cafe Admin Setup

This document provides instructions for setting up the admin system for Howdy Cafe.

## Prerequisites

1. A Supabase project with authentication enabled
2. Environment variables configured

## Environment Variables

Create a `.env` file in the root directory with the following variables:

```env
VITE_SUPABASE_URL=your_supabase_project_url
VITE_SUPABASE_ANON_KEY=your_supabase_anon_key
```

## Database Setup

1. Go to your Supabase project dashboard
2. Navigate to the SQL Editor
3. Run the SQL script from `supabase-schema.sql` to create the necessary tables and policies
4. Run the migration script from `migrate-menu-data.sql` to populate the database with your current menu items

## Creating Admin Users

1. In your Supabase dashboard, go to Authentication > Users
2. Create a new user with email and password
3. Go to the SQL Editor and run:

```sql
INSERT INTO admin_users (id, email, role) 
VALUES ('user-uuid-from-auth', 'admin@howdycafe.ca', 'admin');
```

Replace `user-uuid-from-auth` with the actual UUID of the user you created.

## Features

### Admin Login
- Secure authentication using Supabase Auth
- Role-based access control (admin/manager)
- Protected routes

### Menu Management
- Add, edit, and delete menu items
- Upload images via URL
- Set dietary tags and popularity status
- Organize items by categories

### Category Management
- Create and manage menu categories
- Set custom icons and gradient colors
- Control sort order

### Database Schema

#### Categories Table
- `id`: UUID primary key
- `name`: Category name
- `icon`: Emoji or icon representation
- `gradient`: Tailwind CSS gradient classes
- `sort_order`: Display order
- `created_at` / `updated_at`: Timestamps

#### Menu Items Table
- `id`: UUID primary key
- `name`: Item name
- `description`: Item description
- `price`: Decimal price
- `image_url`: Image URL
- `category_id`: Foreign key to categories
- `dietary_tags`: Array of dietary tags (see Dietary Labels section below)
- `is_popular`: Boolean for popular items
- `created_at` / `updated_at`: Timestamps

#### Dietary Labels System
The menu system supports comprehensive dietary labeling to help customers make informed choices:

**Available Dietary Labels:**
- `halal` - Halal Certified (special green logo)
- `🌱` - Vegetarian (no meat or fish)
- `🌶️` - Spicy (contains hot spices or peppers)
- `🥛` - Contains Dairy (milk, cheese, dairy products)
- `🐟` - Contains Fish (fish or seafood ingredients)
- `🥜` - Contains Nuts (tree nuts or peanuts)
- `🌾` - Gluten Free (no wheat, barley, or rye)
- `🥚` - Contains Eggs (egg or egg products)
- `🦐` - Contains Shellfish (shrimp, crab, shellfish)
- `🍄` - Contains Mushrooms (mushroom ingredients)

**Custom Labels:**
- Admin can add custom dietary labels via the admin interface
- Custom labels are stored as text strings
- All labels are displayed on menu items and in the dietary guide

**Display Features:**
- Labels appear as badges on menu items
- Comprehensive dietary guide at bottom of menu page
- Hover tooltips show detailed descriptions
- Special styling for Halal certification

#### Admin Users Table
- `id`: UUID (references auth.users)
- `email`: User email
- `role`: 'admin' or 'manager'
- `created_at` / `updated_at`: Timestamps

## Security

- Row Level Security (RLS) enabled on all tables
- Admin-only access for create/update/delete operations
- Public read access for menu items and categories
- JWT-based authentication

## Usage

1. Navigate to `/admin/login`
2. Sign in with admin credentials
3. Access the dashboard at `/admin/dashboard`
4. Manage menu items and categories

## API Endpoints

The admin system uses Supabase's built-in REST API:

- `GET /rest/v1/categories` - List categories
- `POST /rest/v1/categories` - Create category
- `PUT /rest/v1/categories?id=eq.{id}` - Update category
- `DELETE /rest/v1/categories?id=eq.{id}` - Delete category

- `GET /rest/v1/menu_items` - List menu items
- `POST /rest/v1/menu_items` - Create menu item
- `PUT /rest/v1/menu_items?id=eq.{id}` - Update menu item
- `DELETE /rest/v1/menu_items?id=eq.{id}` - Delete menu item

All endpoints require authentication and proper role permissions.

## Troubleshooting

### Common Issues

1. **Authentication errors**: Ensure environment variables are correctly set
2. **Permission denied**: Check if user exists in admin_users table
3. **Database connection**: Verify Supabase URL and API key
4. **RLS policies**: Ensure policies are correctly applied

### Debug Mode

Enable debug logging by adding to your `.env`:

```env
VITE_DEBUG=true
```

This will log authentication and database operations to the console. 