import React from 'react';
import {
  Box,
  Container,
  Flex,
  Heading,
  useColorModeValue,
  Tab,
  TabList,
  TabPanel,
  TabPanels,
  Tabs,
} from '@chakra-ui/react';
import { LoginForm } from '@/components/auth-form/LoginForm';
import { RegisterForm } from '@/components/auth-form/RegisterForm';


const AuthPage: React.FC = () => {
  const bgColor = useColorModeValue('white', 'gray.800');
  const borderColor = useColorModeValue('gray.200', 'gray.700');

  return (
    <Flex minH="100vh" align="center" justify="center" bg="gray.50">
      <Container maxW="md" py={12}>
        <Box
          bg={bgColor}
          p={8}
          borderRadius="lg"
          boxShadow="lg"
          borderWidth="1px"
          borderColor={borderColor}
        >
          <Heading as="h1" size="xl" textAlign="center" mb={8} color="brand.600">
            Image Processing App
          </Heading>

          <Tabs isFitted variant="enclosed" colorScheme="brand">
            <TabList mb="1em">
              <Tab>Login</Tab>
              <Tab>Register</Tab>
            </TabList>
            <TabPanels>
              <TabPanel>
                <LoginForm />
              </TabPanel>
              <TabPanel>
                <RegisterForm />
              </TabPanel>
            </TabPanels>
          </Tabs>
        </Box>
      </Container>
    </Flex>
  );
};

export default AuthPage