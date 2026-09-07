import axios, { AxiosError } from "axios";
import { AdminLetterListResponse } from "@/types/response/admin/letter";

export const getAdminLetters = async (page: number, status: string, resi: string = ""): Promise<AdminLetterListResponse> => {
  try {
    const params = new URLSearchParams({ 
      page: String(page), 
      limit: "10" 
    });
    
    if (status && status !== "All") params.append("status", status);
    if (resi) params.append("resi", resi);
    // Eksekusi HTTP GET ke internal API dengan parameter filter surat admin
    const response = await axios.get(`/api/admin/letters?${params.toString()}`);
    
    return response.data.data as AdminLetterListResponse;
  // Tangkap dan terjemahkan exception mentah untuk dikembalikan ke lapisan atas
  } catch (error: unknown) {
    const axiosError = error as AxiosError<{ message: string }>;
    throw new Error(axiosError.response?.data?.message || "Gagal memuat data persuratan admin");
  }
};

export const getAdminLetterStats = async () => {
  try {
    // Eksekusi HTTP GET untuk mengambil agregasi statistik surat admin
    const response = await axios.get("/api/admin/letters/stats");
    return response.data.data;
  // Tangkap dan terjemahkan exception mentah untuk dikembalikan ke lapisan atas
  } catch (error: unknown) {
    const axiosError = error as AxiosError<{ message: string }>;
    throw new Error(axiosError.response?.data?.message || "Gagal memuat statistik");
  }
};
