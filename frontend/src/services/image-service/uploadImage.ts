import axios from "axios";
import { UploadImageResponse } from "@/types";

export const uploadImage = async (file: File): Promise<UploadImageResponse> => {
  try {
    const formData = new FormData();
    formData.append("image", file);

    const response = await axios.post<Omit<UploadImageResponse, "originalImageUrl">>(
      "/api/images/upload",
      formData,
      {
        headers: {
          "Content-Type": "multipart/form-data",
          Authorization: `Bearer ${localStorage.getItem("token")}`,
        },
      }
    );

    const originalBlob = new Blob([file], { type: file.type });
    const originalImageUrl = URL.createObjectURL(originalBlob);

    return {
      ...response.data,
      originalImageUrl,
    };
  } catch (err: any) {
    console.error("Upload failed:", err?.response || err);
    throw err;
  }
};
