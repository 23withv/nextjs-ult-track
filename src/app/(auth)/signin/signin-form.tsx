"use client";

import { useState, FormEvent } from "react";
import { useRouter } from "next/navigation";
import { loginSchema, loginUser } from "@/services/auth/auth-service";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";

export function SignInForm() {
  const router = useRouter();
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [fieldErrors, setFieldErrors] = useState<{ id?: string; password?: string }>({});
  const [serverError, setServerError] = useState<string | null>(null);

  const handleSubmit = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setIsLoading(true);
    setFieldErrors({});
    setServerError(null);

    const formData = new FormData(e.currentTarget);
    const id = formData.get("id") as string;
    const password = formData.get("password") as string;
    const validation = loginSchema.safeParse({ id, password });

    if (!validation.success) {
      const errors = validation.error.flatten().fieldErrors;
      setFieldErrors({
        id: errors.id?.[0],
        password: errors.password?.[0],
      });
      setIsLoading(false);
      return;
    }

    try {
      const result = await loginUser(validation.data);

      if (result.status === 200) {
        router.push("/admin/dashboard"); 
        router.refresh();
      } else {
        setServerError(result.message);
      }
    } catch (error: unknown) {
      if (error instanceof Error) {
        setServerError(error.message);
      } else {
        setServerError("Terjadi kesalahan pada server.");
      }
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-5">
      <div className="space-y-2">
        <Label htmlFor="id" className="text-sm font-bold">NIM / NIP</Label>
        <Input
          id="id"
          name="id"
          type="text"
          placeholder="Masukkan NIM atau NIP Anda"
          disabled={isLoading}
          className={`h-11 ${fieldErrors.id ? "border-destructive focus-visible:ring-destructive" : ""}`}
        />
        {fieldErrors.id && (
          <p className="text-xs font-medium text-destructive mt-1">{fieldErrors.id}</p>
        )}
      </div>

      <div className="space-y-2">
        <Label htmlFor="password" className="text-sm font-bold">Password</Label>
        <Input
          id="password"
          name="password"
          type="password"
          placeholder="••••••••"
          disabled={isLoading}
          className={`h-11 ${fieldErrors.password ? "border-destructive focus-visible:ring-destructive" : ""}`}
        />
        {fieldErrors.password && (
          <p className="text-xs font-medium text-destructive mt-1">{fieldErrors.password}</p>
        )}
      </div>

      {serverError && (
        <div className="p-3 text-sm font-medium text-destructive bg-destructive/10 rounded-md border border-destructive/20 text-center">
          {serverError}
        </div>
      )}

      <Button type="submit" className="w-full h-11 font-bold text-base" disabled={isLoading}>
        {isLoading ? "Memverifikasi..." : "Masuk ke Sistem"}
      </Button>
    </form>
  );
}