import axios, { AxiosError } from "axios";
import { AdminLetterListResponse } from "@/types/response/admin/letter";

export const getAdminLetters = async (page: number, status?: string): Promise<AdminLetterListResponse> => {
  try {
    const params = new URLSearchParams({ page: String(page), limit: "10" });
    if (status && status !== "All") params.append("status", status);

    const response = await axios.get(`/api/admin/letters?${params.toString()}`);
    return response.data.data as AdminLetterListResponse;
  } catch (error: unknown) {
    const axiosError = error as AxiosError<{ message: string }>;
    throw new Error(axiosError.response?.data?.message || "Gagal memuat data persuratan admin");
  }
};