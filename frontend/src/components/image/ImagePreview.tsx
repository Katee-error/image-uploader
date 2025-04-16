import React from "react";
import { Container, VStack } from "@chakra-ui/react";
import { useImageUpload } from "@/hooks/useImageUpload";
import { useImageUpdates } from "@/hooks/useImageUpdates";
import { ImageDropzone } from "./ImageDropzone";
import { ImageCard } from "./ImageCard";

export const ImagePreview: React.FC = () => {
  const {
    getRootProps,
    getInputProps,
    isDragActive,
    isUploading,
    currentImage,
  } = useImageUpload();

  const updatedImage = useImageUpdates(
    currentImage?.id || "",
    currentImage || undefined
  );
  const image = updatedImage;

  return (
    <Container maxW="6xl" py={8}>
      <VStack spacing={8} align="stretch">
        <ImageDropzone
          getRootProps={getRootProps}
          getInputProps={getInputProps}
          isDragActive={isDragActive}
          isUploading={isUploading}
        />

        {image && <ImageCard image={image} />}
      </VStack>
    </Container>
  );
};
