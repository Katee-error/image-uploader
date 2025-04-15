import { useDropzone } from "react-dropzone";
import { useToast } from "@chakra-ui/react";
import { useState } from "react";
import { useLastImage } from "./useLastImage";
import { uploadImage } from "@/services/image-service";

export const useImageUpload = () => {
  const toast = useToast();
  const { setImage } = useLastImage();
  const [isUploading, setIsUploading] = useState(false);

  const dropzone = useDropzone({
    accept: { "image/*": [".jpeg", ".jpg", ".png", ".gif", ".webp"] },
    maxFiles: 1,
    onDrop: async (files) => {
      if (files.length === 0) return;

      setIsUploading(true);
      try {
        const result = await uploadImage(files[0]);

        toast({
          title: "Uploaded",
          description: "Your image is being processed",
          status: "success",
        });

        if (result.image) {
          setImage(null);
          setImage(result.image);
        }
      } catch (error: any) {
        console.error("[❌] Upload error:", error);
        toast({
          title: "Upload failed",
          description: error.message || "Unknown error",
          status: "error",
        });
      } finally {
        setIsUploading(false);
      }
    },
  });

  return { ...dropzone, isUploading };
};
