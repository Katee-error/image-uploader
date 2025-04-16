import React, { useEffect, useState } from "react";
import { Image, Flex, Spinner, Text } from "@chakra-ui/react";
import { ProcessingStatus, Image as ImageType } from "@/types/image";
import { useOptimizedImage } from "@/hooks/useOptimazedImage";
import { useImageUpdates } from "@/hooks/useImageUpdates";

interface Props {
  imageId: string;
  originalName: string;
  status: ProcessingStatus;
}

export const OptimizedImage: React.FC<Props> = ({ imageId, originalName, status: initialStatus }) => {
  // Get real-time updates for the image
  const updatedImage = useImageUpdates(imageId);
  
  // Use the updated status if available, otherwise use the initial status
  const status = updatedImage?.processingStatus || initialStatus;
  const isReady = status === ProcessingStatus.COMPLETED;
  
  // Get the optimized image URL
  const { imageUrl, isLoading, error } = useOptimizedImage(imageId, isReady);

  // Show processing state
  if (status === ProcessingStatus.PROCESSING) {
    return (
      <Flex direction="column" justify="center" align="center" height="200px" bg="gray.100" borderRadius="md">
        <Spinner size="xl" color="brand.500" mb={4} />
        <Text>Processing image...</Text>
      </Flex>
    );
  }

  // Show loading state
  if (isLoading) {
    return (
      <Flex justify="center" align="center" height="200px">
        <Spinner size="xl" color="brand.500" />
      </Flex>
    );
  }

  // Show error state
  if (error || !imageUrl) {
    return (
      <Flex justify="center" align="center" height="200px" bg="gray.100" borderRadius="md">
        <Text color="red.500">{error || 'Failed to load optimized image'}</Text>
      </Flex>
    );
  }

  // Show failed state
  if (status === ProcessingStatus.FAILED) {
    return (
      <Flex justify="center" align="center" height="200px" bg="gray.100" borderRadius="md">
        <Text color="red.500">Image processing failed</Text>
      </Flex>
    );
  }

  // Show the optimized image
  return (
    <Image
      src={`${imageUrl}#${Date.now()}`} // Add cache-busting fragment
      alt={`Optimized: ${originalName}`}
      borderRadius="md"
      objectFit="cover"
      width="100%"
      height="auto"
      maxH="400px"
    />
  );
};
