import React, { useState, useEffect } from 'react'
import { motion } from 'framer-motion'
import { useAuth } from '../contexts/AuthContext'
import { useNavigate } from 'react-router-dom'
import { supabase, type MenuItem, type Category, type Promo, type PromoPoster } from '../lib/supabase'
import { LogOut, Plus, Edit, Trash2, Menu as MenuIcon, Settings, GripVertical, Smile } from 'lucide-react'
import howdyLogo from '../assets/Howdy Cafe Logo - Horizontal Black Text.png'
import howdyLogoStacked from '../assets/Howdy Cafe Logo - Stacked Black Text.png'
import {
  DndContext,
  closestCenter,
  KeyboardSensor,
  PointerSensor,
  useSensor,
  useSensors,
  type DragEndEvent,
} from '@dnd-kit/core'
import {
  arrayMove,
  SortableContext,
  sortableKeyboardCoordinates,
  verticalListSortingStrategy,
} from '@dnd-kit/sortable'
import {
  useSortable,
} from '@dnd-kit/sortable'
import { CSS } from '@dnd-kit/utilities'

// Emoji Picker Component
const EmojiPicker: React.FC<{ onSelect: (emoji: string) => void }> = ({ onSelect }) => {
  const [isOpen, setIsOpen] = useState(false)
  
  const commonEmojis = [
    '🍽️', '🍕', '🍔', '🌮', '🍜', '🍱', '🥗', '🥪', '🍖', '🍗',
    '🥩', '🥓', '🍳', '🥚', '🧀', '🥛', '🍼', '☕', '🍵', '🥤',
    '🍺', '🍷', '🍸', '🍹', '🍪', '🍩', '🍰', '🧁', '🍦', '🍨',
    '🍓', '🍎', '🍊', '🍋', '🍌', '🥝', '🍇', '🍉', '🍈', '🍑',
    '🥭', '🍍', '🥥', '🥑', '🥦', '🥬', '🥒', '🌶️', '🌽', '🥕',
    '🥔', '🍠', '🥐', '🥯', '🍞', '🥖', '🥨', '🧀', '🥚', '🥞',
    '🧇', '🥓', '🥩', '🍗', '🍖', '🌭', '🍔', '🍟', '🍕', '🥪',
    '🥙', '🧆', '🌮', '🌯', '🥗', '🥘', '🥫', '🍝', '🍜', '🍲',
    '🍛', '🍣', '🍱', '🥟', '🥠', '🍤', '🍙', '🍚', '🍘', '🍥',
    '🥠', '🍢', '🍡', '🍧', '🍨', '🍦', '🥧', '🧁', '🍰', '🎂'
  ]

  return (
    <div className="relative">
      <button
        type="button"
        onClick={() => setIsOpen(!isOpen)}
        className="flex items-center space-x-2 px-3 py-2 border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors"
      >
        <Smile className="w-4 h-4 text-gray-500" />
        <span className="text-sm text-gray-600">Pick Emoji</span>
      </button>
      
      {isOpen && (
        <div className="absolute top-full -left-64 md:-left-60 mt-1 bg-white border border-gray-200 rounded-lg shadow-lg p-4 z-50 max-h-80 overflow-y-auto min-w-96">
          <div className="grid grid-cols-8 gap-2">
            {commonEmojis.map((emoji, index) => (
              <button
                key={index}
                type="button"
                onClick={() => {
                  onSelect(emoji)
                  setIsOpen(false)
                }}
                className="w-9 h-9 text-lg hover:bg-gray-100 rounded-lg transition-colors flex items-center justify-center"
              >
                {emoji}
              </button>
            ))}
          </div>
        </div>
      )}
    </div>
  )
}

// Sortable Category Item Component
interface SortableCategoryItemProps {
  category: Category
  onEdit: (category: Category) => void
  onDelete: (id: string) => void
}

const SortableCategoryItem: React.FC<SortableCategoryItemProps> = ({ category, onEdit, onDelete }) => {
  const {
    attributes,
    listeners,
    setNodeRef,
    transform,
    transition,
    isDragging,
  } = useSortable({ id: category.id })

  const style = {
    transform: CSS.Transform.toString(transform),
    transition,
  }

  return (
    <motion.div
      ref={setNodeRef}
      style={style}
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: isDragging ? 0.5 : 1, y: 0 }}
      className={`bg-white border border-gray-200 rounded-2xl overflow-hidden hover:shadow-lg transition-all duration-200 hover:scale-[1.02] ${
        isDragging ? 'shadow-xl scale-105' : ''
      }`}
    >
      <div className="relative">
        <div className="h-32 bg-gradient-to-r from-primary to-pink-500 flex items-center justify-center">
          <div className="text-4xl">{category.icon}</div>
        </div>
        <div className="absolute top-3 right-3 flex space-x-1">
          <button
            {...attributes}
            {...listeners}
            className="p-2 bg-white/90 backdrop-blur-sm rounded-lg text-gray-600 hover:text-gray-800 transition-colors cursor-grab active:cursor-grabbing"
          >
            <GripVertical className="w-4 h-4" />
          </button>
          <button 
            onClick={() => onEdit(category)}
            className="p-2 bg-white/90 backdrop-blur-sm rounded-lg text-gray-600 hover:text-primary transition-colors hover:bg-white"
          >
            <Edit className="w-4 h-4" />
          </button>
          <button
            onClick={() => onDelete(category.id)}
            className="p-2 bg-white/90 backdrop-blur-sm rounded-lg text-gray-600 hover:text-red-600 transition-colors hover:bg-white"
          >
            <Trash2 className="w-4 h-4" />
          </button>
        </div>
      </div>
      <div className="p-4 sm:p-6">
        <h3 className="font-bold text-base sm:text-lg text-gray-900 mb-2">{category.name}</h3>
        <p className="text-xs sm:text-sm text-gray-600">Drag to reorder categories</p>
      </div>
    </motion.div>
  )
}

// Image compression utility function
const compressImage = async (file: File, maxSizeMB: number = 3): Promise<File> => {
  console.log('🗜️ Starting image compression...');
  console.log('📊 Original file size:', (file.size / 1024 / 1024).toFixed(2), 'MB');
  
  return new Promise((resolve, reject) => {
    const canvas = document.createElement('canvas');
    const ctx = canvas.getContext('2d');
    const img = new Image();
    
    img.onload = () => {
      // Calculate new dimensions while maintaining aspect ratio
      const maxWidth = 1920; // Max width for web
      const maxHeight = 1080; // Max height for web
      let { width, height } = img;
      
      if (width > maxWidth) {
        height = (height * maxWidth) / width;
        width = maxWidth;
      }
      
      if (height > maxHeight) {
        width = (width * maxHeight) / height;
        height = maxHeight;
      }
      
      // Set canvas dimensions
      canvas.width = width;
      canvas.height = height;
      
      // Draw and compress
      ctx?.drawImage(img, 0, 0, width, height);
      
      // Convert to blob with compression
      canvas.toBlob(
        (blob) => {
          if (!blob) {
            reject(new Error('Failed to compress image'));
            return;
          }
          
          console.log('📊 Compressed file size:', (blob.size / 1024 / 1024).toFixed(2), 'MB');
          
          // If still too large, compress further
          if (blob.size > maxSizeMB * 1024 * 1024) {
            console.log('🔄 File still too large, compressing further...');
            compressImage(new File([blob], file.name, { type: file.type }), maxSizeMB)
              .then(resolve)
              .catch(reject);
          } else {
            const compressedFile = new File([blob], file.name, { type: file.type });
            console.log('✅ Compression complete:', (compressedFile.size / 1024 / 1024).toFixed(2), 'MB');
            resolve(compressedFile);
          }
        },
        file.type,
        0.8 // Start with 80% quality
      );
    };
    
    img.onerror = () => reject(new Error('Failed to load image for compression'));
    img.src = URL.createObjectURL(file);
  });
};

// Test function to debug storage issues
const testStorageConnection = async () => {
  console.log('🧪 Testing Supabase storage connection...');
  
  try {
    // Test 1: List buckets
    const { data: buckets, error: bucketsError } = await supabase.storage.listBuckets();
    console.log('📦 Available buckets:', buckets);
    if (bucketsError) {
      console.error('❌ Error listing buckets:', bucketsError);
    }
    
    // Test 2: Check if menu-images bucket exists
    const menuImagesBucket = buckets?.find(bucket => bucket.name === 'menu-images');
    if (!menuImagesBucket) {
      console.error('❌ menu-images bucket not found!');
      console.log('Available buckets:', buckets?.map(b => b.name));
      return false;
    }
    console.log('✅ menu-images bucket found:', menuImagesBucket);
    
    // Test 3: List files in menu-images bucket
    const { data: files, error: filesError } = await supabase.storage
      .from('menu-images')
      .list();
    console.log('📁 Files in menu-images bucket:', files);
    if (filesError) {
      console.error('❌ Error listing files:', filesError);
    }
    
    // Test 4: Test public URL generation
    if (files && files.length > 0) {
      const testFile = files[0];
      const { data: { publicUrl } } = supabase.storage
        .from('menu-images')
        .getPublicUrl(testFile.name);
      console.log('🔗 Test public URL:', publicUrl);
    }
    
    return true;
  } catch (error) {
    console.error('❌ Storage test failed:', error);
    return false;
  }
};

// Utility function for uploading images with automatic cleanup
const uploadImageToStorage = async (file: File, folder: string = 'menu-items', oldImageUrl?: string): Promise<string> => {
  console.log('📤 Starting upload process for file:', file.name, 'to folder:', folder);
  console.log('📊 File details:', {
    name: file.name,
    size: file.size,
    type: file.type,
    lastModified: file.lastModified
  });
  
  // Validate file
  if (!file) {
    throw new Error('No file provided for upload');
  }
  
  // Check file size (max 10MB - will be compressed if larger than 3MB)
  const maxUploadSize = 10 * 1024 * 1024; // 10MB
  const maxFinalSize = 3 * 1024 * 1024; // 3MB
  
  if (file.size > maxUploadSize) {
    throw new Error(`File size too large. Maximum upload size is 10MB. Current size: ${(file.size / 1024 / 1024).toFixed(2)}MB`);
  }
  
  // Compress if larger than 3MB
  let processedFile = file;
  if (file.size > maxFinalSize) {
    console.log('🗜️ File larger than 3MB, compressing...');
    try {
      processedFile = await compressImage(file, 3);
      console.log('✅ Compression completed');
    } catch (compressionError) {
      console.warn('⚠️ Compression failed, using original file:', compressionError);
      processedFile = file;
    }
  }
  
  // Check file type
  const allowedTypes = ['image/jpeg', 'image/jpg', 'image/png', 'image/webp', 'image/gif'];
  if (!allowedTypes.includes(file.type)) {
    throw new Error(`Invalid file type. Allowed types: ${allowedTypes.join(', ')}. Current type: ${file.type}`);
  }
  
  const fileExt = file.name.split('.').pop()?.toLowerCase();
  const fileName = `${Date.now()}-${Math.random().toString(36).substring(2)}.${fileExt}`;
  const filePath = `${folder}/${fileName}`;
  
  console.log('📁 Generated file path:', filePath);

  try {
    // Upload new image first
    console.log('⬆️ Uploading to Supabase storage...');
    const { data: uploadData, error: uploadError } = await supabase.storage
      .from('menu-images')
      .upload(filePath, processedFile, {
        cacheControl: '3600',
        upsert: false
      });

    if (uploadError) {
      console.error('❌ Upload error:', uploadError);
      
      // Provide more specific error messages
      if (uploadError.message.includes('bucket')) {
        throw new Error('Storage bucket not found. Please check your Supabase storage configuration.');
      } else if (uploadError.message.includes('permission')) {
        throw new Error('Permission denied. Please check your Supabase storage policies.');
      } else if (uploadError.message.includes('size')) {
        throw new Error('File size exceeds storage limits.');
      } else {
        throw new Error(`Upload failed: ${uploadError.message}`);
      }
    }

    console.log('✅ Upload successful, getting public URL...');
    console.log('📤 Upload response:', uploadData);

    // Get the new public URL
    const { data: { publicUrl } } = supabase.storage
      .from('menu-images')
      .getPublicUrl(filePath);
      
    console.log('🔗 Generated public URL:', publicUrl);

    // Test if the URL is accessible
    try {
      const response = await fetch(publicUrl, { method: 'HEAD' });
      if (!response.ok) {
        console.warn('⚠️ Public URL might not be accessible yet:', response.status, response.statusText);
      } else {
        console.log('✅ Public URL is accessible');
      }
    } catch (error) {
      console.warn('⚠️ Could not verify public URL accessibility:', error);
    }

    // If there's an old image URL, delete it
    if (oldImageUrl) {
      try {
        // Extract the file path from the old URL
        const urlParts = oldImageUrl.split('/');
        const oldFilePath = urlParts.slice(-2).join('/'); // Get the last two parts (folder/filename)
        
        console.log('🗑️ Attempting to delete old image:', oldFilePath);
        
        // Delete the old file
        const { error: deleteError } = await supabase.storage
          .from('menu-images')
          .remove([oldFilePath]);
        
        if (deleteError) {
          console.warn('⚠️ Failed to delete old image:', deleteError);
          // Don't throw error here - the new image was uploaded successfully
        } else {
          console.log('✅ Successfully deleted old image:', oldFilePath);
        }
      } catch (error) {
        console.warn('⚠️ Error during old image cleanup:', error);
        // Don't throw error here - the new image was uploaded successfully
      }
    }

    return publicUrl;
  } catch (error) {
    console.error('❌ Error in uploadImageToStorage:', error);
    throw error;
  }
}

