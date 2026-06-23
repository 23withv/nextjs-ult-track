import axios, { AxiosError } from "axios";
import { RegisterMahasiswaInput } from "@/lib/schemas/mahasiswa-schema";
import { MahasiswaListItem } from "@/types/response/mahasiswa";

export interface PaginationMeta {
  currentPage: number;
  totalPages: number;
  totalItems: number;
}

export const postRegisterMahasiswa = async (data: RegisterMahasiswaInput) => {
  try {
    const response = await axios.post("/api/admin/mahasiswa", data);
    return { message: String(response.data.message) };
  } catch (error: unknown) {
    console.error("[AXIOS_REGISTER_ERROR]:", error);
    
    const axiosError = error as AxiosError<{ message: string }>;
    const errorMessage = axiosError.response?.data?.message || "Koneksi jaringan terputus";
    
    throw new Error(errorMessage);
  }
};

export const getMahasiswaList = async (page: number = 1) => {
  try {
    const response = await axios.get(`/api/admin/mahasiswa?page=${page}`);
    return {
      message: String(response.data.message),
      data: response.data.data.list as MahasiswaListItem[],
      meta: response.data.data.meta as PaginationMeta,
    };
  } catch (error: unknown) {
    const axiosError = error as AxiosError<{ message: string }>;
    const errorMessage = axiosError.response?.data?.message || "Gagal menghubungi peladen";
    throw new Error(errorMessage);
  }
};