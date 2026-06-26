import axios, { AxiosError } from "axios";
import { CreateLetterInput } from "@/lib/schemas/letter-schema";
import { DelegatedLetterItem, LetterListItem } from "@/types/response/mahasiswa/letter";

export const postCreateLetter = async (data: CreateLetterInput) => {
  try {
    // Eksekusi HTTP POST payload pengajuan surat ke internal API
    const response = await axios.post("/api/mahasiswa/letters", data);
    return { message: String(response.data.message) };
  // Tangkap dan terjemahkan exception mentah untuk dikembalikan ke lapisan atas
  } catch (error: unknown) {
    const axiosError = error as AxiosError<{ message: string }>;
    throw new Error(
      axiosError.response?.data?.message || "Gagal mengajukan surat",
    );
  }
};

export const getMahasiswaLetters = async () => {
  try {
    // Eksekusi HTTP GET untuk mengambil seluruh riwayat surat mahasiswa
    const response = await axios.get("/api/mahasiswa/letters");
    return (response.data.data as LetterListItem[]) || [];
  // Tangkap dan terjemahkan exception mentah untuk dikembalikan ke lapisan atas
  } catch (error: unknown) {
    const axiosError = error as AxiosError<{ message: string }>;
    throw new Error(
      axiosError.response?.data?.message || "Gagal memuat data persuratan",
    );
  }
};

export const validateDelegateNim = async (nim: string) => {
  try {
    // Eksekusi HTTP GET validasi ketersediaan NIM mahasiswa
    const response = await axios.get(`/api/mahasiswa/validate-nim/${nim}`);
    return response.data as { name: string; prodi: string };
  } catch {
    return null;
  }
};

export const getMahasiswaLetterDetail = async (id: string) => {
  try {
    // Eksekusi HTTP GET untuk mengambil rincian data surat spesifik
    const response = await axios.get(`/api/mahasiswa/letters/${id}`);
    return response.data.data;
  // Tangkap dan terjemahkan exception mentah untuk dikembalikan ke lapisan atas
  } catch (error: unknown) {
    const axiosError = error as AxiosError<{ message: string }>;
    throw new Error(
      axiosError.response?.data?.message || "Gagal memuat detail persuratan"
    );
  }
};

export const patchAssignDelegate = async (letterId: string, delegateNim: string) => {
  try {
    // Eksekusi HTTP PATCH payload delegasi pengurusan surat
    const response = await axios.patch(`/api/mahasiswa/letters/${letterId}/delegate`, { nim: delegateNim });
    return { message: String(response.data.message) };
  // Tangkap dan terjemahkan exception mentah untuk dikembalikan ke lapisan atas
  } catch (error: unknown) {
    const axiosError = error as AxiosError<{ message: string }>;
    throw new Error(axiosError.response?.data?.message || "Gagal menunjuk delegasi");
  }
};

export const getDelegatedLetters = async () => {
  try {
    // Eksekusi HTTP GET untuk mengambil daftar surat terdelegasi
    const response = await axios.get("/api/mahasiswa/delegates");
    return (response.data.data as DelegatedLetterItem[]) || [];
  // Tangkap dan terjemahkan exception mentah untuk dikembalikan ke lapisan atas
  } catch (error: unknown) {
    const axiosError = error as AxiosError<{ message: string }>;
    throw new Error(
      axiosError.response?.data?.message || "Gagal memuat data delegasi"
    );
  }
};