const AdminDashboard: React.FC = () => {
  const { user, signOut, isAdmin } = useAuth()
  const navigate = useNavigate()
  const [activeTab, setActiveTab] = useState('menu')
  const [menuItems, setMenuItems] = useState<MenuItem[]>([])
  const [categories, setCategories] = useState<Category[]>([])
  const [promos, setPromos] = useState<Promo[]>([])
  const [posters, setPosters] = useState<PromoPoster[]>([])
  const [loading, setLoading] = useState(true)
  const [showAddItem, setShowAddItem] = useState(false)
  const [showAddCategory, setShowAddCategory] = useState(false)
  const [showAddPromo, setShowAddPromo] = useState(false)
  const [showAddPoster, setShowAddPoster] = useState(false)
  const [editingItem, setEditingItem] = useState<MenuItem | null>(null)
  const [editingCategory, setEditingCategory] = useState<Category | null>(null)
  const [editingPromo, setEditingPromo] = useState<Promo | null>(null)
  const [editingPoster, setEditingPoster] = useState<PromoPoster | null>(null)
  const [dragSuccess, setDragSuccess] = useState(false)
  const [isUpdatingOrder, setIsUpdatingOrder] = useState(false)

  const sensors = useSensors(
    useSensor(PointerSensor),
    useSensor(KeyboardSensor, {
      coordinateGetter: sortableKeyboardCoordinates,
    })
  )

  useEffect(() => {
    if (!isAdmin) {
      navigate('/admin/login')
      return
    }
    loadData()
  }, [isAdmin, navigate])

  const loadData = async () => {
    try {
      setLoading(true)
      
      // Load categories
      const { data: categoriesData, error: categoriesError } = await supabase
        .from('categories')
        .select('*')
        .order('sort_order')
      
      if (categoriesError) throw categoriesError
      console.log('Loaded categories:', categoriesData)
      setCategories(categoriesData || [])

      // Load menu items (temporary fix for current database structure)
      const { data: menuData, error: menuError } = await supabase
        .from('menu_items')
        .select('*')
        .order('created_at')
      
      if (menuError) throw menuError
      console.log('Loaded menu items:', menuData)
      setMenuItems(menuData || [])

      // Load promos
      const { data: promosData, error: promosError } = await supabase
        .from('promos')
        .select('*')
        .order('created_at', { ascending: false })
      
      if (promosError) throw promosError
      console.log('Loaded promos:', promosData)
      setPromos(promosData || [])

      // Load posters
      const { data: postersData, error: postersError } = await supabase
        .from('promo_posters')
        .select('*')
        .order('created_at', { ascending: false })
      
      if (postersError) throw postersError
      console.log('Loaded posters:', postersData)
      setPosters(postersData || [])
    } catch (error) {
      console.error('Error loading data:', error)
    } finally {
      setLoading(false)
    }
  }

  const handleSignOut = async () => {
    await signOut()
    navigate('/admin/login')
  }

  const handleDragEnd = async (event: DragEndEvent) => {
    const { active, over } = event
    console.log('Drag end event:', { active: active.id, over: over?.id })

    if (active.id !== over?.id && !isUpdatingOrder) {
      setIsUpdatingOrder(true)
      
      const oldIndex = categories.findIndex(cat => cat.id === active.id)
      const newIndex = categories.findIndex(cat => cat.id === over?.id)
      
      console.log('Reordering categories:', { oldIndex, newIndex })

      const newCategories = arrayMove(categories, oldIndex, newIndex)
      setCategories(newCategories)

      // Add a small delay to prevent rapid updates
      await new Promise(resolve => setTimeout(resolve, 100))

      // Update sort_order in database - update all categories to ensure proper ordering
      try {
        // Create updates for all categories with new sort orders
        const updates = newCategories.map((category, index) => ({
          id: category.id,
          sort_order: index + 1,
        }))

        console.log('Updating all categories with new order:', updates)

        // Use a transaction-like approach by updating each category individually
        for (const update of updates) {
          const { error } = await supabase
            .from('categories')
            .update({ sort_order: update.sort_order })
            .eq('id', update.id)

          if (error) {
            console.error('Error updating category:', update.id, error)
            throw error
          }
        }
        
        console.log('Database update successful')
        // Show success feedback
        setDragSuccess(true)
        setTimeout(() => setDragSuccess(false), 2000)
      } catch (error) {
        console.error('Error updating category order:', error)
        // Revert to original order if update fails
        const { data: categoriesData, error: categoriesError } = await supabase
          .from('categories')
          .select('*')
          .order('sort_order')
        
        if (!categoriesError && categoriesData) {
          setCategories(categoriesData)
        }
      } finally {
        setIsUpdatingOrder(false)
      }
    }
  }

  const handleAddMenuItem = async (itemData: Omit<MenuItem, 'id' | 'created_at' | 'updated_at'> & { category_id: string }) => {
    try {
      // First, create the menu item with category_id
      const { data: newItem, error: itemError } = await supabase
        .from('menu_items')
        .insert([{
          name: itemData.name,
          description: itemData.description,
          price: itemData.price,
          image_url: itemData.image_url,
          category_id: itemData.category_id, // Set category_id directly
          dietary_tags: itemData.dietary_tags,
          is_popular: itemData.is_popular,
        }])
        .select()
      
      if (itemError) throw itemError
      
      // Then, try to create the category relationship (optional)
      if (newItem && newItem[0]) {
        try {
          const { error: relationError } = await supabase
            .from('menu_item_categories')
            .insert([{
              menu_item_id: newItem[0].id,
              category_id: itemData.category_id,
            }])
          
          if (relationError) {
            console.log('menu_item_categories table not available, using direct category_id field')
          }
        } catch (error) {
          console.log('menu_item_categories table not available, using direct category_id field')
        }
      }
      
      setShowAddItem(false)
      loadData()
    } catch (error) {
      console.error('Error adding menu item:', error)
    }
  }

  const handleAddCategory = async (categoryData: Omit<Category, 'id' | 'created_at' | 'sort_order'>) => {
    try {
      // Get the next sort order
      const nextSortOrder = categories.length + 1
      
      const { error } = await supabase
        .from('categories')
        .insert([{ ...categoryData, sort_order: nextSortOrder }])
      
      if (error) throw error
      
      setShowAddCategory(false)
      loadData()
    } catch (error) {
      console.error('Error adding category:', error)
    }
  }

  const handleDeleteMenuItem = async (id: string) => {
    if (!confirm('Are you sure you want to delete this menu item?')) return
    
    try {
      const { error } = await supabase
        .from('menu_items')
        .delete()
        .eq('id', id)
      
      if (error) throw error
      loadData()
    } catch (error) {
      console.error('Error deleting menu item:', error)
    }
  }

  const handleDeleteCategory = async (id: string) => {
    if (!confirm('Are you sure you want to delete this category? This will also delete all menu items in this category.')) return
    
    try {
      const { error } = await supabase
        .from('categories')
        .delete()
        .eq('id', id)
      
      if (error) throw error
      loadData()
    } catch (error) {
      console.error('Error deleting category:', error)
    }
  }

  const handleEditMenuItem = async (itemData: MenuItem & { category_id?: string }) => {
    try {
      const { error } = await supabase
        .from('menu_items')
        .update({
          name: itemData.name,
          description: itemData.description,
          price: itemData.price,
          image_url: itemData.image_url,
          dietary_tags: itemData.dietary_tags,
          is_popular: itemData.is_popular,
        })
        .eq('id', itemData.id)
      
      if (error) throw error
      
      // Update category relationship if category_id is provided
      if (itemData.category_id) {
        try {
          // First, remove existing relationships
          await supabase
            .from('menu_item_categories')
            .delete()
            .eq('menu_item_id', itemData.id)
          
          // Then, add the new relationship
          await supabase
            .from('menu_item_categories')
            .insert([{
              menu_item_id: itemData.id,
              category_id: itemData.category_id,
            }])
        } catch (error) {
          console.log('menu_item_categories table not available, using direct category_id update')
          // If the table doesn't exist, we'll rely on the direct category_id field
        }
      }
      
      setEditingItem(null)
      loadData()
    } catch (error) {
      console.error('Error updating menu item:', error)
    }
  }

  const handleEditCategory = async (categoryData: Category) => {
    try {
      const { error } = await supabase
        .from('categories')
        .update({
          name: categoryData.name,
          icon: categoryData.icon,
          gradient: 'from-primary to-pink-500', // Default gradient for all categories
        })
        .eq('id', categoryData.id)
      
      if (error) throw error
      
      setEditingCategory(null)
      loadData()
    } catch (error) {
      console.error('Error updating category:', error)
    }
  }

  const handleAddPromo = async (promoData: Omit<Promo, 'id' | 'created_at' | 'updated_at' | 'current_uses'>) => {
    try {
      console.log('Adding promo with data:', promoData)
      
      // Validate required fields
      if (!promoData.name || !promoData.description || !promoData.start_date || !promoData.end_date) {
        console.error('Missing required fields:', promoData)
        alert('Please fill in all required fields')
        return
      }

      // Convert dates to ISO string format
      const formattedData = {
        ...promoData,
        start_date: new Date(promoData.start_date).toISOString(),
        end_date: new Date(promoData.end_date).toISOString(),
        current_uses: 0,
        category_ids: promoData.category_ids || [],
        item_ids: promoData.item_ids || [],
      }

      console.log('Formatted promo data:', formattedData)

      const { data, error } = await supabase
        .from('promos')
        .insert([formattedData])
        .select()
      
      if (error) {
        console.error('Supabase error:', error)
        alert(`Error adding promo: ${error.message}`)
        throw error
      }
      
      console.log('Promo added successfully:', data)
      setShowAddPromo(false)
      loadData()
    } catch (error) {
      console.error('Error adding promo:', error)
      alert(`Error adding promo: ${error instanceof Error ? error.message : 'Unknown error'}`)
    }
  }

  const handleDeletePromo = async (id: string) => {
    if (!confirm('Are you sure you want to delete this promotion?')) return
    
    try {
      const { error } = await supabase
        .from('promos')
        .delete()
        .eq('id', id)
      
      if (error) throw error
      loadData()
    } catch (error) {
      console.error('Error deleting promo:', error)
    }
  }

  const handleEditPromo = async (promoData: Promo) => {
    try {
      const { error } = await supabase
        .from('promos')
        .update({
          name: promoData.name,
          description: promoData.description,
          discount_type: promoData.discount_type,
          discount_value: promoData.discount_value,
          start_date: promoData.start_date,
          end_date: promoData.end_date,
          is_active: promoData.is_active,
          applies_to: promoData.applies_to,
          category_ids: promoData.category_ids,
          item_ids: promoData.item_ids,
          promo_code: promoData.promo_code,
          max_uses: promoData.max_uses,
        })
        .eq('id', promoData.id)
      
      if (error) throw error
      
      setEditingPromo(null)
      loadData()
    } catch (error) {
      console.error('Error updating promo:', error)
    }
  }

  const handleAddPoster = async (posterData: Omit<PromoPoster, 'id' | 'created_at' | 'updated_at'>) => {
    try {
      console.log('Adding poster with data:', posterData)
      
      // Validate required fields (dates are optional for announcements)
      if (!posterData.title || !posterData.image_url) {
        console.error('Missing required fields:', posterData)
        alert('Please fill in title and image URL')
        return
      }

      // Prepare data - dates are optional
      const formattedData = {
        ...posterData,
        start_date: posterData.start_date ? new Date(posterData.start_date).toISOString() : null,
        end_date: posterData.end_date ? new Date(posterData.end_date).toISOString() : null,
      }

      console.log('Formatted poster data:', formattedData)

      const { data, error } = await supabase
        .from('promo_posters')
        .insert([formattedData])
        .select()
      
      if (error) {
        console.error('Supabase error:', error)
        alert(`Error adding poster: ${error.message}`)
        throw error
      }
      
      console.log('Poster added successfully:', data)
      setShowAddPoster(false)
      loadData()
    } catch (error) {
      console.error('Error adding poster:', error)
      alert(`Error adding poster: ${error instanceof Error ? error.message : 'Unknown error'}`)
    }
  }

  const handleDeletePoster = async (id: string) => {
    if (!confirm('Are you sure you want to delete this poster?')) return
    
    try {
      // First, get the poster data to find the image URL
      const { data: poster, error: fetchError } = await supabase
        .from('promo_posters')
        .select('image_url')
        .eq('id', id)
        .single()
      
      if (fetchError) {
        console.error('Error fetching poster data:', fetchError)
        throw fetchError
      }
      
      // Delete the poster from database
      const { error: deleteError } = await supabase
        .from('promo_posters')
        .delete()
        .eq('id', id)
      
      if (deleteError) throw deleteError
      
      // Delete the image from storage if it exists
      if (poster?.image_url) {
        try {
          // Extract the file path from the image URL
          const urlParts = poster.image_url.split('/')
          const filePath = urlParts.slice(-2).join('/') // Get the last two parts (folder/filename)
          
          console.log('🗑️ Attempting to delete poster image:', filePath)
          
          // Delete the image file
          const { error: imageDeleteError } = await supabase.storage
            .from('menu-images')
            .remove([filePath])
          
          if (imageDeleteError) {
            console.warn('⚠️ Failed to delete poster image:', imageDeleteError)
            // Don't throw error here - the poster was deleted successfully
          } else {
            console.log('✅ Successfully deleted poster image:', filePath)
          }
        } catch (imageError) {
          console.warn('⚠️ Error during poster image cleanup:', imageError)
          // Don't throw error here - the poster was deleted successfully
        }
      }
      
      loadData()
    } catch (error) {
      console.error('Error deleting poster:', error)
    }
  }

  const handleEditPoster = async (posterData: PromoPoster) => {
    try {
      const { error } = await supabase
        .from('promo_posters')
        .update({
          title: posterData.title,
          description: posterData.description,
          image_url: posterData.image_url,
          start_date: posterData.start_date,
          end_date: posterData.end_date,
          is_active: posterData.is_active,
        })
        .eq('id', posterData.id)
      
      if (error) throw error
      
      setEditingPoster(null)
      loadData()
    } catch (error) {
      console.error('Error updating poster:', error)
    }
  }

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="w-8 h-8 border-4 border-primary border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
          <p className="text-gray-600">Loading dashboard...</p>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <header className="bg-white shadow-sm border-b border-gray-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center py-4">
            <div className="flex items-center space-x-2 sm:space-x-4">
              {/* Mobile: Stacked logo, Desktop: Horizontal logo */}
              <img 
                src={howdyLogoStacked}
                alt="Howdy Cafe Logo" 
                className="h-8 sm:h-12 w-auto sm:hidden"
              />
              <img 
                src={howdyLogo}
                alt="Howdy Cafe Logo" 
                className="h-8 sm:h-12 w-auto hidden sm:block"
              />
              <div className="min-w-0 flex-1">
                <h1 className="text-lg sm:text-2xl font-bold text-gray-900 truncate">Admin Dashboard</h1>
                <p className="text-xs sm:text-sm text-gray-600 truncate">Welcome back, {user?.email}</p>
              </div>
            </div>
            <button
              onClick={handleSignOut}
              className="flex items-center space-x-1 sm:space-x-2 px-2 sm:px-4 py-2 text-gray-600 hover:text-gray-900 transition-colors"
            >
              <LogOut className="w-4 h-4" />
              <span className="hidden sm:inline">Sign Out</span>
            </button>
          </div>
        </div>
      </header>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Navigation Tabs */}
        <div className="flex flex-wrap sm:flex-nowrap space-x-1 bg-white rounded-xl p-1 shadow-sm mb-8 overflow-x-auto">
          {[
            { id: 'menu', label: 'Menu Items', icon: MenuIcon },
            { id: 'categories', label: 'Categories', icon: Settings },
            { id: 'promos', label: 'Promotions', icon: Settings },
            { id: 'posters', label: 'Posters', icon: Settings },
          ].map((tab) => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              className={`flex items-center space-x-1 sm:space-x-2 px-2 sm:px-4 py-2 rounded-lg font-medium transition-all whitespace-nowrap flex-shrink-0 ${
                activeTab === tab.id
                  ? 'bg-primary text-white shadow-sm'
                  : 'text-gray-600 hover:text-gray-900'
              }`}
            >
              <tab.icon className="w-4 h-4" />
              <span className="text-sm sm:text-base">{tab.label}</span>
            </button>
          ))}
        </div>

        {/* Content */}
        <div className="bg-white rounded-2xl shadow-sm border border-gray-200">
          {activeTab === 'menu' && (
            <div className="p-4 sm:p-6">
              <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-6 space-y-2 sm:space-y-0">
                <h2 className="text-lg sm:text-xl font-semibold text-gray-900">Menu Items</h2>
                <div className="flex space-x-2">
                  <button
                    onClick={async () => {
                      console.log('🧪 Running storage test...');
                      const result = await testStorageConnection();
                      if (result) {
                        alert('✅ Storage test passed! Check console for details.');
                      } else {
                        alert('❌ Storage test failed! Check console for details.');
                      }
                    }}
                    className="flex items-center space-x-2 px-3 sm:px-4 py-2 bg-gray-600 text-white rounded-lg hover:bg-gray-700 transition-colors text-sm sm:text-base"
                  >
                    <Settings className="w-4 h-4" />
                    <span>Test Storage</span>
                  </button>
                  <button
                    onClick={() => setShowAddItem(true)}
                    className="flex items-center space-x-2 px-3 sm:px-4 py-2 bg-primary text-white rounded-lg hover:bg-primary/90 transition-colors text-sm sm:text-base"
                  >
                    <Plus className="w-4 h-4" />
                    <span>Add Item</span>
                  </button>
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-6">
                {menuItems.map((item) => (
                  <motion.div
                    key={item.id}
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="bg-white border border-gray-200 rounded-2xl overflow-hidden hover:shadow-lg transition-all duration-200 hover:scale-[1.02]"
                  >
                    <div className="relative">
                      <img
                        src={item.image_url}
                        alt={item.name}
                        className="w-full h-48 object-cover"
                      />
                      {item.is_popular && (
                        <div className="absolute top-3 left-3 bg-gradient-to-r from-primary to-pink-500 text-white px-2 py-1 rounded-full text-xs font-semibold">
                          Popular
                        </div>
                      )}
                      <div className="absolute top-3 right-3 flex space-x-1">
                        <button 
                          onClick={() => setEditingItem(item)}
                          className="p-2 bg-white/90 backdrop-blur-sm rounded-lg text-gray-600 hover:text-primary transition-colors hover:bg-white"
                        >
                          <Edit className="w-4 h-4" />
                        </button>
                        <button
                          onClick={() => handleDeleteMenuItem(item.id)}
                          className="p-2 bg-white/90 backdrop-blur-sm rounded-lg text-gray-600 hover:text-red-600 transition-colors hover:bg-white"
                        >
                          <Trash2 className="w-4 h-4" />
                        </button>
                      </div>
                    </div>
                    <div className="p-4 sm:p-6">
                      <div className="flex items-start justify-between mb-3">
                        <h3 className="font-bold text-base sm:text-lg text-gray-900 line-clamp-1">{item.name}</h3>
                        <span className="text-base sm:text-lg font-bold text-primary">${item.price}</span>
                      </div>
                      <p className="text-gray-600 text-xs sm:text-sm line-clamp-2 mb-4">{item.description}</p>
                      {item.dietary_tags && item.dietary_tags.length > 0 && (
                        <div className="flex flex-wrap gap-1">
                          {item.dietary_tags.slice(0, 3).map((tag, index) => (
                            <span
                              key={index}
                              className="px-2 py-1 bg-gray-100 text-gray-600 text-xs rounded-full"
                            >
                              {tag}
                            </span>
                          ))}
                          {item.dietary_tags.length > 3 && (
                            <span className="px-2 py-1 bg-gray-100 text-gray-600 text-xs rounded-full">
                              +{item.dietary_tags.length - 3}
                            </span>
                          )}
                        </div>
                      )}
                    </div>
                  </motion.div>
                ))}
              </div>
            </div>
          )}

          {activeTab === 'categories' && (
            <div className="p-4 sm:p-6">
              <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-6 space-y-2 sm:space-y-0">
                <div className="flex items-center space-x-2 sm:space-x-4">
                  <h2 className="text-lg sm:text-xl font-semibold text-gray-900">Categories</h2>
                  {isUpdatingOrder && (
                    <div className="flex items-center space-x-2 px-2 sm:px-3 py-1 bg-blue-100 text-blue-700 rounded-lg text-xs sm:text-sm">
                      <div className="w-3 h-3 sm:w-4 sm:h-4 border-2 border-blue-500 border-t-transparent rounded-full animate-spin"></div>
                      <span>Updating order...</span>
                    </div>
                  )}
                  {dragSuccess && (
                    <div className="flex items-center space-x-2 px-2 sm:px-3 py-1 bg-green-100 text-green-700 rounded-lg text-xs sm:text-sm">
                      <div className="w-2 h-2 bg-green-500 rounded-full"></div>
                      <span>Order updated successfully!</span>
                    </div>
                  )}
                </div>
                <button
                  onClick={() => setShowAddCategory(true)}
                  className="flex items-center space-x-2 px-3 sm:px-4 py-2 bg-primary text-white rounded-lg hover:bg-primary/90 transition-colors text-sm sm:text-base"
                >
                  <Plus className="w-4 h-4" />
                  <span>Add Category</span>
                </button>
              </div>

              <DndContext
                sensors={sensors}
                collisionDetection={closestCenter}
                onDragEnd={handleDragEnd}
              >
                <SortableContext
                  items={categories.map(category => category.id)}
                  strategy={verticalListSortingStrategy}
                >
                  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-6">
                    {categories.map((category) => (
                      <SortableCategoryItem
                        key={category.id}
                        category={category}
                        onEdit={setEditingCategory}
                        onDelete={handleDeleteCategory}
                      />
                    ))}
                  </div>
                </SortableContext>
              </DndContext>
            </div>
          )}

          {activeTab === 'promos' && (
            <div className="p-4 sm:p-6">
              <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-6 space-y-2 sm:space-y-0">
                <h2 className="text-lg sm:text-xl font-semibold text-gray-900">Promotions</h2>
                <button
                  onClick={() => setShowAddPromo(true)}
                  className="flex items-center space-x-2 px-3 sm:px-4 py-2 bg-primary text-white rounded-lg hover:bg-primary/90 transition-colors text-sm sm:text-base"
                >
                  <Plus className="w-4 h-4" />
                  <span>Add Promotion</span>
                </button>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-6">
                {promos.map((promo) => (
                  <motion.div
                    key={promo.id}
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="bg-white border border-gray-200 rounded-2xl overflow-hidden hover:shadow-lg transition-all duration-200 hover:scale-[1.02]"
                  >
                    <div className="relative">
                      <div className="h-32 bg-gradient-to-r from-red-500 to-pink-500 flex items-center justify-center">
                        <div className="text-4xl">🎉</div>
                      </div>
                      <div className="absolute top-3 right-3 flex space-x-1">
                        <button 
                          onClick={() => setEditingPromo(promo)}
                          className="p-2 bg-white/90 backdrop-blur-sm rounded-lg text-gray-600 hover:text-primary transition-colors hover:bg-white"
                        >
                          <Edit className="w-4 h-4" />
                        </button>
                        <button
                          onClick={() => handleDeletePromo(promo.id)}
                          className="p-2 bg-white/90 backdrop-blur-sm rounded-lg text-gray-600 hover:text-red-600 transition-colors hover:bg-white"
                        >
                          <Trash2 className="w-4 h-4" />
                        </button>
                      </div>
                      <div className="absolute top-3 left-3">
                        <span className={`px-2 py-1 rounded-full text-xs font-bold ${
                          promo.is_active ? 'bg-green-500 text-white' : 'bg-gray-500 text-white'
                        }`}>
                          {promo.is_active ? 'Active' : 'Inactive'}
                        </span>
                      </div>
                    </div>
                    <div className="p-4 sm:p-6">
                      <h3 className="font-bold text-base sm:text-lg text-gray-900 mb-2">{promo.name}</h3>
                      <p className="text-gray-600 text-xs sm:text-sm mb-4">{promo.description}</p>
                      
                      <div className="space-y-2 mb-4">
                        <div className="flex justify-between text-xs sm:text-sm">
                          <span className="text-gray-600">Discount:</span>
                          <span className="font-semibold">
                            {promo.discount_type === 'percentage' ? `${promo.discount_value}%` : `$${promo.discount_value}`}
                          </span>
                        </div>
                        <div className="flex justify-between text-xs sm:text-sm">
                          <span className="text-gray-600">Valid until:</span>
                          <span className="font-semibold">
                            {new Date(promo.end_date).toLocaleDateString()}
                          </span>
                        </div>
                        <div className="flex justify-between text-xs sm:text-sm">
                          <span className="text-gray-600">Usage:</span>
                          <span className="font-semibold">
                            {promo.current_uses} / {promo.max_uses || '∞'}
                          </span>
                        </div>
                      </div>

                      {promo.promo_code && (
                        <div className="bg-gray-50 rounded-lg p-2 sm:p-3 mb-4">
                          <div className="text-xs sm:text-sm text-gray-600 mb-1">Promo Code:</div>
                          <div className="font-mono font-bold text-sm sm:text-lg">{promo.promo_code}</div>
                        </div>
                      )}
                    </div>
                  </motion.div>
                ))}
              </div>
            </div>
          )}

          {activeTab === 'posters' && (
            <div className="p-4 sm:p-6">
              <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-6 space-y-2 sm:space-y-0">
                <h2 className="text-lg sm:text-xl font-semibold text-gray-900">Promotional Posters</h2>
                <button
                  onClick={() => setShowAddPoster(true)}
                  className="flex items-center space-x-2 px-3 sm:px-4 py-2 bg-primary text-white rounded-lg hover:bg-primary/90 transition-colors text-sm sm:text-base"
                >
                  <Plus className="w-4 h-4" />
                  <span>Add Poster</span>
                </button>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-6">
                {posters.map((poster) => (
                  <motion.div
                    key={poster.id}
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="bg-white border border-gray-200 rounded-2xl overflow-hidden hover:shadow-lg transition-all duration-200 hover:scale-[1.02]"
                  >
                    <div className="relative">
                      <img
                        src={poster.image_url}
                        alt={poster.title}
                        className="w-full h-48 object-cover"
                      />
                      <div className="absolute top-3 right-3 flex space-x-1">
                        <button 
                          onClick={() => setEditingPoster(poster)}
                          className="p-2 bg-white/90 backdrop-blur-sm rounded-lg text-gray-600 hover:text-primary transition-colors hover:bg-white"
                        >
                          <Edit className="w-4 h-4" />
                        </button>
                        <button
                          onClick={() => handleDeletePoster(poster.id)}
                          className="p-2 bg-white/90 backdrop-blur-sm rounded-lg text-gray-600 hover:text-red-600 transition-colors hover:bg-white"
                        >
                          <Trash2 className="w-4 h-4" />
                        </button>
                      </div>
                      <div className="absolute top-3 left-3">
                        <span className={`px-2 py-1 rounded-full text-xs font-bold ${
                          poster.is_active ? 'bg-green-500 text-white' : 'bg-gray-500 text-white'
                        }`}>
                          {poster.is_active ? 'Active' : 'Inactive'}
                        </span>
                      </div>
                    </div>
                    <div className="p-4 sm:p-6">
                      <h3 className="font-bold text-base sm:text-lg text-gray-900 mb-2">{poster.title}</h3>
                      {poster.description && (
                        <p className="text-gray-600 text-xs sm:text-sm mb-4">{poster.description}</p>
                      )}
                      
                      <div className="space-y-2 mb-4">
                        <div className="flex justify-between text-xs sm:text-sm">
                          <span className="text-gray-600">Start Date:</span>
                          <span className="font-semibold">
                            {poster.start_date ? new Date(poster.start_date).toLocaleDateString() : 'No start date'}
                          </span>
                        </div>
                        <div className="flex justify-between text-xs sm:text-sm">
                          <span className="text-gray-600">End Date:</span>
                          <span className="font-semibold">
                            {poster.end_date ? new Date(poster.end_date).toLocaleDateString() : 'No end date'}
                          </span>
                        </div>
                      </div>

                      {/* Status indicator */}
                      <div className="text-xs text-gray-500">
                        {!poster.start_date && !poster.end_date ? (
                          <span className="text-purple-600">Announcement</span>
                        ) : poster.start_date && new Date() < new Date(poster.start_date) ? (
                          <span className="text-blue-600">Scheduled</span>
                        ) : poster.end_date && new Date() > new Date(poster.end_date) ? (
                          <span className="text-red-600">Expired</span>
                        ) : (
                          <span className="text-green-600">Currently Active</span>
                        )}
                      </div>
                    </div>
                  </motion.div>
                ))}
              </div>
            </div>
          )}


        </div>
      </div>

      {/* Add Menu Item Modal */}
      {showAddItem && (
        <AddMenuItemModal
          categories={categories}
          onClose={() => setShowAddItem(false)}
          onSubmit={handleAddMenuItem}
        />
      )}

      {/* Add Category Modal */}
      {showAddCategory && (
        <AddCategoryModal
          onClose={() => setShowAddCategory(false)}
          onSubmit={handleAddCategory}
        />
      )}

      {/* Edit Menu Item Modal */}
      {editingItem && (
        <EditMenuItemModal
          item={editingItem}
          categories={categories}
          onClose={() => setEditingItem(null)}
          onSubmit={handleEditMenuItem}
        />
      )}

      {/* Edit Category Modal */}
      {editingCategory && (
        <EditCategoryModal
          category={editingCategory}
          onClose={() => setEditingCategory(null)}
          onSubmit={handleEditCategory}
        />
      )}

      {/* Add Promo Modal */}
      {showAddPromo && (
        <AddPromoModal
          categories={categories}
          menuItems={menuItems}
          onClose={() => setShowAddPromo(false)}
          onSubmit={handleAddPromo}
        />
      )}

      {/* Edit Promo Modal */}
      {editingPromo && (
        <EditPromoModal
          promo={editingPromo}
          categories={categories}
          menuItems={menuItems}
          onClose={() => setEditingPromo(null)}
          onSubmit={handleEditPromo}
        />
      )}

      {/* Add Poster Modal */}
      {showAddPoster && (
        <AddPosterModal
          onClose={() => setShowAddPoster(false)}
          onSubmit={handleAddPoster}
        />
      )}

      {/* Edit Poster Modal */}
      {editingPoster && (
        <EditPosterModal
          poster={editingPoster}
          onClose={() => setEditingPoster(null)}
          onSubmit={handleEditPoster}
        />
      )}
    </div>
  )
}

