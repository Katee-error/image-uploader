import React from "react";
import {
  Box,
  Card,
  CardBody,
  CardHeader,
  Heading,
  SimpleGrid,
  VStack,
  Spinner,
  Text,
  Flex,
} from "@chakra-ui/react";
import { ProcessingStatus, Image as ImageType } from "@/types";
import { OptimizedImage } from "./OptimizedImage";
import { ImageDetails } from "./ImageDetails";


interface Props {
  image: ImageType;
}

export const ImageCard: React.FC<Props> = ({ image }) => {
  return (
    <Card>
      <CardHeader>
        <Heading size="md">Uploaded Image</Heading>
      </CardHeader>
      <CardBody>
        <SimpleGrid columns={{ base: 1, md: 2 }} spacing={8}>
          <Box>
            {image.processingStatus === ProcessingStatus.COMPLETED ? (
              <OptimizedImage
                imageId={image.id}
                originalName={image.originalName}
              />
            ) : (
              <Flex justify="center" align="center" minH="200px" bg="gray.100" borderRadius="md">
                {image.processingStatus === ProcessingStatus.PROCESSING ? (
                  <VStack>
                    <Spinner size="xl" />
                    <Text>Processing...</Text>
                  </VStack>
                ) : (
                  <Text>Processing failed or pending</Text>
                )}
              </Flex>
            )}
          </Box>
          <ImageDetails image={image} />
        </SimpleGrid>
      </CardBody>
    </Card>
  );
};
