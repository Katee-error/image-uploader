import React from "react";
import {
  Box,
  VStack,
  Text,
  Spinner,
} from "@chakra-ui/react";
import { FiUpload } from "react-icons/fi";
import { DropzoneProps } from "@/types/image";

export const ImageDropzone: React.FC<DropzoneProps> = ({
  getRootProps,
  getInputProps,
  isDragActive,
  isUploading,
}) => {

  return (
    <Box
      {...getRootProps()}
      p={10}
      borderWidth={2}
      borderRadius="md"
      borderColor={isDragActive ? "brand.500" : "gray.300"}
      borderStyle="dashed"
      bg={isDragActive ? 'gray.300' : 'gray.100'}
      cursor="pointer"
      _hover={{ borderColor: "blue" }}
    >
      <input {...getInputProps()} />
      <VStack spacing={4}>
        <FiUpload size={40} color={isDragActive ? "blue" : "gray.500"} />
        {isUploading ? (
          <>
            <Spinner size="xl" color="brand.500" />
            <Text>Uploading...</Text>
          </>
        ) : (
          <Text color={isDragActive ? "blue" : "gray.500"}>
            {isDragActive
              ? "Drop the image here"
              : "Drag and drop an image, or click to select"}
          </Text>
        )}
      </VStack>
    </Box>
  );
};
