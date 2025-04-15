import React from "react";
import {
  Badge,
  Card,
  CardBody,
  CardHeader,
  Flex,
  Heading,
  HStack,
  SimpleGrid,
  Spinner,
  Text,
  VStack,
} from "@chakra-ui/react";
import { ProcessingStatus } from "@/types/image";
import { useLastImage } from "@/hooks/useLastImage";
import { useImageUpdates } from "@/hooks/useImageUpdates";
import { OptimizedImage } from "./OptimizedImage";

const ImagePreview: React.FC = () => {
  const { image, isLoading } = useLastImage();
  const updatedImage = useImageUpdates(image?.id || "", image || undefined);
  const activeImage = updatedImage || image;

  const getStatusColor = (status: ProcessingStatus) => {
    switch (status) {
      case ProcessingStatus.COMPLETED:
        return "green";
      case ProcessingStatus.PROCESSING:
        return "blue";
      case ProcessingStatus.PENDING:
        return "yellow";
      case ProcessingStatus.FAILED:
        return "red";
      default:
        return "gray";
    }
  };

  const formatDate = (dateString: string) =>
    new Date(dateString).toLocaleString() || "Unknown";

  return (
    <Card>
      <CardHeader>
        <Heading size="md">Image Upload & Processing</Heading>
      </CardHeader>
      <CardBody>
        {isLoading ? (
          <Flex justify="center" py={10}>
            <Spinner size="xl" />
          </Flex>
        ) : activeImage ? (
          <SimpleGrid columns={{ base: 1, md: 2 }} spacing={8}>
            <Flex justify="center" align="center" minH="200px">
              {activeImage.processingStatus === ProcessingStatus.COMPLETED ? (
                <OptimizedImage
                  imageId={activeImage.id}
                  originalName={activeImage.originalName}
                  status={activeImage.processingStatus}
                />
              ) : activeImage.processingStatus === ProcessingStatus.PROCESSING ? (
                <VStack>
                  <Spinner size="xl" color="blue.500" />
                  <Text>Processing image...</Text>
                </VStack>
              ) : activeImage.processingStatus === ProcessingStatus.PENDING ? (
                <Text>Image is queued for processing...</Text>
              ) : (
                <Text color="red.500">Processing failed.</Text>
              )}
            </Flex>

            <VStack align="start" spacing={4}>
              <Heading size="sm">Image Details</Heading>
              <HStack>
                <Text fontWeight="bold">Status:</Text>
                <Badge colorScheme={getStatusColor(activeImage.processingStatus)}>
                  {activeImage.processingStatus}
                </Badge>
              </HStack>
              <HStack>
                <Text fontWeight="bold">Original Name:</Text>
                <Text>{activeImage.originalName}</Text>
              </HStack>
              {activeImage.dimensions && (
                <HStack>
                  <Text fontWeight="bold">Dimensions:</Text>
                  <Text>
                    {activeImage.dimensions.width} × {activeImage.dimensions.height}
                  </Text>
                </HStack>
              )}
              <HStack>
                <Text fontWeight="bold">Upload Date:</Text>
                <Text>{formatDate(activeImage.uploadDate)}</Text>
              </HStack>
            </VStack>
          </SimpleGrid>
        ) : (
          <Flex justify="center" p={10}>
            <Text>No uploaded image found</Text>
          </Flex>
        )}
      </CardBody>
    </Card>
  );
};

export default ImagePreview;

