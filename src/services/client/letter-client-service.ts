import axios, { AxiosError } from "axios";
import { CreateLetterInput } from "@/lib/schemas/letter-schema";
import { LetterListItem } from "@/types/response/mahasiswa/letter";

export const postCreateLetter = async (data: CreateLetterInput) => {
  try {
    const response = await axios.post("/api/mahasiswa/letters", data);
    return { message: String(response.data.message) };
  } catch (error: unknown) {
    const axiosError = error as AxiosError<{ message: string }>;
    throw new Error(
      axiosError.response?.data?.message || "Gagal mengajukan surat",
    );
  }
};

export const getMahasiswaLetters = async () => {
  try {
    const response = await axios.get("/api/mahasiswa/letters");
    return (response.data.data as LetterListItem[]) || [];
  } catch (error: unknown) {
    const axiosError = error as AxiosError<{ message: string }>;
    throw new Error(
      axiosError.response?.data?.message || "Gagal memuat data persuratan",
    );
  }
};

export const validateDelegateNim = async (nim: string) => {
  try {
    const response = await axios.get(`/api/mahasiswa/validate-nim/${nim}`);
    return response.data as { name: string; prodi: string };
  } catch {
    return null;
  }
};
