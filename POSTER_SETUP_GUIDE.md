# Promo Poster Management Setup Guide

This guide will help you set up the Promo Poster Management feature for your Howdy Cafe website.

## Database Setup

You need to create several tables in your Supabase database to support the full functionality.

### 1. Create the promo_posters table

Run the following SQL in your Supabase SQL Editor:

```sql
-- Create promo_posters table
CREATE TABLE IF NOT EXISTS promo_posters (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  title TEXT NOT NULL,
  description TEXT,
  image_url TEXT NOT NULL,
  start_date TIMESTAMP WITH TIME ZONE NOT NULL,
  end_date TIMESTAMP WITH TIME ZONE NOT NULL,
  is_active BOOLEAN DEFAULT true,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Enable Row Level Security (RLS)
ALTER TABLE promo_posters ENABLE ROW LEVEL SECURITY;

-- Drop existing policies if they exist (to avoid conflicts)
DROP POLICY IF EXISTS "Allow public read access to active posters" ON promo_posters;
DROP POLICY IF EXISTS "Allow authenticated users to manage posters" ON promo_posters;

-- Create policy to allow public read access (for the lightbox)
CREATE POLICY "Allow public read access to active posters" ON promo_posters
  FOR SELECT USING (is_active = true);

-- Create policy to allow authenticated users to manage posters
CREATE POLICY "Allow authenticated users to manage posters" ON promo_posters
  FOR ALL USING (auth.role() = 'authenticated');

-- Create updated_at trigger
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = NOW();
    RETURN NEW;
END;
$$ language 'plpgsql';

-- Drop existing trigger if it exists
DROP TRIGGER IF EXISTS update_promo_posters_updated_at ON promo_posters;

CREATE TRIGGER update_promo_posters_updated_at 
  BEFORE UPDATE ON promo_posters 
  FOR EACH ROW 
  EXECUTE FUNCTION update_updated_at_column();
```

### 2. Create the menu_item_categories table (Optional - for future use)

This table allows menu items to belong to multiple categories:

```sql
-- Create menu_item_categories junction table
CREATE TABLE IF NOT EXISTS menu_item_categories (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  menu_item_id UUID NOT NULL REFERENCES menu_items(id) ON DELETE CASCADE,
  category_id UUID NOT NULL REFERENCES categories(id) ON DELETE CASCADE,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  UNIQUE(menu_item_id, category_id)
);

-- Enable Row Level Security (RLS)
ALTER TABLE menu_item_categories ENABLE ROW LEVEL SECURITY;

-- Drop existing policy if it exists
DROP POLICY IF EXISTS "Allow authenticated users to manage menu item categories" ON menu_item_categories;

-- Create policy to allow authenticated users to manage relationships
CREATE POLICY "Allow authenticated users to manage menu item categories" ON menu_item_categories
  FOR ALL USING (auth.role() = 'authenticated');
```

### 3. Storage Bucket Setup

Make sure your `menu-images` storage bucket allows poster uploads. The posters will be stored in a `posters/` folder within this bucket.

#### Storage Bucket Policies

If you need to create or update storage policies, run this SQL:

```sql
-- Create storage bucket if it doesn't exist
INSERT INTO storage.buckets (id, name, public) 
VALUES ('menu-images', 'menu-images', true)
ON CONFLICT (id) DO NOTHING;

-- Drop existing policies to avoid conflicts
DROP POLICY IF EXISTS "Public Access" ON storage.objects;
DROP POLICY IF EXISTS "Authenticated users can upload images" ON storage.objects;
DROP POLICY IF EXISTS "Authenticated users can update images" ON storage.objects;
DROP POLICY IF EXISTS "Authenticated users can delete images" ON storage.objects;

-- Allow public access to menu-images bucket
CREATE POLICY "Public Access" ON storage.objects
FOR SELECT USING (bucket_id = 'menu-images');

-- Allow authenticated users to upload to menu-images bucket
CREATE POLICY "Authenticated users can upload images" ON storage.objects
FOR INSERT WITH CHECK (bucket_id = 'menu-images' AND auth.role() = 'authenticated');

-- Allow authenticated users to update their uploads
CREATE POLICY "Authenticated users can update images" ON storage.objects
FOR UPDATE USING (bucket_id = 'menu-images' AND auth.role() = 'authenticated');

-- Allow authenticated users to delete their uploads
CREATE POLICY "Authenticated users can delete images" ON storage.objects
FOR DELETE USING (bucket_id = 'menu-images' AND auth.role() = 'authenticated');
```

## Features Implemented

### Admin Panel Features

1. **Posters Tab**: New tab in the admin dashboard for managing promotional posters
2. **Add Poster**: Upload poster images and set scheduling
3. **Edit Poster**: Modify existing poster details
4. **Delete Poster**: Remove posters from the system
5. **Scheduling**: Set start and end dates for posters
6. **Active/Inactive Status**: Toggle poster visibility

### Website Features

1. **Lightbox Popup**: Active posters appear as a lightbox on first page load
2. **Session-based Display**: Posters only show once per browser session
3. **Responsive Design**: Lightbox works on all device sizes
4. **Smooth Animations**: Framer Motion animations for better UX

