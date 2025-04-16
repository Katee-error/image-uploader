import React from "react";
import {
  VStack,
  HStack,
  Text,
  Heading,
  Badge,
} from "@chakra-ui/react";
import { Image } from "../../types/image";
import { formatDate } from "@/utils/formatData";
import { getStatusColor } from "@/services/status-service";

export const ImageDetails: React.FC<{ image: Image }> = ({ image }) => (
  <VStack align="start" spacing={4}>
    <Heading size="sm">Image Details</Heading>
    <HStack>
      <Text fontWeight="bold">Status:</Text>
      <Badge colorScheme={getStatusColor(image.processingStatus)}>
        {image.processingStatus}
      </Badge>
    </HStack>
    <HStack>
      <Text fontWeight="bold">Name:</Text>
      <Text>{image.originalName}</Text>
    </HStack>
    {image.dimensions && (
      <HStack>
        <Text fontWeight="bold">Size:</Text>
        <Text>
          {image.dimensions.width} x {image.dimensions.height}
        </Text>
      </HStack>
    )}
    <HStack>
      <Text fontWeight="bold">Uploaded:</Text>
      <Text>{formatDate(image.uploadDate)}</Text>
    </HStack>
  </VStack>
);
