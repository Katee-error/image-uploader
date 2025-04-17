import React from "react";
import { VStack, HStack, Text, Heading, Badge } from "@chakra-ui/react";
import { Image } from "../../types/image";
import { formatDate } from "@/utils/formatData";
import { getStatusStyles } from "@/services/status-service";

export const ImageDetails: React.FC<{ image: Image }> = ({ image }) => {
  const statusStyles = getStatusStyles(image.processingStatus);
  return (
    <VStack align="start" spacing={4}>
      <Heading size="sm" fontWeight="500">
        Image Details
      </Heading>
      <HStack>
        <Text fontWeight="bold">Status:</Text>
        <Badge p='5px' bg={statusStyles.bg} color={statusStyles.color}>
          {image.processingStatus}
        </Badge>
      </HStack>
      <HStack>
        <Text fontWeight="700">Name:</Text>
        <Text color="gray.600" fontWeight="500">
          {image.originalName}
        </Text>
      </HStack>
      {image.dimensions && (
        <HStack>
          <Text fontWeight="bold">Size:</Text>
          <Text color="gray.600" fontWeight="500">
            {image.dimensions.width} x {image.dimensions.height}
          </Text>
        </HStack>
      )}
      <HStack>
        <Text fontWeight="bold">Uploaded:</Text>
        <Text color="gray.600" fontWeight="500">
          {formatDate(image.uploadDate)}
        </Text>
      </HStack>
    </VStack>
  );
};
