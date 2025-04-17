import React, { createContext, useContext, useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useToast } from "@chakra-ui/react";
import { loginUser, registerUser, refreshToken } from "@/services/auth-service";
import { User } from "@/types";
import { getCurrentUser } from "@/services/user-service";
import { AuthContextType } from "@/types";

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error("useAuth must be used within an AuthProvider");
  }
  return context;
};

interface AuthProviderProps {
  children: React.ReactNode;
}

export const AuthProvider: React.FC<AuthProviderProps> = ({ children }) => {
  const [user, setUser] = useState<User | null>(null);
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const navigate = useNavigate();
  const toast = useToast();

  useEffect(() => {
    const checkAuth = async () => {
      const token = localStorage.getItem("token");
      if (token) {
        try {
          const userData = await getCurrentUser();
          setUser(userData);
        } catch (error) {
          console.error("Authentication error:", error);

          const refreshResult = await refreshToken(token);

          if (refreshResult && refreshResult.success && refreshResult.token) {
            localStorage.setItem("token", refreshResult.token);
            setUser(refreshResult.user);
            console.log("Token refreshed successfully");
          } else {
            console.error("Token refresh failed");
            localStorage.removeItem("token");
            setUser(null);
          }
        }
      }
      setIsLoading(false);
    };

    checkAuth();
  }, []);

  const login = async (email: string, password: string) => {
    setIsLoading(true);
    try {
      const { user, token } = await loginUser(email, password);
      localStorage.setItem("token", token);
      setUser(user);
      toast({
        title: "Login successful",
        status: "success",
        duration: 3000,
        isClosable: true,
        containerStyle: {bgColor: "#0A7F08", color: '#ffffff',  borderRadius: "md",},
      });
      navigate("/");
    } catch (error) {
      toast({
        title: "Login failed",
        description:
          error instanceof Error ? error.message : "An error occurred",
        status: "error",
        duration: 5000,
        isClosable: true,
        containerStyle: {bgColor: "#FA0C0C", color: '#ffffff',  borderRadius: "md",},
      });
      throw error;
    } finally {
      setIsLoading(false);
    }
  };

  const register = async (
    email: string,
    password: string,
    confirmPassword: string
  ) => {
    if (password !== confirmPassword) {
      toast({
        title: "Registration failed",
        description: "Passwords do not match",
        status: "error",
        duration: 5000,
        isClosable: true,
        containerStyle: {bgColor: "#FA0C0C", color: '#ffffff',  borderRadius: "md",},
      });
      throw new Error("Passwords do not match");
    }

    setIsLoading(true);
    try {
      const { user, token } = await registerUser(email, password);
      localStorage.setItem("token", token);
      setUser(user);
      toast({
        title: "Registration successful",
        status: "success",
        duration: 3000,
        isClosable: true,
        containerStyle: {bgColor: "#0A7F08", color: '#ffffff',  borderRadius: "md",},
      });
      navigate("/");
    } catch (error) {
      toast({
        title: "Registration failed",
        description:
          error instanceof Error ? error.message : "An error occurred",
        status: "error",
        duration: 5000,
        isClosable: true,
        containerStyle: {bgColor: "#FA0C0C", color: '#ffffff',  borderRadius: "md",},
      });
      throw error;
    } finally {
      setIsLoading(false);
    }
  };

  const logout = () => {
    localStorage.removeItem("token");
    setUser(null);
    navigate("/auth");
    toast({
      title: "Logged out",
      status: "info",
      duration: 3000,
      isClosable: true,
      containerStyle: {bgColor: "#176ED9", color: '#ffffff',  borderRadius: "md",},
    });
  };

  const value = {
    user,
    isAuthenticated: !!user,
    isLoading,
    login,
    register,
    logout,
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};
