import { api } from '../api';

export const getOptimizedImage = async (imageId: string) => {
  // Generate a unique timestamp for cache busting
  const timestamp = Date.now();
  
  try {
    console.log(`Fetching optimized image for ID: ${imageId} with timestamp: ${timestamp}`);
    
    const response = await api.get(`/${imageId}/optimized`, {
      responseType: 'blob',
      params: { cacheBust: timestamp },
      headers: {
        'Cache-Control': 'no-cache, no-store, must-revalidate',
        'Pragma': 'no-cache',
        'Expires': '0'
      }
    });

    // Revoke any existing object URLs for this image ID to prevent memory leaks
    // This is a simple approach - in a production app you might want to use a more sophisticated cache
    if (window._imageUrlCache && window._imageUrlCache[imageId]) {
      URL.revokeObjectURL(window._imageUrlCache[imageId]);
      console.log(`Revoked previous blob URL for image ID: ${imageId}`);
    }

    // Initialize the cache if it doesn't exist
    if (!window._imageUrlCache) {
      window._imageUrlCache = {};
    }

    const blob = new Blob([response.data], {
      type: response.headers['content-type'] || 'image/webp',
    });

    const url = URL.createObjectURL(blob);
    
    // Store the URL in our cache
    window._imageUrlCache[imageId] = url;
    
    console.log(`[✔] Created new blob URL: ${url} for image ID: ${imageId} at timestamp: ${timestamp}`);
    return url;
  } catch (error) {
    console.error(`[✘] Error fetching optimized image for ID: ${imageId}:`, error);
    throw error;
  }
};

// Add TypeScript declaration for our global cache
declare global {
  interface Window {
    _imageUrlCache?: Record<string, string>;
  }
}
