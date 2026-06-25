import axios, { AxiosError } from "axios";
import { RegisterMahasiswaInput } from "@/lib/schemas/mahasiswa-schema";
import { MahasiswaListItem } from "@/types/response/admin/mahasiswa";

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
    const errorMessage =
      axiosError.response?.data?.message || "Koneksi jaringan terputus";

    throw new Error(errorMessage);
  }
};

export const getMahasiswaList = async (page: number = 1, jurusan: string = "", prodi: string = "") => {
  try {
    const response = await axios.get(
      `/api/admin/mahasiswa?page=${page}&jurusan=${encodeURIComponent(jurusan)}&prodi=${encodeURIComponent(prodi)}`
    );
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

export const getMahasiswaStats = async (jurusan: string = "", prodi: string = "") => {
  try {
    const response = await axios.get(
      `/api/admin/mahasiswa/stats?jurusan=${encodeURIComponent(jurusan)}&prodi=${encodeURIComponent(prodi)}`
    );
    return response.data.data as { total: number; active: number; inactive: number };
  } catch {
    throw new Error("Gagal memuat statistik");
  }
};