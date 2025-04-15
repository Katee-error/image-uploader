import React from "react";
import { Box, Container, VStack } from "@chakra-ui/react";
import ImageUploader from "@/components/image/ImageUploader";
import ImagePreview from "@/components/image/ImagePreview";
import { Header } from "@/components/header/Header";

const MainPage: React.FC = () => {
  return (
    <Box minH="100vh" bg="gray.50">
      <Header />
      <Container maxW="container.xl" py={8}>
        <VStack spacing={8} align="stretch">
          <ImageUploader />
          <ImagePreview />
        </VStack>
      </Container>
    </Box>
  );
};

export default MainPage;
