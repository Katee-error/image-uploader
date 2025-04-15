import {api} from '../api';
import { Image } from '@/types/image';

export const getImageById = async (id: string): Promise<Image | null> => {
  const response = await api.get<{ success: boolean; image: Image }>(`/${id}`);
  return response.data?.success ? response.data.image : null;
};
