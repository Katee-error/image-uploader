import axios from "axios";
import { Image } from "@/types/image"; // Убедись, что этот тип у тебя есть

// Обновлённый интерфейс
export interface UploadImageResponse {
  success: boolean;
  message: string;
  image: Image;
  originalImageUrl: string; // добавляем вручную на клиенте
}

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
        onUploadProgress: (event) => {
          const progress = Math.round(
            (event.loaded * 100) / (event.total || 1)
          );
          console.log("Upload progress:", progress);
        },
      }
    );

    const originalBlob = new Blob([file], { type: file.type });
    const originalImageUrl = URL.createObjectURL(originalBlob);

    console.log("[✔] Upload successful:", response.data);

    return {
      ...response.data,
      originalImageUrl, // добавляем клиентский blob URL
    };
  } catch (err: any) {
    console.error("[❌] Upload failed:", err?.response || err);
    throw err;
  }
};
