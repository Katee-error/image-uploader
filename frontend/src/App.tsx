import React from "react";
import { Box } from "@chakra-ui/react";
import { AppRoutes } from "./routes/Routes";

export const App: React.FC = () => {
  return (
    <Box minH="100vh">
      <AppRoutes />
    </Box>
  );
};
