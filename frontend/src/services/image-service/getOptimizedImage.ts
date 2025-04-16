import { api } from '../api';

export const getOptimizedImage = async (imageId: string) => {
  const timestamp = Date.now();
  
  const response = await api.get(`/${imageId}/optimized`, {
    responseType: 'blob',
    params: { cacheBust: timestamp },
    headers: {
      'Cache-Control': 'no-cache, no-store, must-revalidate',
      'Pragma': 'no-cache',
      'Expires': '0'
    }
  });

  const blob = new Blob([response.data], {
    type: response.headers['content-type'] || 'image/webp',
  });

  const url = URL.createObjectURL(blob);
  console.log('[✔] Created blob URL:', url, 'at timestamp:', timestamp);
  return url;
};