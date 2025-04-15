import { api } from "../api";
export const getOriginalImage = async (id: string): Promise<string> => {
  const response = await api.get(`/${id}/original`, { responseType: "blob" });

  const blob = new Blob([response.data], {
    type: response.headers["content-type"] || "image/jpeg",
  });

  return URL.createObjectURL(blob);
};
