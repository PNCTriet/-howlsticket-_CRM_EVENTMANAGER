import { api } from "@/lib/axios";
import type { CheckinRealtime } from "@/types/checkin";

export const checkinService = {
  getRealtime: async (eventId: string) => {
    const { data } = await api.get<CheckinRealtime>(
      `/checkin/realtime/${eventId}`
    );
    return data;
  },
};
