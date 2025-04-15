import { getOptimizedImage } from '@/services/image-service';
import { useEffect, useState } from 'react';

export const useOptimizedImage = (imageId: string, enabled = true) => {
  const [imageUrl, setImageUrl] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // Каждый раз, когда imageId или enabled изменяется, сбрасываем предыдущий optimized URL.
  useEffect(() => {
    setImageUrl(null);
  }, [imageId, enabled]);

  useEffect(() => {
    if (!imageId || !enabled) return;

    let isCancelled = false;

    const fetchImage = async () => {
      setIsLoading(true);
      setError(null);

      try {
        const url = await getOptimizedImage(imageId);
        if (!isCancelled) {
          setImageUrl(url);
        }
      } catch (err) {
        console.error('[❌] Error loading optimized image:', err);
        if (!isCancelled) {
          setError('Failed to load optimized image');
        }
      } finally {
        if (!isCancelled) {
          setIsLoading(false);
        }
      }
    };

    fetchImage();

    return () => {
      isCancelled = true;
    };
  }, [imageId, enabled]);

  return { imageUrl, isLoading, error };
};
