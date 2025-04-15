
import { useEffect, useState, useCallback } from 'react';
import { useToast } from '@chakra-ui/react';
import { Image } from '@/types/image';
import { useImageUpdates } from './useImageUpdates';
import { getUserLastImage } from '@/services/image-service';

export const useLastImage = () => {
  const [image, setImage] = useState<Image | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const toast = useToast();

  const updatedImage = useImageUpdates(image?.id || '', image || undefined);

  useEffect(() => {
    if (updatedImage) {
      setImage(updatedImage);
    }
  }, [updatedImage]);

  const fetchLastImage = useCallback(async () => {
    try {
      setIsLoading(true);
      setImage(null); 
      const last = await getUserLastImage();
      if (last) {
        setImage(last);
      }
    } catch (error) {
      console.error('Error fetching image:', error);
      toast({
        title: 'Error',
        description: 'Failed to load last image',
        status: 'error',
        duration: 5000,
        isClosable: true,
      });
    } finally {
      setIsLoading(false);
    }
  }, [toast]);
  
  useEffect(() => {
    fetchLastImage();
  }, [fetchLastImage]);

  return {
    image,
    setImage,
    isLoading,
    refreshImage: fetchLastImage,
  };
};
