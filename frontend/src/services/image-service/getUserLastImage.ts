import { api } from "../api";
import { Image } from "@/types/image";

export const getUserLastImage = async (): Promise<Image | null> => {
  const response = await api.get<{ success: boolean; image: Image }>("/last");
  return response.data?.success ? response.data.image : null;
};
