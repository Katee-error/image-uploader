import React from 'react';
import { VStack, FormControl, FormLabel, Input, FormErrorMessage, Button } from '@chakra-ui/react';
import { useRegister } from '@/hooks'

export const RegisterForm: React.FC = () => {
  const { formMethods, onSubmit, isLoading } = useRegister();

  return (
    <form onSubmit={formMethods.handleSubmit(onSubmit)}>
      <VStack spacing={4}>
        <FormControl isInvalid={!!formMethods.formState.errors.email}>
          <FormLabel htmlFor="register-email">Email</FormLabel>
          <Input
            id="register-email"
            type="email"
            {...formMethods.register('email', {
                required: 'Email is required',
              pattern: {
                value: /^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}$/i,
                message: 'Invalid email address',
              },
            })}
          />
          <FormErrorMessage>{formMethods.formState.errors.email?.message}</FormErrorMessage>
        </FormControl>

        <FormControl isInvalid={!!formMethods.formState.errors.password}>
          <FormLabel htmlFor="register-password">Password</FormLabel>
          <Input
            id="register-password"
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

        <FormControl isInvalid={!!formMethods.formState.errors.confirmPassword}>
          <FormLabel htmlFor="register-confirm-password">Confirm password</FormLabel>
          <Input
            id="register-confirm-password"
            type="password"
            {...formMethods.register('confirmPassword', {
                required: 'Please confirm your password',
              validate: (value) =>
                value === formMethods.getValues('password') || 'Passwords don`t match',
            })}
          />
          <FormErrorMessage color='red'>{formMethods.formState.errors.confirmPassword?.message}</FormErrorMessage>
        </FormControl>

        <Button
          type="submit"
          colorScheme="brand"
          width="full"
          mt={4}
          isLoading={isLoading}
          loadingText="Registering..."
        >
          Register
        </Button>
      </VStack>
    </form>
  );
};

