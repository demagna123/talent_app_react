import type { AuthSession } from "../../../data/models/User";
import type { ApiResponse } from "../../../responses/responses";
import axiosInstance from "../../axios_intance";

export const authApi = {
  // Étape 1 : vérifie le mot de passe, le backend envoie le code par mail
  signIn: async (email: string, password: string): Promise<void> => {
    await axiosInstance.post("/authentication/signin", { email, password });
  },

  // Étape 2 : vérifie le code et renvoie les jetons
  verifyOtp: async (email: string, code: string): Promise<AuthSession> => {
    const response = await axiosInstance.post<ApiResponse<AuthSession>>("/authentication/verify-otp", {
      email,
      code,
    });
    return response.data.data[0];
  },
};