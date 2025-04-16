import React, { Suspense } from "react";
import { Routes, Route, Navigate } from "react-router-dom";
import { Center, Spinner } from "@chakra-ui/react";
import AuthPage from "@/pages/AuthPage";
import { ProtectedRoute } from "./ProtectedRoutes";
import MainPage from "@/pages/MainPage";

export const AppRoutes: React.FC = () => {
  return (
    <Suspense
      fallback={
        <Center h="100vh">
          <Spinner size="xl" color="brand.500" thickness="4px" />
        </Center>
      }
    >
      <Routes>
        <Route path="/auth" element={<AuthPage />} />
        <Route
          path="/"
          element={
            <ProtectedRoute>
              <MainPage />
            </ProtectedRoute>
          }
        />
        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>
    </Suspense>
  );
};
