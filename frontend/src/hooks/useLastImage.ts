
import { useEffect, useState, useCallback, useRef } from 'react';
import { useToast } from '@chakra-ui/react';
import { Image, ProcessingStatus } from '@/types/image';
import { useImageUpdates } from './useImageUpdates';
import { getUserLastImage } from '@/services/image-service';

export const useLastImage = () => {
  const [image, setImage] = useState<Image | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const toast = useToast();
  const previousStatusRef = useRef<ProcessingStatus | null>(null);

  const updatedImage = useImageUpdates(image?.id || '', image || undefined);

  useEffect(() => {
    if (updatedImage) {
      // Check if processing status changed to COMPLETED
      const statusChanged = 
        previousStatusRef.current !== ProcessingStatus.COMPLETED && 
        updatedImage.processingStatus === ProcessingStatus.COMPLETED;
      
      // Update the previous status reference
      previousStatusRef.current = updatedImage.processingStatus;
      
      // Update the image state
      setImage(updatedImage);
      
      // If status changed to COMPLETED, log it
      if (statusChanged) {
        console.log('Image processing completed, updating image:', updatedImage);
      }
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
