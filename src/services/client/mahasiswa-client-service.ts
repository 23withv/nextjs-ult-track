import axios, { AxiosError } from "axios";
import { RegisterMahasiswaInput } from "@/lib/schemas/mahasiswa-schema";
import { MahasiswaListItem } from "@/types/response/mahasiswa";

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

export const getMahasiswaList = async () => {
  try {
    const response = await axios.get("/api/admin/mahasiswa");
    return {
      message: String(response.data.message),
      data: response.data.data as MahasiswaListItem[],
    };
  } catch (error: unknown) {
    const axiosError = error as AxiosError<{ message: string }>;
    const errorMessage = axiosError.response?.data?.message || "Gagal menghubungi peladen";
    throw new Error(errorMessage);
  }
};