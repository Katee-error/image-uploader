import React from 'react';
import {
  Box,
  Card,
  CardBody,
  CardHeader,
  Heading,
  Spinner,
  Text,
  VStack,
} from '@chakra-ui/react';
import { useImageUpload } from '@/hooks/useImageUpload';
import { FiUpload } from 'react-icons/fi';

const ImageUploader: React.FC = () => {
  const { getRootProps, getInputProps, isUploading, isDragActive } = useImageUpload();

  return (
    <Card>
      <CardHeader>
        <Heading size="md">Upload a New Image</Heading>
      </CardHeader>
      <CardBody>
        <Box
          {...getRootProps()}
          p={10}
          borderWidth={2}
          borderRadius="md"
          borderStyle="dashed"
          borderColor={isDragActive ? 'brand.500' : 'gray.300'}
          bg={isDragActive ? 'brand.50' : 'gray.100'}
          cursor="pointer"
          _hover={{ borderColor: 'brand.500' }}
        >
          <input {...getInputProps()} />
          <VStack spacing={4}>
            <FiUpload size={40} color={isDragActive ? 'brand.500' : 'gray.500'} />
            {isUploading ? (
              <VStack>
                <Spinner size="xl" color="brand.500" />
                <Text>Uploading...</Text>
              </VStack>
            ) : (
              <Text textAlign="center" color="gray.500">
                {isDragActive
                  ? 'Drop the image here'
                  : 'Drag and drop an image here, or click to select a file'}
              </Text>
            )}
          </VStack>
        </Box>
      </CardBody>
    </Card>
  );
};

export default ImageUploader;