// Add Menu Item Modal Component
interface AddMenuItemModalProps {
  categories: Category[]
  onClose: () => void
  onSubmit: (data: Omit<MenuItem, 'id' | 'created_at' | 'updated_at'> & { category_id: string }) => Promise<void>
}

const AddMenuItemModal: React.FC<AddMenuItemModalProps> = ({ categories, onClose, onSubmit }) => {
  const [formData, setFormData] = useState({
    name: '',
    description: '',
    price: '',
    image_url: '',
    category_id: '',
    dietary_tags: [] as string[],
    is_popular: false,
  })
  const [imageFile, setImageFile] = useState<File | null>(null)
  const [uploading, setUploading] = useState(false)
  const [newTag, setNewTag] = useState('')

  const availableTags = [
    'halal', '🌱', '🌶️', '🥛', '🐟', '🥜', '🌾', '🥚', '🦐', '🍄'
  ]

  const tagLabels: { [key: string]: string } = {
    'halal': 'Halal Certified',
    '🌱': 'Vegetarian',
    '🌶️': 'Spicy',
    '🥛': 'Contains Dairy',
    '🐟': 'Contains Fish',
    '🥜': 'Contains Nuts',
    '🌾': 'Gluten Free',
    '🥚': 'Contains Eggs',
    '🦐': 'Contains Shellfish',
    '🍄': 'Contains Mushrooms'
  }

  const handleImageUpload = async (file: File): Promise<string> => {
    return uploadImageToStorage(file, 'menu-items')
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setUploading(true)
    
    try {
      let finalImageUrl = formData.image_url
      
      if (imageFile) {
        console.log('🖼️ Starting image upload for file:', imageFile.name, 'Size:', imageFile.size);
        try {
          finalImageUrl = await uploadImageToStorage(imageFile, 'menu-items')
          console.log('✅ Image upload completed, URL:', finalImageUrl);
        } catch (uploadError) {
          console.error('❌ Image upload failed:', uploadError);
          const errorMessage = uploadError instanceof Error ? uploadError.message : 'Unknown upload error';
          alert(`Image upload failed: ${errorMessage}\n\nPlease check:\n- File size (max 5MB)\n- File format (JPEG, PNG, WebP, GIF)\n- Your internet connection\n- Supabase storage configuration`);
          setUploading(false);
          return;
        }
      }
      
      console.log('💾 Saving menu item with image URL:', finalImageUrl);
      await onSubmit({
        ...formData,
        price: parseFloat(formData.price),
        image_url: finalImageUrl,
      })
    } catch (error) {
      console.error('Error saving menu item:', error)
      const errorMessage = error instanceof Error ? error.message : 'Unknown error';
      alert(`Error saving menu item: ${errorMessage}`)
    } finally {
      setUploading(false)
    }
  }

  return (
    <div className="fixed inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center p-4 z-50 overflow-y-auto">
      <motion.div
        initial={{ opacity: 0, scale: 0.95, y: 20 }}
        animate={{ opacity: 1, scale: 1, y: 0 }}
        exit={{ opacity: 0, scale: 0.95, y: 20 }}
        className="bg-white rounded-3xl shadow-2xl w-full max-w-2xl mx-auto my-8 overflow-hidden border border-gray-100"
      >
        <div className="bg-gradient-to-r from-primary to-pink-500 p-6 text-white relative">
          <button
            onClick={onClose}
            className="absolute top-4 right-4 text-white/80 hover:text-white transition-colors"
          >
            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
          <h3 className="text-2xl font-bold">Add Menu Item</h3>
          <p className="text-white/80 text-sm mt-1">Create a new menu item for your restaurant</p>
        </div>
        <div className="p-8 max-h-[80vh] overflow-y-auto">
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label htmlFor="item-name" className="block text-sm font-medium text-gray-700 mb-1">
              Item Name *
            </label>
            <input
              id="item-name"
              type="text"
              placeholder="Enter item name"
              value={formData.name}
              onChange={(e) => setFormData({ ...formData, name: e.target.value })}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent"
              required
            />
          </div>
          
          <div>
            <label htmlFor="item-description" className="block text-sm font-medium text-gray-700 mb-1">
              Description *
            </label>
            <textarea
              id="item-description"
              placeholder="Enter item description"
              value={formData.description}
              onChange={(e) => setFormData({ ...formData, description: e.target.value })}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent"
              rows={3}
              required
            />
          </div>
          
          <div>
            <label htmlFor="item-price" className="block text-sm font-medium text-gray-700 mb-1">
              Price (CAD) *
            </label>
            <input
              id="item-price"
              type="number"
              step="0.01"
              min="0"
              placeholder="0.00"
              value={formData.price}
              onChange={(e) => setFormData({ ...formData, price: e.target.value })}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent"
              required
            />
          </div>
          
          <div>
            <label htmlFor="item-category" className="block text-sm font-medium text-gray-700 mb-1">
              Category *
            </label>
            <select
              id="item-category"
              value={formData.category_id}
              onChange={(e) => setFormData({ ...formData, category_id: e.target.value })}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent"
              required
            >
              <option value="">Select a category</option>
              {categories.map((category) => (
                <option key={category.id} value={category.id}>
                  {category.name}
                </option>
              ))}
            </select>
          </div>
          
          <div>
            <label htmlFor="item-image" className="block text-sm font-medium text-gray-700 mb-1">
              Item Image *
            </label>
            <div className="space-y-2">
              <input
                id="item-image"
                type="file"
                accept="image/*"
                onChange={(e) => setImageFile(e.target.files?.[0] || null)}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent"
              />
              <p className="text-xs text-gray-500">Upload an image or use URL below</p>
              <input
                type="url"
                placeholder="Or enter image URL"
                value={formData.image_url}
                onChange={(e) => setFormData({ ...formData, image_url: e.target.value })}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent"
              />
            </div>
          </div>
          
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Dietary Tags
            </label>
            <div className="space-y-3">
              <div className="flex flex-wrap gap-2">
                {availableTags.map((tag) => (
                  <button
                    key={tag}
                    type="button"
                    onClick={() => {
                      const newTags = formData.dietary_tags.includes(tag)
                        ? formData.dietary_tags.filter(t => t !== tag)
                        : [...formData.dietary_tags, tag]
                      setFormData({ ...formData, dietary_tags: newTags })
                    }}
                    className={`px-3 py-1 rounded-full text-sm font-medium transition-colors ${
                      formData.dietary_tags.includes(tag)
                        ? 'bg-primary text-white'
                        : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                    }`}
                  >
                    {tag} {tagLabels[tag]}
                  </button>
                ))}
              </div>
              <div className="flex items-center space-x-2">
                <input
                  type="text"
                  placeholder="Add custom tag"
                  value={newTag}
                  onChange={(e) => setNewTag(e.target.value)}
                  className="flex-1 px-3 py-2 border border-gray-300 rounded-lg text-sm focus:ring-2 focus:ring-primary focus:border-transparent"
                />
                <button
                  type="button"
                  onClick={() => {
                    if (newTag.trim() && !formData.dietary_tags.includes(newTag.trim())) {
                      setFormData({
                        ...formData,
                        dietary_tags: [...formData.dietary_tags, newTag.trim()]
                      })
                      setNewTag('')
                    }
                  }}
                  className="px-4 py-2 bg-gray-600 text-white rounded-lg text-sm hover:bg-gray-700"
                >
                  Add
                </button>
              </div>
            </div>
          </div>
          
          <div className="flex items-center space-x-2">
            <input
              type="checkbox"
              id="is_popular"
              checked={formData.is_popular}
              onChange={(e) => setFormData({ ...formData, is_popular: e.target.checked })}
              className="rounded focus:ring-2 focus:ring-primary"
            />
            <label htmlFor="is_popular" className="text-sm text-gray-700">
              Mark as popular item
            </label>
          </div>
          
          <div className="flex space-x-2">
            <button
              type="submit"
              disabled={uploading}
              className="flex-1 px-4 py-2 bg-primary text-white rounded-lg hover:bg-primary/90 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {uploading ? 'Uploading...' : 'Add Item'}
            </button>
            <button
              type="button"
              onClick={onClose}
              className="flex-1 px-4 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50"
            >
              Cancel
            </button>
          </div>
        </form>
        </div>
      </motion.div>
    </div>
  )
}

