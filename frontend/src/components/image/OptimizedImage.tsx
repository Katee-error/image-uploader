import React, { useEffect, useState} from "react";
import { Image as ChakraImage, Flex, Spinner, Text, useToast } from "@chakra-ui/react";
import { getOptimizedImage } from "@/services/image-service";

export const OptimizedImage: React.FC<{ imageId: string; originalName: string }> = ({
  imageId,
  originalName,
}) => {
  const [url, setUrl] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const toast = useToast();

  useEffect(() => {
    let objectUrl: string | null = null;

    const fetchImage = async () => {
      setLoading(true);
      try {
        const res = await getOptimizedImage(imageId);
        objectUrl = res;
        setUrl(res);
      } catch (err) {
        const message =
          err instanceof Error ? err.message : "Failed to load image";
        setError(message);
        toast({
          title: "Error",
          description: message,
          status: "error",
        });
      } finally {
        setLoading(false);
      }
    };

    fetchImage();

    return () => {
      if (objectUrl) {
        URL.revokeObjectURL(objectUrl);
      }
    };
  }, [imageId, toast]);

  if (loading) {
    return (
      <Flex justify="center" align="center" height="200px">
        <Spinner size="xl" color="brand.500" />
      </Flex>
    );
  }

  if (error || !url) {
    return (
      <Flex
        justify="center"
        align="center"
        height="200px"
        bg="gray.100"
        borderRadius="md"
      >
        <Text color="red.500">{error || "No image found"}</Text>
      </Flex>
    );
  }

  return (
    <ChakraImage
      src={url}
      alt={`Optimized: ${originalName}`}
      borderRadius="md"
      objectFit="cover"
      width="100%"
      maxH="400px"
    />
  );
};
