import React from "react";
import { Box, Container, VStack } from "@chakra-ui/react";
import { Header } from "@/components/header/Header";
import { ImagePreview } from "@/components/image/ImagePreview";

const MainPage: React.FC = () => {
  return (
    <Box minH="100vh" bg="gray.50">
      <Header />
      <Container maxW="container.xl" py={8}>
        <VStack spacing={8} align="stretch">
          <ImagePreview />
        </VStack>
      </Container>
    </Box>
  );
};

export default MainPage;