// Add Category Modal Component
interface AddCategoryModalProps {
  onClose: () => void
  onSubmit: (data: Omit<Category, 'id' | 'created_at' | 'sort_order'>) => Promise<void>
}

const AddCategoryModal: React.FC<AddCategoryModalProps> = ({ onClose, onSubmit }) => {
  const [formData, setFormData] = useState({
    name: '',
    icon: '',
  })

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    await onSubmit({
      ...formData,
      gradient: 'from-primary to-pink-500', // Default gradient for all categories
    })
  }

  return (
    <div className="fixed inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center p-4 z-50 overflow-y-auto">
      <motion.div
        initial={{ opacity: 0, scale: 0.95, y: 20 }}
        animate={{ opacity: 1, scale: 1, y: 0 }}
        exit={{ opacity: 0, scale: 0.95, y: 20 }}
        className="bg-white rounded-3xl shadow-2xl w-full max-w-3xl mx-auto my-8 overflow-hidden border border-gray-100"
      >
        <div className="bg-gradient-to-r from-primary to-pink-500 p-6 text-white relative">
          <button
            onClick={onClose}
            className="absolute top-4 right-4 text-white/80 hover:text-white transition-colors"
          >
            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
          <h3 className="text-2xl font-bold">Add Category</h3>
          <p className="text-white/80 text-sm mt-1">Create a new menu category</p>
        </div>
        <div className="p-8 max-h-[80vh] overflow-y-auto">
        <form onSubmit={handleSubmit} className="space-y-6">
          <div>
            <label htmlFor="category-name" className="block text-sm font-medium text-gray-700 mb-1">
              Category Name *
            </label>
            <input
              id="category-name"
              type="text"
              placeholder="Enter category name"
              value={formData.name}
              onChange={(e) => setFormData({ ...formData, name: e.target.value })}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent"
              required
            />
          </div>
          
          <div>
            <label htmlFor="category-icon" className="block text-sm font-medium text-gray-700 mb-1">
              Icon (Emoji) *
            </label>
            <div className="flex space-x-2">
              <input
                id="category-icon"
                type="text"
                placeholder="🍽️"
                value={formData.icon}
                onChange={(e) => setFormData({ ...formData, icon: e.target.value })}
                className="flex-1 px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent"
                required
              />
              <EmojiPicker onSelect={(emoji) => setFormData({ ...formData, icon: emoji })} />
            </div>
            <p className="text-xs text-gray-500 mt-1">Choose an emoji that represents this category</p>
          </div>

          {/* Preview Section */}
          <div className="border-t pt-6">
            <h4 className="text-lg font-semibold text-gray-900 mb-4">Category Preview</h4>
            <div className="bg-gray-50 rounded-xl p-6">
              <div className="flex items-center space-x-4">
                <div className="w-16 h-16 bg-gradient-to-r from-primary to-pink-500 rounded-xl flex items-center justify-center text-white text-2xl">
                  {formData.icon || '🍽️'}
                </div>
                <div>
                  <h5 className="font-bold text-lg text-gray-900">
                    {formData.name || 'Category Name'}
                  </h5>
                  <p className="text-sm text-gray-600">
                    {formData.name ? 'This is how your category will appear' : 'Enter a name to see preview'}
                  </p>
                </div>
              </div>
            </div>
          </div>

          {/* Tips Section */}
          <div className="bg-blue-50 border border-blue-200 rounded-xl p-4">
            <h4 className="font-semibold text-blue-900 mb-2">💡 Tips for creating categories:</h4>
            <ul className="text-sm text-blue-800 space-y-1">
              <li>• Use clear, descriptive names (e.g., "Main Dishes" instead of "Food")</li>
              <li>• Choose relevant emojis that customers will recognize</li>
              <li>• Consider how items will be organized on your menu</li>
              <li>• You can reorder categories later by dragging them</li>
            </ul>
          </div>
          
          <div className="flex space-x-2">
            <button
              type="submit"
              className="flex-1 px-4 py-2 bg-primary text-white rounded-lg hover:bg-primary/90"
            >
              Add Category
            </button>
            <button
              type="button"
              onClick={onClose}
              className="flex-1 px-4 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50"
            >
              Cancel
            </button>
          </div>
        </form>
        </div>
      </motion.div>
    </div>
  )
}

