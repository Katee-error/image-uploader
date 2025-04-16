import { useEffect, useState, useRef } from 'react';
import { getOptimizedImage } from '@/services/image-service';

export const useOptimizedImage = (imageId: string, enabled = true) => {
  const [imageUrl, setImageUrl] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const previousStatusRef = useRef<boolean>(false);

  useEffect(() => {
    // Check if the enabled status changed from false to true
    const statusChanged = enabled && !previousStatusRef.current;
    previousStatusRef.current = enabled;
    
    if (!imageId || !enabled) {
      // If not enabled, clear the image URL to force a refresh when it becomes enabled
      if (imageUrl) {
        URL.revokeObjectURL(imageUrl);
        setImageUrl(null);
      }
      return;
    }
    
    // Always fetch when enabled changes to true or when imageId changes
    let isCancelled = false;
    setIsLoading(true);
    setError(null);
    
    const fetchImage = async () => {
      try {
        // Clear previous image if exists
        if (imageUrl) {
          URL.revokeObjectURL(imageUrl);
        }
        
        const url = await getOptimizedImage(imageId);
        
        if (!isCancelled) {
          setImageUrl(url);
        }
      } catch (err) {
        if (!isCancelled) {
          console.error("Error loading image:", err);
          setError("Failed to load optimized image");
        }
      } finally {
        if (!isCancelled) setIsLoading(false);
      }
    };
    
    fetchImage();
    
    return () => {
      isCancelled = true;
      if (imageUrl) {
        URL.revokeObjectURL(imageUrl);
      }
    };
  }, [imageId, enabled]); // Remove imageUrl dependency to ensure it always fetches when enabled changes
  
  return { imageUrl, isLoading, error };
};
