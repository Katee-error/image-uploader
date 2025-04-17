import React from "react";
import { Box, Flex, Heading, Text, Button, HStack, Avatar, Popover, PopoverTrigger, PopoverContent, PopoverArrow, PopoverBody, useDisclosure } from "@chakra-ui/react";
import { FiLogOut } from "react-icons/fi";
import { useAuth } from "@/context/AuthContext";


export const Header = () => {
  const { user, logout } = useAuth();
  const { onOpen, onClose, isOpen } = useDisclosure();

  return (
    <Box  py={4} px={8} boxShadow="md" >
      <Flex
        justify="space-between"
        align="center"
        maxW="container.xl"
        mx="auto"
      >
        <Heading as="h1" size="md">
          Image Processing App
        </Heading>
        <HStack spacing={4}>
          <Popover
            isOpen={isOpen}
            onOpen={onOpen}
            onClose={onClose}
            placement="bottom-end"
          >
            <PopoverTrigger>
              <Avatar
                w="36px"
                h="36px"
                cursor="pointer"
                name={user?.email}
              />
            </PopoverTrigger>
            <PopoverContent
              w="fit-content"
              bg="gray.700"
              color="white"
              border="none"
              boxShadow="lg"
            >
              <PopoverArrow bg="gray.700" />
              <PopoverBody fontSize="sm" px={4} py={2}>
                {user?.email || "No email"}
              </PopoverBody>
            </PopoverContent>
          </Popover>

          <Button leftIcon={<FiLogOut />} variant="outline" onClick={logout}>
            Logout
          </Button>
        </HStack>
      </Flex>
    </Box>
  );
};

