import { useState, useEffect } from "react";
import { Image } from "../types/image";
import websocketService from "../services/websocketService";

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
  const [image, setImage] = useState<Image | undefined>(initialImage);

  useEffect(() => {
    if (initialImage && initialImage.id !== image?.id) {
      setImage(initialImage);
    }
  }, [initialImage, image?.id]);

  useEffect(() => {
    if (!imageId) return;

    websocketService.connect();

    const unsubscribe = websocketService.subscribeToImageUpdates(
      imageId,
      (updatedImage) => {
        setImage(updatedImage);
      }
    );

    return () => {
      unsubscribe();
    };
  }, [imageId]);

  return image;
};