### Image Management Features

1. **Automatic Cleanup**: Old images are automatically deleted when replaced
2. **Storage Optimization**: Saves storage space and reduces costs
3. **Safe Upload Process**: New image is uploaded first, then old image is deleted
4. **Error Handling**: If cleanup fails, the new image is still saved

## How It Works

### Admin Workflow

1. **Access Admin Panel**: Go to `/admin/dashboard` and log in
2. **Navigate to Posters Tab**: Click on the "Posters" tab
3. **Add New Poster**: Click "Add Poster" button
4. **Upload Image**: Either upload a file or provide an image URL
5. **Set Schedule**: Choose start and end dates for the poster
6. **Set Status**: Toggle active/inactive status
7. **Save**: The poster will be saved and can be displayed on the website

### Website Display

1. **First Visit**: When a user visits the website for the first time in a session
2. **Check Active Posters**: System checks for active posters within the current date range
3. **Display Lightbox**: If an active poster exists, it shows as a lightbox popup
4. **Session Storage**: Uses sessionStorage to ensure posters only show once per session
5. **Close Functionality**: Users can close the lightbox and continue browsing

### Image Upload Process

1. **Upload New Image**: New image is uploaded to storage first
2. **Get Public URL**: System generates public URL for the new image
3. **Delete Old Image**: If replacing an existing image, the old image is deleted
4. **Update Database**: Database is updated with the new image URL
5. **Error Handling**: If deletion fails, the new image is still saved

## Technical Details

### Database Schema

```typescript
interface PromoPoster {
  id: string
  title: string
  description?: string
  image_url: string
  start_date: string
  end_date: string
  is_active: boolean
  created_at: string
  updated_at: string
}
```

### Components

- `PromoPosterLightbox.tsx`: Lightbox component for displaying posters
- `AdminDashboard.tsx`: Updated with poster management functionality
- `App.tsx`: Updated to include lightbox logic

### Key Features

- **Image Upload**: Supports both file upload and URL input
- **Date Scheduling**: Start and end date validation
- **Status Management**: Active/inactive toggle
- **Responsive Design**: Works on mobile and desktop
- **Session Management**: Prevents repeated displays in same session
- **Error Handling**: Comprehensive error handling and user feedback
- **Automatic Cleanup**: Old images are automatically deleted when replaced

## Usage Tips

1. **Image Optimization**: Use optimized images (recommended max 2MB) for better performance
2. **Scheduling**: Set realistic start and end dates to avoid expired posters
3. **Content**: Keep poster content relevant and engaging
4. **Testing**: Test posters in different browsers and devices
5. **Monitoring**: Regularly check poster status and expiration dates
6. **Storage Management**: The system automatically cleans up old images to save space

## Troubleshooting

### Common Issues

1. **Poster Not Showing**: Check if poster is active and within date range
2. **Image Not Loading**: Verify image URL or re-upload the file
3. **Database Errors**: Ensure the promo_posters table exists and has correct permissions
4. **Storage Issues**: Check Supabase storage bucket permissions

### Debug Steps

1. Check browser console for errors
2. Verify database table exists
3. Confirm storage bucket permissions
4. Test with different browsers
5. Clear sessionStorage to test lightbox again

### Error Solutions

#### "Error uploading image"
- Check if the `menu-images` storage bucket exists
- Verify storage bucket permissions
- Ensure the bucket allows authenticated uploads

#### "404 errors for menu_item_categories"
- This table is optional and the code handles missing tables gracefully
- The system falls back to using the direct `category_id` field

#### "Loaded posters: Array(0)"
- This is normal if no posters exist yet
- Create a test poster to verify functionality

#### "Policy already exists" errors
- The updated SQL scripts now use `DROP POLICY IF EXISTS` to handle existing policies
- Run the scripts again and they should work without conflicts

#### "Syntax error at or near '-'"
- Make sure you're using the correct SQL comment syntax (`--` not `-`)
- Copy the SQL exactly as shown in the guide

#### "Failed to delete old image" warnings
- This is normal and won't affect functionality
- The new image is still saved successfully
- Old images can be manually cleaned up later if needed

## Security Considerations

- Posters are publicly readable when active
- Only authenticated users can manage posters
- Image uploads are validated and stored securely
- Session storage prevents abuse of lightbox display
- Automatic cleanup prevents storage bloat

## Testing the Feature

1. **Create a Test Poster**:
   - Go to admin dashboard → Posters tab
   - Click "Add Poster"
   - Upload an image or use an image URL
   - Set start date to today and end date to tomorrow
   - Set as active
   - Save the poster

2. **Test the Lightbox**:
   - Open the website in a new browser session
   - The lightbox should appear after 1 second
   - Close the lightbox and refresh - it shouldn't appear again
   - Open in a new incognito window to test again

3. **Test Image Replacement**:
   - Edit an existing poster
   - Upload a new image
   - Save the changes
   - The old image should be automatically deleted from storage

This feature provides a powerful way to promote special offers, events, or announcements directly to your website visitors while maintaining full control over timing and content. The automatic image cleanup ensures efficient storage management and cost optimization.
