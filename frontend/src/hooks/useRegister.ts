import { useState } from 'react';
import { useForm, SubmitHandler } from 'react-hook-form';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '@context/AuthContext';
import { RegisterFormData } from '@/types';

export const useRegister = () => {
  const [isLoading, setIsLoading] = useState(false);
  const { register: registerUser } = useAuth();
  const navigate = useNavigate();

  const formMethods = useForm<RegisterFormData>({
    defaultValues: {
      email: '',
      password: '',
      confirmPassword: '',
    },
  });

  const onSubmit: SubmitHandler<RegisterFormData> = async (data) => {
    if (data.password !== data.confirmPassword) {
      formMethods.setError('confirmPassword', {
        type: 'manual',
        message: 'Passwords don`t match',
      });
      return;
    }

    setIsLoading(true);
    try {
      await registerUser(data.email, data.password, data.confirmPassword);
      navigate('/');
    } catch (error) {
      console.error('Registration error:', error);
    } finally {
      setIsLoading(false);
    }
  };

  return { formMethods, onSubmit, isLoading };
};
