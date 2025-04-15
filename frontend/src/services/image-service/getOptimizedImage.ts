import {api} from '../api';

export const getOptimizedImage = async (id: string): Promise<string> => {
  const response = await api.get(`/${id}/optimized`, { responseType: 'blob' });

  const blob = new Blob([response.data], {
    type: response.headers['content-type'] || 'image/webp',
  });

  const url = URL.createObjectURL(blob);
  console.log('[✔] Created blob URL:', url); 
  return url;
};
