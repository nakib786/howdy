import React, { useState, useEffect } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { X } from 'lucide-react'
import { supabase, type PromoPoster } from '../lib/supabase'

interface PromoPosterLightboxProps {
  isVisible: boolean
  onClose: () => void
  onDontShowAgain: () => void
}

const PromoPosterLightbox: React.FC<PromoPosterLightboxProps> = ({ isVisible, onClose, onDontShowAgain }) => {
  const [activePoster, setActivePoster] = useState<PromoPoster | null>(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const loadActivePoster = async () => {
      try {
        setLoading(true)
        const now = new Date().toISOString()
        
        // Check for any errors in poster loading (for debugging)
        const { error: allError } = await supabase
          .from('promo_posters')
          .select('*')
          .order('created_at', { ascending: false })
        
        if (allError) {
          console.error('Error loading all posters:', allError)
        }
        
        // Now check for active posters
        // First try to find posters with date restrictions that are currently valid
        let { data, error } = await supabase
          .from('promo_posters')
          .select('*')
          .eq('is_active', true)
          .lte('start_date', now)
          .gte('end_date', now)
          .order('created_at', { ascending: false })
          .limit(1)
        
        // If no date-restricted posters found, look for active posters without date restrictions
        if (!data || data.length === 0) {
          const { data: announcementData, error: announcementError } = await supabase
            .from('promo_posters')
            .select('*')
            .eq('is_active', true)
            .is('start_date', null)
            .is('end_date', null)
            .order('created_at', { ascending: false })
            .limit(1)
          
          if (announcementError) {
            console.error('Error loading announcement posters:', announcementError)
          } else {
            data = announcementData
            error = announcementError
          }
        }
        
        if (error) {
          console.error('Error loading active poster:', error)
          return
        }
        
        if (data && data.length > 0) {
          setActivePoster(data[0])
        }
      } catch (error) {
        console.error('Error loading active poster:', error)
      } finally {
        setLoading(false)
      }
    }

    if (isVisible) {
      loadActivePoster()
    }
  }, [isVisible])

  if (!isVisible || loading || !activePoster) {
    return null
  }

  return (
    <AnimatePresence>
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        className="fixed inset-0 bg-black/80 backdrop-blur-sm flex items-center justify-center p-4 z-50"
        onClick={onClose}
      >
        <motion.div
          initial={{ scale: 0.9, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          exit={{ scale: 0.9, opacity: 0 }}
          transition={{ type: "spring", damping: 25, stiffness: 300 }}
          className="relative max-w-4xl w-full max-h-[90vh] bg-white rounded-3xl overflow-hidden shadow-2xl"
          onClick={(e) => e.stopPropagation()}
        >
          {/* Close Button */}
          <button
            onClick={onClose}
            className="absolute top-4 right-4 z-10 p-2 bg-white/90 backdrop-blur-sm rounded-full text-gray-600 hover:text-gray-900 transition-colors hover:bg-white"
          >
            <X className="w-6 h-6" />
          </button>

          {/* Poster Image */}
          <div className="relative">
            <img
              src={activePoster.image_url}
              alt={activePoster.title}
              className="w-full h-auto max-h-[70vh] object-contain"
            />
            
            {/* Overlay with title and description */}
            <div className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-black/80 via-black/40 to-transparent p-6">
              <h2 className="text-2xl sm:text-3xl font-bold text-white mb-2">
                {activePoster.title}
              </h2>
              {activePoster.description && (
                <p className="text-white/90 text-sm sm:text-base">
                  {activePoster.description}
                </p>
              )}
            </div>
          </div>

          {/* Footer with close buttons */}
          <div className="p-6 bg-gray-50">
            <div className="flex flex-col sm:flex-row justify-between items-center space-y-3 sm:space-y-0">
              <div className="flex flex-col sm:flex-row items-center space-y-2 sm:space-y-0 sm:space-x-4">
                <p className="text-sm text-gray-600">
                  {activePoster.end_date 
                    ? `Valid until ${new Date(activePoster.end_date).toLocaleDateString()}`
                    : 'Announcement - No expiration date'
                  }
                </p>
                <button
                  onClick={onDontShowAgain}
                  className="text-sm text-gray-500 hover:text-gray-700 underline"
                >
                  Don't show again
                </button>
              </div>
              <button
                onClick={onClose}
                className="px-6 py-2 bg-primary text-white rounded-lg hover:bg-primary/90 transition-colors font-medium"
              >
                Close
              </button>
            </div>
          </div>
        </motion.div>
      </motion.div>
    </AnimatePresence>
  )
}

export default PromoPosterLightbox