// Edit Menu Item Modal Component
interface EditMenuItemModalProps {
  item: MenuItem
  categories: Category[]
  onClose: () => void
  onSubmit: (data: MenuItem) => Promise<void>
}

const EditMenuItemModal: React.FC<EditMenuItemModalProps> = ({ item, categories, onClose, onSubmit }) => {
  const [formData, setFormData] = useState({
    name: item.name,
    description: item.description,
    price: item.price.toString(),
    image_url: item.image_url,
    selectedCategories: [] as string[], // Multiple categories
    dietary_tags: item.dietary_tags,
    is_popular: item.is_popular,
  })


  // Load the categories this item belongs to
  useEffect(() => {
    const loadItemCategories = async () => {
      try {
        // Try to load from menu_item_categories table first
        const { data, error } = await supabase
          .from('menu_item_categories')
          .select('category_id')
          .eq('menu_item_id', item.id)
        
        if (error) {
          // If table doesn't exist, fallback to current database structure
          if (item.category_id) {
            setFormData(prev => ({ ...prev, selectedCategories: [item.category_id!] }))
          }
          return
        }
        
        const categoryIds = data?.map(relation => relation.category_id).filter((id): id is string => Boolean(id)) || []
        setFormData(prev => ({ ...prev, selectedCategories: categoryIds }))
      } catch (error) {
        console.error('Error loading item categories:', error)
        // Fallback to current database structure
        if (item.category_id) {
          setFormData(prev => ({ ...prev, selectedCategories: [item.category_id!] }))
        }
      }
    }

    loadItemCategories()
  }, [item.id, item.category_id])
  const [imageFile, setImageFile] = useState<File | null>(null)
  const [uploading, setUploading] = useState(false)
  const [newTag, setNewTag] = useState('')

  const availableTags = [
    'halal', '🌱', '🌶️', '🥛', '🐟', '🥜', '🌾', '🥚', '🦐', '🍄'
  ]

  const tagLabels: { [key: string]: string } = {
    'halal': 'Halal Certified',
    '🌱': 'Vegetarian',
    '🌶️': 'Spicy',
    '🥛': 'Contains Dairy',
    '🐟': 'Contains Fish',
    '🥜': 'Contains Nuts',
    '🌾': 'Gluten Free',
    '🥚': 'Contains Eggs',
    '🦐': 'Contains Shellfish',
    '🍄': 'Contains Mushrooms'
  }

  const handleImageUpload = async (file: File): Promise<string> => {
    return uploadImageToStorage(file, 'menu-items')
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setUploading(true)
    
    try {
      let finalImageUrl = formData.image_url
      
      if (imageFile) {
        try {
          finalImageUrl = await uploadImageToStorage(imageFile, 'menu-items', item.image_url)
        } catch (uploadError) {
          console.error('❌ Image upload failed:', uploadError);
          const errorMessage = uploadError instanceof Error ? uploadError.message : 'Unknown upload error';
          alert(`Image upload failed: ${errorMessage}\n\nPlease check:\n- File size (max 5MB)\n- File format (JPEG, PNG, WebP, GIF)\n- Your internet connection\n- Supabase storage configuration`);
          setUploading(false);
          return;
        }
      }
      
      // For now, use the first selected category (temporary fix for current database structure)
      const primaryCategoryId = formData.selectedCategories[0] || ''
      
      await onSubmit({
        ...item,
        ...formData,
        price: parseFloat(formData.price),
        image_url: finalImageUrl,
        category_id: primaryCategoryId, // Temporary for current structure
      })
    } catch (error) {
      console.error('Error updating menu item:', error)
      const errorMessage = error instanceof Error ? error.message : 'Unknown error';
      alert(`Error updating menu item: ${errorMessage}`)
    } finally {
      setUploading(false)
    }
  }

  return (
    <div className="fixed inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center p-4 z-50 overflow-y-auto">
      <motion.div
        initial={{ opacity: 0, scale: 0.95, y: 20 }}
        animate={{ opacity: 1, scale: 1, y: 0 }}
        exit={{ opacity: 0, scale: 0.95, y: 20 }}
        className="bg-white rounded-3xl shadow-2xl w-full max-w-2xl mx-auto my-8 overflow-hidden border border-gray-100"
      >
        <div className="bg-gradient-to-r from-primary to-pink-500 p-6 text-white relative">
          <button
            onClick={onClose}
            className="absolute top-4 right-4 text-white/80 hover:text-white transition-colors"
          >
            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
          <h3 className="text-2xl font-bold">Edit Menu Item</h3>
          <p className="text-white/80 text-sm mt-1">Update menu item details</p>
        </div>
        <div className="p-8 max-h-[80vh] overflow-y-auto">
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label htmlFor="edit-item-name" className="block text-sm font-medium text-gray-700 mb-1">
              Item Name *
            </label>
            <input
              id="edit-item-name"
              type="text"
              placeholder="Enter item name"
              value={formData.name}
              onChange={(e) => setFormData({ ...formData, name: e.target.value })}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent"
              required
            />
          </div>
          
          <div>
            <label htmlFor="edit-item-description" className="block text-sm font-medium text-gray-700 mb-1">
              Description *
            </label>
            <textarea
              id="edit-item-description"
              placeholder="Enter item description"
              value={formData.description}
              onChange={(e) => setFormData({ ...formData, description: e.target.value })}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent"
              rows={3}
              required
            />
          </div>
          
          <div>
            <label htmlFor="edit-item-price" className="block text-sm font-medium text-gray-700 mb-1">
              Price (CAD) *
            </label>
            <input
              id="edit-item-price"
              type="number"
              step="0.01"
              min="0"
              placeholder="0.00"
              value={formData.price}
              onChange={(e) => setFormData({ ...formData, price: e.target.value })}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent"
              required
            />
          </div>
          
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Categories *
            </label>
            <div className="space-y-2 max-h-32 overflow-y-auto border border-gray-300 rounded-lg p-3">
              {categories.map((category) => (
                <label key={category.id} className="flex items-center space-x-2 cursor-pointer">
                  <input
                    type="checkbox"
                    checked={formData.selectedCategories.includes(category.id)}
                    onChange={(e) => {
                      if (e.target.checked) {
                        setFormData(prev => ({
                          ...prev,
                          selectedCategories: [...prev.selectedCategories, category.id]
                        }))
                      } else {
                        setFormData(prev => ({
                          ...prev,
                          selectedCategories: prev.selectedCategories.filter(id => id !== category.id)
                        }))
                      }
                    }}
                    className="rounded focus:ring-2 focus:ring-primary"
                  />
                  <span className="text-sm text-gray-700">{category.name}</span>
                </label>
              ))}
            </div>
            {formData.selectedCategories.length === 0 && (
              <p className="text-xs text-red-500 mt-1">Please select at least one category</p>
            )}
          </div>
          
          <div>
            <label htmlFor="edit-item-image" className="block text-sm font-medium text-gray-700 mb-1">
              Item Image *
            </label>
            <div className="space-y-2">
              <input
                id="edit-item-image"
                type="file"
                accept="image/*"
                onChange={(e) => setImageFile(e.target.files?.[0] || null)}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent"
              />
              <p className="text-xs text-gray-500">Upload a new image or use URL below</p>
              <input
                type="url"
                placeholder="Or enter image URL"
                value={formData.image_url}
                onChange={(e) => setFormData({ ...formData, image_url: e.target.value })}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent"
              />
            </div>
          </div>
          
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Dietary Tags
            </label>
            <div className="space-y-3">
              <div className="flex flex-wrap gap-2">
                {availableTags.map((tag) => (
                  <button
                    key={tag}
                    type="button"
                    onClick={() => {
                      const newTags = formData.dietary_tags.includes(tag)
                        ? formData.dietary_tags.filter(t => t !== tag)
                        : [...formData.dietary_tags, tag]
                      setFormData({ ...formData, dietary_tags: newTags })
                    }}
                    className={`px-3 py-1 rounded-full text-sm font-medium transition-colors ${
                      formData.dietary_tags.includes(tag)
                        ? 'bg-primary text-white'
                        : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                    }`}
                  >
                    {tag} {tagLabels[tag]}
                  </button>
                ))}
              </div>
              <div className="flex items-center space-x-2">
                <input
                  type="text"
                  placeholder="Add custom tag"
                  value={newTag}
                  onChange={(e) => setNewTag(e.target.value)}
                  className="flex-1 px-3 py-2 border border-gray-300 rounded-lg text-sm focus:ring-2 focus:ring-primary focus:border-transparent"
                />
                <button
                  type="button"
                  onClick={() => {
                    if (newTag.trim() && !formData.dietary_tags.includes(newTag.trim())) {
                      setFormData({
                        ...formData,
                        dietary_tags: [...formData.dietary_tags, newTag.trim()]
                      })
                      setNewTag('')
                    }
                  }}
                  className="px-4 py-2 bg-gray-600 text-white rounded-lg text-sm hover:bg-gray-700"
                >
                  Add
                </button>
              </div>
            </div>
          </div>
          
          <div className="flex items-center space-x-2">
            <input
              type="checkbox"
              id="is_popular_edit"
              checked={formData.is_popular}
              onChange={(e) => setFormData({ ...formData, is_popular: e.target.checked })}
              className="rounded focus:ring-2 focus:ring-primary"
            />
            <label htmlFor="is_popular_edit" className="text-sm text-gray-700">
              Mark as popular item
            </label>
          </div>
          
          <div className="flex space-x-2">
            <button
              type="submit"
              disabled={uploading}
              className="flex-1 px-4 py-2 bg-primary text-white rounded-lg hover:bg-primary/90 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {uploading ? 'Uploading...' : 'Update Item'}
            </button>
            <button
              type="button"
              onClick={onClose}
              className="flex-1 px-4 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50"
            >
              Cancel
            </button>
          </div>
        </form>
        </div>
      </motion.div>
    </div>
  )
}

