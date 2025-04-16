import { useState, useEffect } from "react";
import { Image } from "@/types";
import { websocketService } from "@/services/websockets-service";

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
