import { Image } from "@/types";
export const getStatusColor = (status: Image["processingStatus"]) => {
  switch (status) {
    case "COMPLETED":
      return "green";
    case "PROCESSING":
      return "blue";
    case "PENDING":
      return "yellow";
    case "FAILED":
      return "red";
    default:
      return "gray";
  }
};
