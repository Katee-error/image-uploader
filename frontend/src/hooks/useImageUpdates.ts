import { useState, useEffect } from 'react';
import { Image } from '../types/image';
import websocketService from '../services/websocketService';

/**
 * Custom hook to subscribe to real-time updates for an image
 * @param imageId The ID of the image to subscribe to updates for
 * @param initialImage Optional initial image data
 * @returns The latest image data
 */
export const useImageUpdates = (
  imageId: string, 
  initialImage?: Image
): Image | undefined => {
  // Инициализируем состояние initialImage (если оно имеется)
  const [image, setImage] = useState<Image | undefined>(initialImage);

  // Обновление состояния при изменении initialImage, только если id отличается от текущего
  useEffect(() => {
    if (initialImage && initialImage.id !== image?.id) {
      setImage(initialImage);
    }
    // Добавляем зависимость image?.id для сравнения — если он не меняется, вызов не происходит.
  }, [initialImage, image?.id]);

  // Подписка на обновления через веб-сокеты по imageId
  useEffect(() => {
    if (!imageId) return;

    websocketService.connect();

    const unsubscribe = websocketService.subscribeToImageUpdates(imageId, (updatedImage) => {
      // Обновляем состояние только если пришёл новый image (по id)
      if (updatedImage.id !== image?.id) {
        setImage(updatedImage);
      }
    });

    return () => {
      unsubscribe();
    };
  }, [imageId, image?.id]);

  return image;
};
