import React from 'react';
import { VStack, FormControl, FormLabel, Input, FormErrorMessage, Button } from '@chakra-ui/react';
import { useLogin } from '@/hooks';

export const LoginForm: React.FC = () => {
  const { formMethods, onSubmit, isLoading } = useLogin();

  return (
    <form onSubmit={formMethods.handleSubmit(onSubmit)}>
      <VStack spacing={4}>
        <FormControl isInvalid={!!formMethods.formState.errors.email}>
          <FormLabel htmlFor="login-email">Email</FormLabel>
          <Input
            id="login-email"
            type="email"
            {...formMethods.register('email', {
              required: 'Email is required',
              pattern: {
                value: /^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}$/i,
                message: 'Неверный формат email',
              },
            })}
          />
          <FormErrorMessage>{formMethods.formState.errors.email?.message}</FormErrorMessage>
        </FormControl>

        <FormControl isInvalid={!!formMethods.formState.errors.password}>
          <FormLabel htmlFor="login-password">Password</FormLabel>
          <Input
            id="login-password"
            type="password"
            {...formMethods.register('password', {
              required: 'Password is required',
              minLength: {
                value: 6,
                message: 'Password must be at least 6 characters',
                
              },
            })}
          />
          <FormErrorMessage color='red'>{formMethods.formState.errors.password?.message}</FormErrorMessage>
        </FormControl>

        <Button
          type="submit"
          colorScheme="brand"
          width="full"
          mt={4}
          isLoading={isLoading}
          loadingText="Login..."
        >
          Login
        </Button>
      </VStack>
    </form>
  );
};

