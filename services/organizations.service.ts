import { api } from "@/lib/axios";
import type { Organization } from "@/types/organization";

export const organizationsService = {
  getById: async (id: string): Promise<Organization | null> => {
    try {
      const { data } = await api.get<Organization>(`/organizations/${id}`);
      return data;
    } catch {
      return null;
    }
  },
};
