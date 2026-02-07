import { api } from "@/lib/axios";
import type { LoginResponse, MeResponse } from "@/types/auth";

export const authService = {
  login: async (email: string, password: string) => {
    const { data } = await api.post<LoginResponse>("/auth/login", {
      email,
      password,
    });
    return data;
  },

  logout: async () => {
    await api.post("/auth/logout");
  },

  me: async () => {
    const { data } = await api.get<MeResponse>("/auth/me");
    return data;
  },

  meDetailed: async () => {
    const { data } = await api.get<MeResponse>("/auth/me/detailed");
    return data;
  },
};
