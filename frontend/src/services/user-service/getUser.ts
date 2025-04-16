import { User } from "@/types";
import { authApi } from "@/api";

export const getCurrentUser = async (): Promise<User> => {
  const response = await authApi.get<User>("/me");
  return response.data;
};
