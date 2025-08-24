# Supabase Storage Setup Guide

## Issue: "Image not available" when uploading menu item images

This guide will help you set up Supabase storage properly to fix image upload issues in your Howdy Cafe admin dashboard.

## Prerequisites

1. You have a Supabase project set up
2. Your environment variables are configured correctly
3. You have admin access to your Supabase dashboard

## Step 1: Create Storage Bucket

1. **Go to your Supabase Dashboard**
   - Navigate to https://supabase.com/dashboard
   - Select your project

2. **Navigate to Storage**
   - Click on "Storage" in the left sidebar
   - Click "Create a new bucket"

3. **Create the bucket**
   - **Bucket name**: `menu-images` (exactly as shown)
   - **Public bucket**: ✅ Check this box (required for public image access)
   - **File size limit**: 10MB (system will compress images larger than 3MB automatically)
   - **Allowed MIME types**: `image/*` (or specific types like `image/jpeg,image/png,image/webp,image/gif`)

4. **Click "Create bucket"**

## Step 2: Configure Storage Policies

After creating the bucket, you need to set up policies to allow uploads and public access.

### Policy 1: Allow Public Read Access

1. In your `menu-images` bucket, go to "Policies"
2. Click "New Policy"
3. Choose "Create a policy from template"
4. Select "Public access to any authenticated user"
5. **Policy name**: `Public read access`
6. **Target roles**: `public`
7. **Policy definition**:
   ```sql
   SELECT
   ```
8. Click "Review" and then "Save policy"

### Policy 2: Allow Authenticated Users to Upload

1. Click "New Policy" again
2. Choose "Create a policy from template"
3. Select "Users can upload their own files"
4. **Policy name**: `Authenticated users can upload`
5. **Target roles**: `authenticated`
6. **Policy definition**:
   ```sql
   INSERT
   ```
7. Click "Review" and then "Save policy"

### Policy 3: Allow Authenticated Users to Update/Delete

1. Click "New Policy" again
2. Choose "Create a policy from template"
3. Select "Users can update their own files"
4. **Policy name**: `Authenticated users can update`
5. **Target roles**: `authenticated`
6. **Policy definition**:
   ```sql
   UPDATE
   ```
7. Click "Review" and then "Save policy"

1. Click "New Policy" again
2. Choose "Create a policy from template"
3. Select "Users can delete their own files"
4. **Policy name**: `Authenticated users can delete`
5. **Target roles**: `authenticated`
6. **Policy definition**:
   ```sql
   DELETE
   ```
7. Click "Review" and then "Save policy"

## Step 3: Alternative - Use RLS (Row Level Security) Policies

If you prefer more granular control, you can use these custom policies:

### For Public Read Access:
```sql
CREATE POLICY "Public read access" ON storage.objects
FOR SELECT USING (bucket_id = 'menu-images');
```

### For Authenticated Upload:
```sql
CREATE POLICY "Authenticated users can upload" ON storage.objects
FOR INSERT WITH CHECK (bucket_id = 'menu-images' AND auth.role() = 'authenticated');
```

### For Authenticated Update:
```sql
CREATE POLICY "Authenticated users can update" ON storage.objects
FOR UPDATE USING (bucket_id = 'menu-images' AND auth.role() = 'authenticated');
```

### For Authenticated Delete:
```sql
CREATE POLICY "Authenticated users can delete" ON storage.objects
FOR DELETE USING (bucket_id = 'menu-images' AND auth.role() = 'authenticated');
```

## Step 4: Test the Setup

1. **Go to your admin dashboard**
   - Navigate to your website's admin panel
   - Try to add a new menu item with an image

2. **Check the browser console**
   - Open Developer Tools (F12)
   - Look for upload-related logs
   - Check for any error messages

3. **Verify the image appears**
   - After upload, the image should display in the menu item card
   - If it shows "Image not available", check the console for errors

## Step 5: Image Compression Feature

The system now includes automatic image compression:

- **Upload Limit**: 10MB maximum file size
- **Compression**: Images larger than 3MB are automatically compressed
- **Quality**: Maintains good visual quality while reducing file size
- **Dimensions**: Automatically resizes to max 1920x1080 while maintaining aspect ratio
- **Formats**: Supports JPEG, PNG, WebP, and GIF

### How Compression Works:
1. User uploads image (up to 10MB)
2. If image is larger than 3MB, system compresses it
3. Compression reduces dimensions and quality as needed
4. Final file is uploaded to Supabase storage
5. Original file is automatically cleaned up

## Step 6: Troubleshooting

### Common Issues:

1. **"Storage bucket not found"**
   - Make sure the bucket name is exactly `menu-images`
   - Check that the bucket exists in your Supabase project

2. **"Permission denied"**
   - Verify that you have the correct policies set up
   - Make sure you're logged in as an authenticated user

3. **"File size exceeds storage limits"**
   - Check your bucket's file size limit (should be 10MB or higher)
   - Try uploading a smaller image (< 10MB)

4. **"Invalid file type"**
   - Make sure you're uploading an image file (JPEG, PNG, WebP, GIF)
   - Check the bucket's allowed MIME types

5. **Images upload but don't display**
   - Check if the bucket is set as "Public"
   - Verify the public URL is accessible
   - Check browser console for CORS errors

6. **Compression issues**
   - Check browser console for compression-related errors
   - Try with a different image format
   - Ensure the image is not corrupted

### Debug Steps:

1. **Check environment variables**:
   ```bash
   # Make sure these are set in your .env file
   VITE_SUPABASE_URL=your_supabase_url
   VITE_SUPABASE_ANON_KEY=your_supabase_anon_key
   ```

2. **Test storage connection**:
   ```javascript
   // In browser console
   const { data, error } = await supabase.storage
     .from('menu-images')
     .list();
   console.log('Storage test:', { data, error });
   ```

3. **Check bucket contents**:
   - Go to Supabase Dashboard → Storage → menu-images
   - Verify that files are being uploaded

4. **Test compression**:
   - Upload a large image (> 3MB)
   - Check console logs for compression messages
   - Verify the final file size is under 3MB

## Step 7: Environment Variables

Make sure your environment variables are correctly set:

### For Development (.env.local):
```env
VITE_SUPABASE_URL=https://your-project-id.supabase.co
VITE_SUPABASE_ANON_KEY=your-anon-key
```

### For Production (Netlify/Vercel):
Set these in your deployment platform's environment variables section.

## Additional Notes

- **File naming**: The system generates unique filenames using timestamps and random strings
- **Image optimization**: Images are automatically compressed and optimized for web
- **CDN**: Supabase storage automatically serves files through a CDN for better performance
- **Backup**: Consider implementing a backup strategy for your images
- **Compression**: Automatic compression helps reduce storage costs and improve loading times

## Support

If you're still experiencing issues after following this guide:

1. Check the browser console for specific error messages
2. Verify your Supabase project settings
3. Test with a simple image file first
4. Check your network connection and firewall settings
5. Try the "Test Storage" button in the admin dashboard

The improved error handling and compression features will now provide better user experience and more specific error messages to help identify the exact issue.
