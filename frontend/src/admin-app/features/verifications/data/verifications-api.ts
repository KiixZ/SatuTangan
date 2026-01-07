import { axiosInstance } from "@admin/lib/axios";
import { Verification, ReviewVerificationInput } from "./schema";

export const verificationsApi = {
  getAll: async (status?: string): Promise<Verification[]> => {
    const params = status ? { status } : {};
    const response = await axiosInstance.get("/users/admin/verifications", {
      params,
    });
    return response.data.data.verifications;
  },

  review: async (id: string, data: ReviewVerificationInput): Promise<void> => {
    await axiosInstance.patch(`/api/users/admin/verifications/${id}`, data);
  },
};
