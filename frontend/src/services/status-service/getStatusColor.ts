import { Image } from "@/types";
export const getStatusStyles = (status: Image["processingStatus"]) => {
    switch (status) {
      case "COMPLETED":
        return {
          bg: "#0A7F08",
          color: "#ffffff",
        };
      case "PROCESSING":
        return {
          bg: "#D0DEFB",
          color: "#176ED9",
        };
      case "PENDING":
        return {
          bg: "#FEF6C2",
          color: "#E2890D",
        };
      case "FAILED":
        return {
          bg: "#FA0C0C",
          color: "#ffffff",
        };
      default:
        return {
          bg: "gray.500",
          color: "white",
        };
    }
  };