import { useDropzone } from "react-dropzone";
import { useToast } from "@chakra-ui/react";
import { useState } from "react";
import { uploadImage } from "@/services/image-service";
import { Image } from "@/types";

export const useImageUpload = () => {
  const toast = useToast();
  const [isUploading, setIsUploading] = useState(false);
  const [currentImage, setCurrentImage] = useState<Image | null>(null);

  const dropzone = useDropzone({
    accept: { "image/*": [".jpeg", ".jpg", ".png", ".gif", ".webp"] },
    maxFiles: 1,
    onDrop: async (files) => {
      if (files.length === 0) return;

      setIsUploading(true);
      try {
        const result = await uploadImage(files[0]);

        if (
          !result ||
          typeof result !== 'object' ||
          !('image' in result) ||
          typeof result.image !== 'object' ||
          !result.image?.id
        ) {
          console.error("[❌] Invalid server response:", result);
          throw new Error("Image info not returned from server");
        }

        toast({
          title: "Uploaded",
          description: "Your image is being processed",
          status: "success",
          isClosable: true,
          containerStyle: {bgColor: "#0A7F08", color: '#ffffff',  borderRadius: "md",},

        });

        setCurrentImage(result.image);
      } catch (error: any) {
        console.error("[❌] Upload error:", error);
        toast({
          title: "Upload failed",
          description: error?.response?.data?.message || error.message || "Unknown error",
          status: "error",
          isClosable: true,
          containerStyle: {bgColor: "#FA0C0C", color: '#ffffff',  borderRadius: "md",}
        });
      } finally {
        setIsUploading(false);
      }
    },
  });

  return { ...dropzone, isUploading, currentImage };
};