// Edit Category Modal Component
interface EditCategoryModalProps {
  category: Category
  onClose: () => void
  onSubmit: (data: Category) => Promise<void>
}

const EditCategoryModal: React.FC<EditCategoryModalProps> = ({ category, onClose, onSubmit }) => {
  const [formData, setFormData] = useState({
    name: category.name,
    icon: category.icon,
  })
  const [menuItems, setMenuItems] = useState<MenuItem[]>([])
  const [allMenuItems, setAllMenuItems] = useState<MenuItem[]>([])
  const [loading, setLoading] = useState(true)
  const [showAddItem, setShowAddItem] = useState(false)
  const [showAddExisting, setShowAddExisting] = useState(false)

  // Load menu items for this category
  useEffect(() => {
    const loadCategoryItems = async () => {
      try {
        setLoading(true)
        
        // Load items in this category (temporary fix for current database structure)
        const { data: categoryData, error: categoryError } = await supabase
          .from('menu_items')
          .select('*')
          .eq('category_id', category.id)
          .order('created_at')
        
        if (categoryError) throw categoryError
        setMenuItems(categoryData || [])

        // Load all menu items for selection
        const { data: allData, error: allError } = await supabase
          .from('menu_items')
          .select('*')
          .order('created_at')
        
        if (allError) throw allError
        setAllMenuItems(allData || [])
      } catch (error) {
        console.error('Error loading menu items:', error)
      } finally {
        setLoading(false)
      }
    }

    loadCategoryItems()
  }, [category.id])

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    await onSubmit({
      ...category,
      ...formData,
      gradient: 'from-primary to-pink-500', // Default gradient for all categories
    })
  }

  return (
    <div className="fixed inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center p-4 z-50 overflow-y-auto">
      <motion.div
        initial={{ opacity: 0, scale: 0.95, y: 20 }}
        animate={{ opacity: 1, scale: 1, y: 0 }}
        exit={{ opacity: 0, scale: 0.95, y: 20 }}
        className="bg-white rounded-3xl shadow-2xl w-full max-w-xl mx-auto my-8 overflow-hidden border border-gray-100"
      >
                      <div className="bg-gradient-to-r from-primary to-pink-500 p-6 text-white relative">
                <button
                  onClick={onClose}
                  className="absolute top-4 right-4 text-white/80 hover:text-white transition-colors"
                >
                  <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                  </svg>
                </button>
                <h3 className="text-2xl font-bold">Edit Category</h3>
                <p className="text-white/80 text-sm mt-1">Update category details</p>
              </div>
        <div className="p-8 max-h-[80vh] overflow-y-auto">
        <form onSubmit={handleSubmit} className="space-y-6">
          <div>
            <label htmlFor="edit-category-name" className="block text-sm font-medium text-gray-700 mb-1">
              Category Name *
            </label>
            <input
              id="edit-category-name"
              type="text"
              placeholder="Enter category name"
              value={formData.name}
              onChange={(e) => setFormData({ ...formData, name: e.target.value })}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent"
              required
            />
          </div>
          
          <div>
            <label htmlFor="edit-category-icon" className="block text-sm font-medium text-gray-700 mb-1">
              Icon (Emoji) *
            </label>
            <div className="flex space-x-2">
              <input
                id="edit-category-icon"
                type="text"
                placeholder="🍽️"
                value={formData.icon}
                onChange={(e) => setFormData({ ...formData, icon: e.target.value })}
                className="flex-1 px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent"
                required
              />
              <EmojiPicker onSelect={(emoji) => setFormData({ ...formData, icon: emoji })} />
            </div>
          </div>

          {/* Menu Items Section */}
          <div className="border-t pt-6">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-lg font-semibold text-gray-900">Menu Items in this Category</h3>
              <div className="flex space-x-2">
                <button
                  type="button"
                  onClick={() => setShowAddExisting(true)}
                  className="flex items-center space-x-2 px-3 py-1 bg-gray-600 text-white rounded-lg text-sm hover:bg-gray-700 transition-colors"
                >
                  <Plus className="w-4 h-4" />
                  <span>Add Existing</span>
                </button>
                <button
                  type="button"
                  onClick={() => setShowAddItem(true)}
                  className="flex items-center space-x-2 px-3 py-1 bg-primary text-white rounded-lg text-sm hover:bg-primary/90 transition-colors"
                >
                  <Plus className="w-4 h-4" />
                  <span>Add New</span>
                </button>
              </div>
            </div>

            {loading ? (
              <div className="text-center py-8">
                <div className="w-6 h-6 border-2 border-primary border-t-transparent rounded-full animate-spin mx-auto mb-2"></div>
                <p className="text-gray-600 text-sm">Loading menu items...</p>
              </div>
            ) : menuItems.length === 0 ? (
              <div className="text-center py-8 bg-gray-50 rounded-xl">
                <p className="text-gray-500 mb-3">No menu items in this category yet</p>
                <button
                  type="button"
                  onClick={() => setShowAddItem(true)}
                  className="px-4 py-2 bg-primary text-white rounded-lg text-sm hover:bg-primary/90 transition-colors"
                >
                  Add First Item
                </button>
              </div>
            ) : (
              <div className="grid gap-3 max-h-64 overflow-y-auto">
                {menuItems.map((item) => (
                  <div key={item.id} className="flex items-center space-x-3 p-3 bg-gray-50 rounded-lg">
                    <img
                      src={item.image_url}
                      alt={item.name}
                      className="w-12 h-12 object-cover rounded-lg"
                    />
                    <div className="flex-1 min-w-0">
                      <h4 className="font-medium text-gray-900 truncate">{item.name}</h4>
                      <p className="text-sm text-gray-600">${item.price}</p>
                    </div>
                    <div className="flex items-center space-x-1">
                      <button
                        type="button"
                        onClick={() => {
                          // Open edit modal for this item
                          // This would need to be passed down from parent
                        }}
                        className="p-1 text-gray-400 hover:text-primary transition-colors"
                      >
                        <Edit className="w-4 h-4" />
                      </button>
                                              <button
                          type="button"
                          onClick={async () => {
                            if (confirm('Are you sure you want to delete this menu item?')) {
                              try {
                                // Remove from this category
                                const { error: relationError } = await supabase
                                  .from('menu_item_categories')
                                  .delete()
                                  .eq('menu_item_id', item.id)
                                  .eq('category_id', category.id)
                                
                                if (relationError) throw relationError
                                
                                // Reload menu items
                                const { data: categoryRelations } = await supabase
                                  .from('menu_item_categories')
                                  .select(`
                                    menu_item_id,
                                    menu_items (*)
                                  `)
                                  .eq('category_id', category.id)
                                
                                const categoryItems = categoryRelations?.map(relation => relation.menu_items as unknown as MenuItem).filter(Boolean) || []
                                setMenuItems(categoryItems)
                              } catch (error) {
                                console.error('Error removing menu item from category:', error)
                                alert('Error removing menu item from category')
                              }
                            }
                          }}
                        className="p-1 text-gray-400 hover:text-red-600 transition-colors"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
          
          <div className="flex space-x-2">
            <button
              type="submit"
              className="flex-1 px-4 py-2 bg-primary text-white rounded-lg hover:bg-primary/90"
            >
              Update Category
            </button>
            <button
              type="button"
              onClick={onClose}
              className="flex-1 px-4 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50"
            >
              Cancel
            </button>
          </div>
        </form>

        {/* Add Menu Item Modal */}
        {showAddItem && (
          <AddMenuItemModal
            categories={[{ 
              id: category.id, 
              name: category.name, 
              icon: category.icon, 
              gradient: 'from-primary to-pink-500',
              sort_order: category.sort_order,
              created_at: category.created_at
            }]}
            onClose={() => setShowAddItem(false)}
            onSubmit={async (itemData) => {
              try {
                const { error } = await supabase
                  .from('menu_items')
                  .insert([itemData])
                
                if (error) throw error
                
                setShowAddItem(false)
                // Reload menu items
                const { data } = await supabase
                  .from('menu_items')
                  .select('*')
                  .eq('category_id', category.id)
                  .order('created_at')
                setMenuItems(data || [])
              } catch (error) {
                console.error('Error adding menu item:', error)
                alert('Error adding menu item')
              }
            }}
          />
        )}

        {/* Add Existing Menu Items Modal */}
        {showAddExisting && (
          <div className="fixed inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center p-4 z-50">
            <motion.div
              initial={{ opacity: 0, scale: 0.95, y: 20 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              className="bg-white rounded-3xl shadow-2xl w-full max-w-2xl mx-auto overflow-hidden border border-gray-100"
            >
              <div className="bg-gradient-to-r from-gray-600 to-gray-700 p-6 text-white">
                <h3 className="text-2xl font-bold">Add Existing Menu Items</h3>
                <p className="text-white/80 text-sm mt-1">Select menu items to add to "{category.name}"</p>
              </div>
              <div className="p-6 max-h-96 overflow-y-auto">
                <div className="grid gap-3">
                  {allMenuItems
                    .filter(item => item.category_id !== category.id)
                    .map((item) => (
                      <div key={item.id} className="flex items-center space-x-3 p-3 bg-gray-50 rounded-lg">
                        <img
                          src={item.image_url}
                          alt={item.name}
                          className="w-12 h-12 object-cover rounded-lg"
                        />
                        <div className="flex-1 min-w-0">
                          <h4 className="font-medium text-gray-900 truncate">{item.name}</h4>
                          <p className="text-sm text-gray-600">${item.price}</p>
                        </div>
                        <button
                          type="button"
                          onClick={async () => {
                            try {
                              // Move to this category (temporary fix for current database structure)
                              const { error } = await supabase
                                .from('menu_items')
                                .update({ category_id: category.id })
                                .eq('id', item.id)
                              
                              if (error) throw error
                              
                              // Reload menu items
                              const { data: categoryData } = await supabase
                                .from('menu_items')
                                .select('*')
                                .eq('category_id', category.id)
                                .order('created_at')
                              setMenuItems(categoryData || [])
                              
                              const { data: allData } = await supabase
                                .from('menu_items')
                                .select('*')
                                .order('created_at')
                              setAllMenuItems(allData || [])
                            } catch (error) {
                              console.error('Error moving menu item to category:', error)
                              alert('Error moving menu item to category')
                            }
                          }}
                          className="px-3 py-1 bg-primary text-white rounded-lg text-sm hover:bg-primary/90 transition-colors"
                        >
                          Add to Category
                        </button>
                      </div>
                    ))}
                </div>
                {allMenuItems.filter(item => item.category_id !== category.id).length === 0 && (
                  <div className="text-center py-8 text-gray-500">
                    <p>No other menu items available to add to this category.</p>
                  </div>
                )}
              </div>
              <div className="p-6 border-t">
                <button
                  type="button"
                  onClick={() => setShowAddExisting(false)}
                  className="w-full px-4 py-2 bg-gray-600 text-white rounded-lg hover:bg-gray-700 transition-colors"
                >
                  Close
                </button>
              </div>
            </motion.div>
          </div>
        )}
        </div>
      </motion.div>
    </div>
  )
}

// Add Promo Modal Component
interface AddPromoModalProps {
  categories: Category[]
  menuItems: MenuItem[]
  onClose: () => void
  onSubmit: (data: Omit<Promo, 'id' | 'created_at' | 'updated_at' | 'current_uses'>) => Promise<void>
}

const AddPromoModal: React.FC<AddPromoModalProps> = ({ categories, menuItems, onClose, onSubmit }) => {
  const [formData, setFormData] = useState({
    name: '',
    description: '',
    discount_type: 'percentage' as 'percentage' | 'fixed_amount',
    discount_value: '',
    start_date: '',
    end_date: '',
    is_active: true,
    applies_to: 'all_items' as 'all_items' | 'specific_categories' | 'specific_items',
    category_ids: [] as string[],
    item_ids: [] as string[],
    promo_code: '',
    max_uses: '',
  })

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    await onSubmit({
      ...formData,
      discount_value: parseFloat(formData.discount_value),
      max_uses: formData.max_uses ? parseInt(formData.max_uses) : undefined,
      category_ids: formData.applies_to === 'specific_categories' ? formData.category_ids : undefined,
      item_ids: formData.applies_to === 'specific_items' ? formData.item_ids : undefined,
    })
  }

  return (
    <div className="fixed inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center p-4 z-50 overflow-y-auto">
      <motion.div
        initial={{ opacity: 0, scale: 0.95, y: 20 }}
        animate={{ opacity: 1, scale: 1, y: 0 }}
        exit={{ opacity: 0, scale: 0.95, y: 20 }}
        className="bg-white rounded-3xl shadow-2xl w-full max-w-2xl mx-auto my-8 overflow-hidden border border-gray-100"
      >
        <div className="bg-gradient-to-r from-red-500 to-pink-500 p-6 text-white relative">
          <button
            onClick={onClose}
            className="absolute top-4 right-4 text-white/80 hover:text-white transition-colors"
          >
            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
          <h3 className="text-2xl font-bold">Add Promotion</h3>
          <p className="text-white/80 text-sm mt-1">Create a new promotional offer</p>
        </div>
        <div className="p-8 max-h-[80vh] overflow-y-auto">
          <form onSubmit={handleSubmit} className="space-y-6">
            <div>
              <label htmlFor="promo-name" className="block text-sm font-medium text-gray-700 mb-1">
                Promotion Name *
              </label>
              <input
                id="promo-name"
                type="text"
                placeholder="Enter promotion name"
                value={formData.name}
                onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent"
                required
              />
            </div>
            
            <div>
              <label htmlFor="promo-description" className="block text-sm font-medium text-gray-700 mb-1">
                Description *
              </label>
              <textarea
                id="promo-description"
                placeholder="Enter promotion description"
                value={formData.description}
                onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent"
                rows={3}
                required
              />
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label htmlFor="discount-type" className="block text-sm font-medium text-gray-700 mb-1">
                  Discount Type *
                </label>
                <select
                  id="discount-type"
                  value={formData.discount_type}
                  onChange={(e) => setFormData({ ...formData, discount_type: e.target.value as 'percentage' | 'fixed_amount' })}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent"
                  required
                >
                  <option value="percentage">Percentage (%)</option>
                  <option value="fixed_amount">Fixed Amount ($)</option>
                </select>
              </div>
              
              <div>
                <label htmlFor="discount-value" className="block text-sm font-medium text-gray-700 mb-1">
                  Discount Value *
                </label>
                <input
                  id="discount-value"
                  type="number"
                  step="0.01"
                  min="0"
                  placeholder={formData.discount_type === 'percentage' ? "10" : "5.00"}
                  value={formData.discount_value}
                  onChange={(e) => setFormData({ ...formData, discount_value: e.target.value })}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent"
                  required
                />
              </div>
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label htmlFor="start-date" className="block text-sm font-medium text-gray-700 mb-1">
                  Start Date *
                </label>
                <input
                  id="start-date"
                  type="datetime-local"
                  value={formData.start_date}
                  onChange={(e) => setFormData({ ...formData, start_date: e.target.value })}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent"
                  required
                />
              </div>
              
              <div>
                <label htmlFor="end-date" className="block text-sm font-medium text-gray-700 mb-1">
                  End Date *
                </label>
                <input
                  id="end-date"
                  type="datetime-local"
                  value={formData.end_date}
                  onChange={(e) => setFormData({ ...formData, end_date: e.target.value })}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent"
                  required
                />
              </div>
            </div>
            
            <div>
              <label htmlFor="applies-to" className="block text-sm font-medium text-gray-700 mb-1">
                Applies To *
              </label>
              <select
                id="applies-to"
                value={formData.applies_to}
                onChange={(e) => setFormData({ ...formData, applies_to: e.target.value as 'all_items' | 'specific_categories' | 'specific_items' })}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent"
                required
              >
                <option value="all_items">All Menu Items</option>
                <option value="specific_categories">Specific Categories</option>
                <option value="specific_items">Specific Items</option>
              </select>
            </div>
            
            {formData.applies_to === 'specific_categories' && (
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Select Categories
                </label>
                <div className="space-y-2 max-h-32 overflow-y-auto border border-gray-300 rounded-lg p-3">
                  {categories.map((category) => (
                    <label key={category.id} className="flex items-center space-x-2 cursor-pointer">
                      <input
                        type="checkbox"
                        checked={formData.category_ids.includes(category.id)}
                        onChange={(e) => {
                          if (e.target.checked) {
                            setFormData(prev => ({
                              ...prev,
                              category_ids: [...prev.category_ids, category.id]
                            }))
                          } else {
                            setFormData(prev => ({
                              ...prev,
                              category_ids: prev.category_ids.filter(id => id !== category.id)
                            }))
                          }
                        }}
                        className="rounded focus:ring-2 focus:ring-primary"
                      />
                      <span className="text-sm text-gray-700">{category.name}</span>
                    </label>
                  ))}
                </div>
              </div>
            )}
            
            {formData.applies_to === 'specific_items' && (
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Select Items
                </label>
                <div className="space-y-2 max-h-32 overflow-y-auto border border-gray-300 rounded-lg p-3">
                  {menuItems.map((item) => (
                    <label key={item.id} className="flex items-center space-x-2 cursor-pointer">
                      <input
                        type="checkbox"
                        checked={formData.item_ids.includes(item.id)}
                        onChange={(e) => {
                          if (e.target.checked) {
                            setFormData(prev => ({
                              ...prev,
                              item_ids: [...prev.item_ids, item.id]
                            }))
                          } else {
                            setFormData(prev => ({
                              ...prev,
                              item_ids: prev.item_ids.filter(id => id !== item.id)
                            }))
                          }
                        }}
                        className="rounded focus:ring-2 focus:ring-primary"
                      />
                      <span className="text-sm text-gray-700">{item.name} - ${item.price}</span>
                    </label>
                  ))}
                </div>
              </div>
            )}
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label htmlFor="promo-code" className="block text-sm font-medium text-gray-700 mb-1">
                  Promo Code (Optional)
                </label>
                <input
                  id="promo-code"
                  type="text"
                  placeholder="SUMMER2024"
                  value={formData.promo_code}
                  onChange={(e) => setFormData({ ...formData, promo_code: e.target.value })}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent"
                />
              </div>
              
              <div>
                <label htmlFor="max-uses" className="block text-sm font-medium text-gray-700 mb-1">
                  Max Uses (Optional)
                </label>
                <input
                  id="max-uses"
                  type="number"
                  min="1"
                  placeholder="100"
                  value={formData.max_uses}
                  onChange={(e) => setFormData({ ...formData, max_uses: e.target.value })}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent"
                />
              </div>
            </div>
            
            <div className="flex items-center space-x-2">
              <input
                type="checkbox"
                id="is-active"
                checked={formData.is_active}
                onChange={(e) => setFormData({ ...formData, is_active: e.target.checked })}
                className="rounded focus:ring-2 focus:ring-primary"
              />
              <label htmlFor="is-active" className="text-sm text-gray-700">
                Active promotion
              </label>
            </div>
            
            <div className="flex space-x-2">
              <button
                type="submit"
                className="flex-1 px-4 py-2 bg-primary text-white rounded-lg hover:bg-primary/90"
              >
                Add Promotion
              </button>
              <button
                type="button"
                onClick={onClose}
                className="flex-1 px-4 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50"
              >
                Cancel
              </button>
            </div>
          </form>
        </div>
      </motion.div>
    </div>
  )
}

// Edit Promo Modal Component
interface EditPromoModalProps {
  promo: Promo
  categories: Category[]
  menuItems: MenuItem[]
  onClose: () => void
  onSubmit: (data: Promo) => Promise<void>
}

const EditPromoModal: React.FC<EditPromoModalProps> = ({ promo, categories, menuItems, onClose, onSubmit }) => {
  const [formData, setFormData] = useState({
    name: promo.name,
    description: promo.description,
    discount_type: promo.discount_type,
    discount_value: promo.discount_value.toString(),
    start_date: promo.start_date.slice(0, 16), // Format for datetime-local input
    end_date: promo.end_date.slice(0, 16),
    is_active: promo.is_active,
    applies_to: promo.applies_to,
    category_ids: promo.category_ids || [],
    item_ids: promo.item_ids || [],
    promo_code: promo.promo_code || '',
    max_uses: promo.max_uses?.toString() || '',
  })

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    await onSubmit({
      ...promo,
      ...formData,
      discount_value: parseFloat(formData.discount_value),
      max_uses: formData.max_uses ? parseInt(formData.max_uses) : undefined,
      category_ids: formData.applies_to === 'specific_categories' ? formData.category_ids : undefined,
      item_ids: formData.applies_to === 'specific_items' ? formData.item_ids : undefined,
    })
  }

  return (
    <div className="fixed inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center p-4 z-50 overflow-y-auto">
      <motion.div
        initial={{ opacity: 0, scale: 0.95, y: 20 }}
        animate={{ opacity: 1, scale: 1, y: 0 }}
        exit={{ opacity: 0, scale: 0.95, y: 20 }}
        className="bg-white rounded-3xl shadow-2xl w-full max-w-2xl mx-auto my-8 overflow-hidden border border-gray-100"
      >
        <div className="bg-gradient-to-r from-red-500 to-pink-500 p-6 text-white relative">
          <button
            onClick={onClose}
            className="absolute top-4 right-4 text-white/80 hover:text-white transition-colors"
          >
            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
          <h3 className="text-2xl font-bold">Edit Promotion</h3>
          <p className="text-white/80 text-sm mt-1">Update promotion details</p>
        </div>
        <div className="p-8 max-h-[80vh] overflow-y-auto">
          <form onSubmit={handleSubmit} className="space-y-6">
            <div>
              <label htmlFor="edit-promo-name" className="block text-sm font-medium text-gray-700 mb-1">
                Promotion Name *
              </label>
              <input
                id="edit-promo-name"
                type="text"
                placeholder="Enter promotion name"
                value={formData.name}
                onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent"
                required
              />
            </div>
            
            <div>
              <label htmlFor="edit-promo-description" className="block text-sm font-medium text-gray-700 mb-1">
                Description *
              </label>
              <textarea
                id="edit-promo-description"
                placeholder="Enter promotion description"
                value={formData.description}
                onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent"
                rows={3}
                required
              />
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label htmlFor="edit-discount-type" className="block text-sm font-medium text-gray-700 mb-1">
                  Discount Type *
                </label>
                <select
                  id="edit-discount-type"
                  value={formData.discount_type}
                  onChange={(e) => setFormData({ ...formData, discount_type: e.target.value as 'percentage' | 'fixed_amount' })}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent"
                  required
                >
                  <option value="percentage">Percentage (%)</option>
                  <option value="fixed_amount">Fixed Amount ($)</option>
                </select>
              </div>
              
              <div>
                <label htmlFor="edit-discount-value" className="block text-sm font-medium text-gray-700 mb-1">
                  Discount Value *
                </label>
                <input
                  id="edit-discount-value"
                  type="number"
                  step="0.01"
                  min="0"
                  placeholder={formData.discount_type === 'percentage' ? "10" : "5.00"}
                  value={formData.discount_value}
                  onChange={(e) => setFormData({ ...formData, discount_value: e.target.value })}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent"
                  required
                />
              </div>
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label htmlFor="edit-start-date" className="block text-sm font-medium text-gray-700 mb-1">
                  Start Date *
                </label>
                <input
                  id="edit-start-date"
                  type="datetime-local"
                  value={formData.start_date}
                  onChange={(e) => setFormData({ ...formData, start_date: e.target.value })}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent"
                  required
                />
              </div>
              
              <div>
                <label htmlFor="edit-end-date" className="block text-sm font-medium text-gray-700 mb-1">
                  End Date *
                </label>
                <input
                  id="edit-end-date"
                  type="datetime-local"
                  value={formData.end_date}
                  onChange={(e) => setFormData({ ...formData, end_date: e.target.value })}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent"
                  required
                />
              </div>
            </div>
            
            <div>
              <label htmlFor="edit-applies-to" className="block text-sm font-medium text-gray-700 mb-1">
                Applies To *
              </label>
              <select
                id="edit-applies-to"
                value={formData.applies_to}
                onChange={(e) => setFormData({ ...formData, applies_to: e.target.value as 'all_items' | 'specific_categories' | 'specific_items' })}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent"
                required
              >
                <option value="all_items">All Menu Items</option>
                <option value="specific_categories">Specific Categories</option>
                <option value="specific_items">Specific Items</option>
              </select>
            </div>
            
            {formData.applies_to === 'specific_categories' && (
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Select Categories
                </label>
                <div className="space-y-2 max-h-32 overflow-y-auto border border-gray-300 rounded-lg p-3">
                  {categories.map((category) => (
                    <label key={category.id} className="flex items-center space-x-2 cursor-pointer">
                      <input
                        type="checkbox"
                        checked={formData.category_ids.includes(category.id)}
                        onChange={(e) => {
                          if (e.target.checked) {
                            setFormData(prev => ({
                              ...prev,
                              category_ids: [...prev.category_ids, category.id]
                            }))
                          } else {
                            setFormData(prev => ({
                              ...prev,
                              category_ids: prev.category_ids.filter(id => id !== category.id)
                            }))
                          }
                        }}
                        className="rounded focus:ring-2 focus:ring-primary"
                      />
                      <span className="text-sm text-gray-700">{category.name}</span>
                    </label>
                  ))}
                </div>
              </div>
            )}
            
            {formData.applies_to === 'specific_items' && (
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Select Items
                </label>
                <div className="space-y-2 max-h-32 overflow-y-auto border border-gray-300 rounded-lg p-3">
                  {menuItems.map((item) => (
                    <label key={item.id} className="flex items-center space-x-2 cursor-pointer">
                      <input
                        type="checkbox"
                        checked={formData.item_ids.includes(item.id)}
                        onChange={(e) => {
                          if (e.target.checked) {
                            setFormData(prev => ({
                              ...prev,
                              item_ids: [...prev.item_ids, item.id]
                            }))
                          } else {
                            setFormData(prev => ({
                              ...prev,
                              item_ids: prev.item_ids.filter(id => id !== item.id)
                            }))
                          }
                        }}
                        className="rounded focus:ring-2 focus:ring-primary"
                      />
                      <span className="text-sm text-gray-700">{item.name} - ${item.price}</span>
                    </label>
                  ))}
                </div>
              </div>
            )}
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label htmlFor="edit-promo-code" className="block text-sm font-medium text-gray-700 mb-1">
                  Promo Code (Optional)
                </label>
                <input
                  id="edit-promo-code"
                  type="text"
                  placeholder="SUMMER2024"
                  value={formData.promo_code}
                  onChange={(e) => setFormData({ ...formData, promo_code: e.target.value })}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent"
                />
              </div>
              
              <div>
                <label htmlFor="edit-max-uses" className="block text-sm font-medium text-gray-700 mb-1">
                  Max Uses (Optional)
                </label>
                <input
                  id="edit-max-uses"
                  type="number"
                  min="1"
                  placeholder="100"
                  value={formData.max_uses}
                  onChange={(e) => setFormData({ ...formData, max_uses: e.target.value })}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent"
                />
              </div>
            </div>
            
            <div className="flex items-center space-x-2">
              <input
                type="checkbox"
                id="edit-is-active"
                checked={formData.is_active}
                onChange={(e) => setFormData({ ...formData, is_active: e.target.checked })}
                className="rounded focus:ring-2 focus:ring-primary"
              />
              <label htmlFor="edit-is-active" className="text-sm text-gray-700">
                Active promotion
              </label>
            </div>
            
            <div className="flex space-x-2">
              <button
                type="submit"
                className="flex-1 px-4 py-2 bg-primary text-white rounded-lg hover:bg-primary/90"
              >
                Update Promotion
              </button>
              <button
                type="button"
                onClick={onClose}
                className="flex-1 px-4 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50"
              >
                Cancel
              </button>
            </div>
          </form>
        </div>
      </motion.div>
    </div>
  )
}

// Add Poster Modal Component
interface AddPosterModalProps {
  onClose: () => void
  onSubmit: (data: Omit<PromoPoster, 'id' | 'created_at' | 'updated_at'>) => Promise<void>
}

const AddPosterModal: React.FC<AddPosterModalProps> = ({ onClose, onSubmit }) => {
  const [formData, setFormData] = useState({
    title: '',
    description: '',
    image_url: '',
    start_date: '',
    end_date: '',
    is_active: true,
  })
  const [isAnnouncement, setIsAnnouncement] = useState(false)
  const [imageFile, setImageFile] = useState<File | null>(null)
  const [uploading, setUploading] = useState(false)

  const handleImageUpload = async (file: File): Promise<string> => {
    return uploadImageToStorage(file, 'posters')
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setUploading(true)
    
    try {
      let finalImageUrl = formData.image_url
      
      if (imageFile) {
        finalImageUrl = await handleImageUpload(imageFile)
      }
      
      await onSubmit({
        ...formData,
        image_url: finalImageUrl,
      })
    } catch (error) {
      console.error('Error uploading image:', error)
      alert('Error uploading image. Please try again.')
    } finally {
      setUploading(false)
    }
  }

  return (
    <div className="fixed inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center p-4 z-50 overflow-y-auto">
      <motion.div
        initial={{ opacity: 0, scale: 0.95, y: 20 }}
        animate={{ opacity: 1, scale: 1, y: 0 }}
        exit={{ opacity: 0, scale: 0.95, y: 20 }}
        className="bg-white rounded-3xl shadow-2xl w-full max-w-2xl mx-auto my-8 overflow-hidden border border-gray-100"
      >
        <div className="bg-gradient-to-r from-blue-500 to-purple-500 p-6 text-white relative">
          <button
            onClick={onClose}
            className="absolute top-4 right-4 text-white/80 hover:text-white transition-colors"
          >
            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
          <h3 className="text-2xl font-bold">Add Promotional Poster</h3>
          <p className="text-white/80 text-sm mt-1">Create a new promotional poster for your website</p>
        </div>
        <div className="p-8 max-h-[80vh] overflow-y-auto">
          <form onSubmit={handleSubmit} className="space-y-6">
            <div>
              <label htmlFor="poster-title" className="block text-sm font-medium text-gray-700 mb-1">
                Poster Title *
              </label>
              <input
                id="poster-title"
                type="text"
                placeholder="Enter poster title"
                value={formData.title}
                onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent"
                required
              />
            </div>
            
            <div>
              <label htmlFor="poster-description" className="block text-sm font-medium text-gray-700 mb-1">
                Description (Optional)
              </label>
              <textarea
                id="poster-description"
                placeholder="Enter poster description"
                value={formData.description}
                onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent"
                rows={3}
              />
            </div>
            
            <div>
              <label htmlFor="poster-image" className="block text-sm font-medium text-gray-700 mb-1">
                Poster Image *
              </label>
              <div className="space-y-2">
                <input
                  id="poster-image"
                  type="file"
                  accept="image/*"
                  onChange={(e) => setImageFile(e.target.files?.[0] || null)}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent"
                />
                <p className="text-xs text-gray-500">Upload an image or use URL below</p>
                <input
                  type="url"
                  placeholder="Or enter image URL"
                  value={formData.image_url}
                  onChange={(e) => setFormData({ ...formData, image_url: e.target.value })}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent"
                />
              </div>
            </div>
            
            {/* Announcement Toggle */}
            <div className="flex items-center space-x-2 mb-4">
              <input
                type="checkbox"
                id="is-announcement"
                checked={isAnnouncement}
                onChange={(e) => {
                  setIsAnnouncement(e.target.checked)
                  if (e.target.checked) {
                    setFormData({ ...formData, start_date: '', end_date: '' })
                  }
                }}
                className="rounded focus:ring-2 focus:ring-primary"
              />
              <label htmlFor="is-announcement" className="text-sm text-gray-700 font-medium">
                This is an announcement (no date restrictions)
              </label>
            </div>

            {!isAnnouncement && (
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label htmlFor="start-date" className="block text-sm font-medium text-gray-700 mb-1">
                    Start Date *
                  </label>
                  <input
                    id="start-date"
                    type="datetime-local"
                    value={formData.start_date}
                    onChange={(e) => setFormData({ ...formData, start_date: e.target.value })}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent"
                    required={!isAnnouncement}
                  />
                </div>
                
                <div>
                  <label htmlFor="end-date" className="block text-sm font-medium text-gray-700 mb-1">
                    End Date *
                  </label>
                  <input
                    id="end-date"
                    type="datetime-local"
                    value={formData.end_date}
                    onChange={(e) => setFormData({ ...formData, end_date: e.target.value })}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent"
                    required={!isAnnouncement}
                  />
                </div>
              </div>
            )}
            
            <div className="flex items-center space-x-2">
              <input
                type="checkbox"
                id="is-active"
                checked={formData.is_active}
                onChange={(e) => setFormData({ ...formData, is_active: e.target.checked })}
                className="rounded focus:ring-2 focus:ring-primary"
              />
              <label htmlFor="is-active" className="text-sm text-gray-700">
                Active poster
              </label>
            </div>
            
            <div className="flex space-x-2">
              <button
                type="submit"
                disabled={uploading}
                className="flex-1 px-4 py-2 bg-primary text-white rounded-lg hover:bg-primary/90 disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {uploading ? 'Uploading...' : 'Add Poster'}
              </button>
              <button
                type="button"
                onClick={onClose}
                className="flex-1 px-4 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50"
              >
                Cancel
              </button>
            </div>
          </form>
        </div>
      </motion.div>
    </div>
  )
}

// Edit Poster Modal Component
interface EditPosterModalProps {
  poster: PromoPoster
  onClose: () => void
  onSubmit: (data: PromoPoster) => Promise<void>
}

const EditPosterModal: React.FC<EditPosterModalProps> = ({ poster, onClose, onSubmit }) => {
  const [formData, setFormData] = useState({
    title: poster.title,
    description: poster.description || '',
    image_url: poster.image_url,
    start_date: poster.start_date ? poster.start_date.slice(0, 16) : '', // Format for datetime-local input
    end_date: poster.end_date ? poster.end_date.slice(0, 16) : '',
    is_active: poster.is_active,
  })
  const [isAnnouncement, setIsAnnouncement] = useState(!poster.start_date && !poster.end_date)
  const [imageFile, setImageFile] = useState<File | null>(null)
  const [uploading, setUploading] = useState(false)

  const handleImageUpload = async (file: File): Promise<string> => {
    return uploadImageToStorage(file, 'posters', poster.image_url)
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setUploading(true)
    
    try {
      let finalImageUrl = formData.image_url
      
      if (imageFile) {
        finalImageUrl = await handleImageUpload(imageFile)
      }
      
      await onSubmit({
        ...poster,
        ...formData,
        image_url: finalImageUrl,
      })
    } catch (error) {
      console.error('Error uploading image:', error)
      alert('Error uploading image. Please try again.')
    } finally {
      setUploading(false)
    }
  }

  return (
    <div className="fixed inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center p-4 z-50 overflow-y-auto">
      <motion.div
        initial={{ opacity: 0, scale: 0.95, y: 20 }}
        animate={{ opacity: 1, scale: 1, y: 0 }}
        exit={{ opacity: 0, scale: 0.95, y: 20 }}
        className="bg-white rounded-3xl shadow-2xl w-full max-w-2xl mx-auto my-8 overflow-hidden border border-gray-100"
      >
        <div className="bg-gradient-to-r from-blue-500 to-purple-500 p-6 text-white relative">
          <button
            onClick={onClose}
            className="absolute top-4 right-4 text-white/80 hover:text-white transition-colors"
          >
            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
          <h3 className="text-2xl font-bold">Edit Promotional Poster</h3>
          <p className="text-white/80 text-sm mt-1">Update poster details</p>
        </div>
        <div className="p-8 max-h-[80vh] overflow-y-auto">
          <form onSubmit={handleSubmit} className="space-y-6">
            <div>
              <label htmlFor="edit-poster-title" className="block text-sm font-medium text-gray-700 mb-1">
                Poster Title *
              </label>
              <input
                id="edit-poster-title"
                type="text"
                placeholder="Enter poster title"
                value={formData.title}
                onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent"
                required
              />
            </div>
            
            <div>
              <label htmlFor="edit-poster-description" className="block text-sm font-medium text-gray-700 mb-1">
                Description (Optional)
              </label>
              <textarea
                id="edit-poster-description"
                placeholder="Enter poster description"
                value={formData.description}
                onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent"
                rows={3}
              />
            </div>
            
            <div>
              <label htmlFor="edit-poster-image" className="block text-sm font-medium text-gray-700 mb-1">
                Poster Image *
              </label>
              <div className="space-y-2">
                <input
                  id="edit-poster-image"
                  type="file"
                  accept="image/*"
                  onChange={(e) => setImageFile(e.target.files?.[0] || null)}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent"
                />
                <p className="text-xs text-gray-500">Upload a new image or use URL below</p>
                <input
                  type="url"
                  placeholder="Or enter image URL"
                  value={formData.image_url}
                  onChange={(e) => setFormData({ ...formData, image_url: e.target.value })}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent"
                />
              </div>
            </div>
            
            {/* Announcement Toggle */}
            <div className="flex items-center space-x-2 mb-4">
              <input
                type="checkbox"
                id="edit-is-announcement"
                checked={isAnnouncement}
                onChange={(e) => {
                  setIsAnnouncement(e.target.checked)
                  if (e.target.checked) {
                    setFormData({ ...formData, start_date: '', end_date: '' })
                  }
                }}
                className="rounded focus:ring-2 focus:ring-primary"
              />
              <label htmlFor="edit-is-announcement" className="text-sm text-gray-700 font-medium">
                This is an announcement (no date restrictions)
              </label>
            </div>

            {!isAnnouncement && (
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label htmlFor="edit-start-date" className="block text-sm font-medium text-gray-700 mb-1">
                    Start Date *
                  </label>
                  <input
                    id="edit-start-date"
                    type="datetime-local"
                    value={formData.start_date}
                    onChange={(e) => setFormData({ ...formData, start_date: e.target.value })}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent"
                    required={!isAnnouncement}
                  />
                </div>
                
                <div>
                  <label htmlFor="edit-end-date" className="block text-sm font-medium text-gray-700 mb-1">
                    End Date *
                  </label>
                  <input
                    id="edit-end-date"
                    type="datetime-local"
                    value={formData.end_date}
                    onChange={(e) => setFormData({ ...formData, end_date: e.target.value })}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent"
                    required={!isAnnouncement}
                  />
                </div>
              </div>
            )}
            
            <div className="flex items-center space-x-2">
              <input
                type="checkbox"
                id="edit-is-active"
                checked={formData.is_active}
                onChange={(e) => setFormData({ ...formData, is_active: e.target.checked })}
                className="rounded focus:ring-2 focus:ring-primary"
              />
              <label htmlFor="edit-is-active" className="text-sm text-gray-700">
                Active poster
              </label>
            </div>
            
            <div className="flex space-x-2">
              <button
                type="submit"
                disabled={uploading}
                className="flex-1 px-4 py-2 bg-primary text-white rounded-lg hover:bg-primary/90 disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {uploading ? 'Uploading...' : 'Update Poster'}
              </button>
              <button
                type="button"
                onClick={onClose}
                className="flex-1 px-4 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50"
              >
                Cancel
              </button>
            </div>
          </form>
        </div>
      </motion.div>
    </div>
  )
}

export default AdminDashboard 