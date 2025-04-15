import React from "react";
import { Box, Flex, Heading, Text, Button, HStack } from "@chakra-ui/react";
import { FiLogOut } from "react-icons/fi";
import { useAuth } from "@/context/AuthContext";
export const Header: React.FC = () => {
  const { user, logout } = useAuth();
  return (
    <Box bg="brand.600" color="white" py={4} px={8} boxShadow="md">
      <Flex
        justify="space-between"
        align="center"
        maxW="container.xl"
        mx="auto"
      >
        <Heading as="h1" size="lg">
          Image Processing App
        </Heading>
        <HStack spacing={4}>
          <Text>Welcome, {user?.email}</Text>
          <Button
            leftIcon={<FiLogOut />}
            variant="outline"
            colorScheme="whiteAlpha"
            onClick={logout}
          >
            Logout
          </Button>
        </HStack>
      </Flex>
    </Box>
  );
};
