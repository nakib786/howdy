import React, { useState, useEffect } from 'react'
import { motion } from 'framer-motion'
import { useAuth } from '../contexts/AuthContext'
import { useNavigate } from 'react-router-dom'
import { supabase, type MenuItem, type Category } from '../lib/supabase'
import { LogOut, Plus, Edit, Trash2, Menu as MenuIcon, Settings } from 'lucide-react'

const AdminDashboard: React.FC = () => {
  const { user, signOut, isAdmin } = useAuth()
  const navigate = useNavigate()
  const [activeTab, setActiveTab] = useState('menu')
  const [menuItems, setMenuItems] = useState<MenuItem[]>([])
  const [categories, setCategories] = useState<Category[]>([])
  const [loading, setLoading] = useState(true)
  const [showAddItem, setShowAddItem] = useState(false)
  const [showAddCategory, setShowAddCategory] = useState(false)
  const [editingItem, setEditingItem] = useState<MenuItem | null>(null)
  const [editingCategory, setEditingCategory] = useState<Category | null>(null)

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
      setCategories(categoriesData || [])

      // Load menu items
      const { data: menuData, error: menuError } = await supabase
        .from('menu_items')
        .select('*')
        .order('created_at')
      
      if (menuError) throw menuError
      setMenuItems(menuData || [])
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

  const handleAddMenuItem = async (itemData: Omit<MenuItem, 'id' | 'created_at' | 'updated_at'>) => {
    try {
      const { error } = await supabase
        .from('menu_items')
        .insert([itemData])
      
      if (error) throw error
      
      setShowAddItem(false)
      loadData()
    } catch (error) {
      console.error('Error adding menu item:', error)
    }
  }

  const handleAddCategory = async (categoryData: Omit<Category, 'id' | 'created_at'>) => {
    try {
      const { error } = await supabase
        .from('categories')
        .insert([categoryData])
      
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

  const handleEditMenuItem = async (itemData: MenuItem) => {
    try {
      const { error } = await supabase
        .from('menu_items')
        .update({
          name: itemData.name,
          description: itemData.description,
          price: itemData.price,
          image_url: itemData.image_url,
          category_id: itemData.category_id,
          dietary_tags: itemData.dietary_tags,
          is_popular: itemData.is_popular,
        })
        .eq('id', itemData.id)
      
      if (error) throw error
      
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
          sort_order: categoryData.sort_order,
        })
        .eq('id', categoryData.id)
      
      if (error) throw error
      
      setEditingCategory(null)
      loadData()
    } catch (error) {
      console.error('Error updating category:', error)
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
            <div className="flex items-center space-x-4">
              <div className="w-10 h-10 bg-gradient-to-r from-primary to-pink-500 rounded-xl flex items-center justify-center">
                <MenuIcon className="w-6 h-6 text-white" />
              </div>
              <div>
                <h1 className="text-2xl font-bold text-gray-900">Howdy Cafe Admin</h1>
                <p className="text-sm text-gray-600">Welcome back, {user?.email}</p>
              </div>
            </div>
            <button
              onClick={handleSignOut}
              className="flex items-center space-x-2 px-4 py-2 text-gray-600 hover:text-gray-900 transition-colors"
            >
              <LogOut className="w-4 h-4" />
              <span>Sign Out</span>
            </button>
          </div>
        </div>
      </header>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Navigation Tabs */}
        <div className="flex space-x-1 bg-white rounded-xl p-1 shadow-sm mb-8">
          {[
            { id: 'menu', label: 'Menu Items', icon: MenuIcon },
            { id: 'categories', label: 'Categories', icon: Settings },
          ].map((tab) => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              className={`flex items-center space-x-2 px-4 py-2 rounded-lg font-medium transition-all ${
                activeTab === tab.id
                  ? 'bg-primary text-white shadow-sm'
                  : 'text-gray-600 hover:text-gray-900'
              }`}
            >
              <tab.icon className="w-4 h-4" />
              <span>{tab.label}</span>
            </button>
          ))}
        </div>

        {/* Content */}
        <div className="bg-white rounded-2xl shadow-sm border border-gray-200">
          {activeTab === 'menu' && (
            <div className="p-6">
              <div className="flex justify-between items-center mb-6">
                <h2 className="text-xl font-semibold text-gray-900">Menu Items</h2>
                <button
                  onClick={() => setShowAddItem(true)}
                  className="flex items-center space-x-2 px-4 py-2 bg-primary text-white rounded-lg hover:bg-primary/90 transition-colors"
                >
                  <Plus className="w-4 h-4" />
                  <span>Add Item</span>
                </button>
              </div>

              <div className="grid gap-4">
                {menuItems.map((item) => (
                  <motion.div
                    key={item.id}
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="flex items-center justify-between p-4 border border-gray-200 rounded-xl hover:shadow-sm transition-shadow"
                  >
                    <div className="flex items-center space-x-4">
                      <img
                        src={item.image_url}
                        alt={item.name}
                        className="w-16 h-16 object-cover rounded-lg"
                      />
                      <div>
                        <h3 className="font-semibold text-gray-900">{item.name}</h3>
                        <p className="text-sm text-gray-600">${item.price}</p>
                        <p className="text-xs text-gray-500">{item.description}</p>
                      </div>
                    </div>
                    <div className="flex items-center space-x-2">
                      <button 
                        onClick={() => setEditingItem(item)}
                        className="p-2 text-gray-600 hover:text-primary transition-colors"
                      >
                        <Edit className="w-4 h-4" />
                      </button>
                      <button
                        onClick={() => handleDeleteMenuItem(item.id)}
                        className="p-2 text-gray-600 hover:text-red-600 transition-colors"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </div>
                  </motion.div>
                ))}
              </div>
            </div>
          )}

          {activeTab === 'categories' && (
            <div className="p-6">
              <div className="flex justify-between items-center mb-6">
                <h2 className="text-xl font-semibold text-gray-900">Categories</h2>
                <button
                  onClick={() => setShowAddCategory(true)}
                  className="flex items-center space-x-2 px-4 py-2 bg-primary text-white rounded-lg hover:bg-primary/90 transition-colors"
                >
                  <Plus className="w-4 h-4" />
                  <span>Add Category</span>
                </button>
              </div>

              <div className="grid gap-4">
                {categories.map((category) => (
                  <motion.div
                    key={category.id}
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="flex items-center justify-between p-4 border border-gray-200 rounded-xl hover:shadow-sm transition-shadow"
                  >
                    <div className="flex items-center space-x-4">
                      <div className="w-12 h-12 bg-gradient-to-r from-primary to-pink-500 rounded-xl flex items-center justify-center text-white font-bold">
                        {category.icon}
                      </div>
                      <div>
                        <h3 className="font-semibold text-gray-900">{category.name}</h3>
                        <p className="text-sm text-gray-600">Sort Order: {category.sort_order}</p>
                      </div>
                    </div>
                    <div className="flex items-center space-x-2">
                      <button 
                        onClick={() => setEditingCategory(category)}
                        className="p-2 text-gray-600 hover:text-primary transition-colors"
                      >
                        <Edit className="w-4 h-4" />
                      </button>
                      <button
                        onClick={() => handleDeleteCategory(category.id)}
                        className="p-2 text-gray-600 hover:text-red-600 transition-colors"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
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
    </div>
  )
}

// Add Menu Item Modal Component
interface AddMenuItemModalProps {
  categories: Category[]
  onClose: () => void
  onSubmit: (data: Omit<MenuItem, 'id' | 'created_at' | 'updated_at'>) => Promise<void>
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
    const fileExt = file.name.split('.').pop()
    const fileName = `${Math.random()}.${fileExt}`
    const filePath = `menu-items/${fileName}`

    const { error: uploadError } = await supabase.storage
      .from('menu-images')
      .upload(filePath, file)

    if (uploadError) {
      throw uploadError
    }

    const { data: { publicUrl } } = supabase.storage
      .from('menu-images')
      .getPublicUrl(filePath)

    return publicUrl
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
        price: parseFloat(formData.price),
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
        <div className="bg-gradient-to-r from-primary to-pink-500 p-6 text-white">
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
  onSubmit: (data: Omit<Category, 'id' | 'created_at'>) => Promise<void>
}

const AddCategoryModal: React.FC<AddCategoryModalProps> = ({ onClose, onSubmit }) => {
  const [formData, setFormData] = useState({
    name: '',
    icon: '',
    sort_order: 0,
  })

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    await onSubmit({
      ...formData,
      gradient: 'from-primary to-pink-500', // Default gradient for all categories
      sort_order: parseInt(formData.sort_order.toString()),
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
        <div className="bg-gradient-to-r from-primary to-pink-500 p-6 text-white">
          <h3 className="text-2xl font-bold">Add Category</h3>
          <p className="text-white/80 text-sm mt-1">Create a new menu category</p>
        </div>
        <div className="p-8 max-h-[80vh] overflow-y-auto">
        <form onSubmit={handleSubmit} className="space-y-4">
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
            <input
              id="category-icon"
              type="text"
              placeholder="🍽️"
              value={formData.icon}
              onChange={(e) => setFormData({ ...formData, icon: e.target.value })}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent"
              required
            />
          </div>
          

          
          <div>
            <label htmlFor="category-sort" className="block text-sm font-medium text-gray-700 mb-1">
              Sort Order *
            </label>
            <input
              id="category-sort"
              type="number"
              min="0"
              placeholder="1"
              value={formData.sort_order}
              onChange={(e) => setFormData({ ...formData, sort_order: parseInt(e.target.value) })}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent"
              required
            />
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
    category_id: item.category_id,
    dietary_tags: item.dietary_tags,
    is_popular: item.is_popular,
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
    const fileExt = file.name.split('.').pop()
    const fileName = `${Math.random()}.${fileExt}`
    const filePath = `menu-items/${fileName}`

    const { error: uploadError } = await supabase.storage
      .from('menu-images')
      .upload(filePath, file)

    if (uploadError) {
      throw uploadError
    }

    const { data: { publicUrl } } = supabase.storage
      .from('menu-images')
      .getPublicUrl(filePath)

    return publicUrl
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
        ...item,
        ...formData,
        price: parseFloat(formData.price),
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
        <div className="bg-gradient-to-r from-primary to-pink-500 p-6 text-white">
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
            <label htmlFor="edit-item-category" className="block text-sm font-medium text-gray-700 mb-1">
              Category *
            </label>
            <select
              id="edit-item-category"
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
    sort_order: category.sort_order,
  })

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    await onSubmit({
      ...category,
      ...formData,
      gradient: 'from-primary to-pink-500', // Default gradient for all categories
      sort_order: parseInt(formData.sort_order.toString()),
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
        <div className="bg-gradient-to-r from-primary to-pink-500 p-6 text-white">
          <h3 className="text-2xl font-bold">Edit Category</h3>
          <p className="text-white/80 text-sm mt-1">Update category details</p>
        </div>
        <div className="p-8 max-h-[80vh] overflow-y-auto">
        <form onSubmit={handleSubmit} className="space-y-4">
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
            <input
              id="edit-category-icon"
              type="text"
              placeholder="🍽️"
              value={formData.icon}
              onChange={(e) => setFormData({ ...formData, icon: e.target.value })}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent"
              required
            />
          </div>
          

          
          <div>
            <label htmlFor="edit-category-sort" className="block text-sm font-medium text-gray-700 mb-1">
              Sort Order *
            </label>
            <input
              id="edit-category-sort"
              type="number"
              min="0"
              placeholder="1"
              value={formData.sort_order}
              onChange={(e) => setFormData({ ...formData, sort_order: parseInt(e.target.value) })}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent"
              required
            />
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
        </div>
      </motion.div>
    </div>
  )
}

export default AdminDashboard 