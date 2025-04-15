import React from "react";
import { Image, Flex, Spinner, Text } from "@chakra-ui/react";
import { ProcessingStatus } from "@/types/image";
import { useOptimizedImage } from "@/hooks/useOptimazedImage"; // убедись, что путь правильный

interface Props {
  imageId: string;
  originalName: string;
  status: ProcessingStatus;
}

export const OptimizedImage: React.FC<Props> = ({ imageId, originalName, status }) => {
  const isReady = status === ProcessingStatus.COMPLETED;
  const { imageUrl, isLoading, error } = useOptimizedImage(imageId, isReady);

  if (isLoading) {
    return (
      <Flex justify="center" align="center" height="200px">
        <Spinner size="xl" color="brand.500" />
      </Flex>
    );
  }

  if (error || !imageUrl) {
    return (
      <Flex justify="center" align="center" height="200px" bg="gray.100" borderRadius="md">
        <Text color="red.500">{error || 'Failed to load optimized image'}</Text>
      </Flex>
    );
  }

  return (
    <Image
      key={imageUrl} // использование key гарантирует перерисовку <img>, когда URL меняется
      src={imageUrl}
      alt={`Optimized: ${originalName}`}
      borderRadius="md"
      objectFit="cover"
      width="100%"
      height="auto"
      maxH="400px"
    />
  );
};



