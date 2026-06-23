"use client";

import { useState, FormEvent } from "react";
import { useRouter } from "next/navigation";
import { loginUser } from "@/services/auth/auth-service";
import { Eye, EyeOff } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { loginSchema } from "@/lib/schemas/authSchema";

export function SignInForm() {
  const router = useRouter();
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [fieldErrors, setFieldErrors] = useState<{ id?: string; password?: string }>({});
  const [serverError, setServerError] = useState<string | null>(null);
  const [showPassword, setShowPassword] = useState<boolean>(false);

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
        <div className="relative">
          <Input
            id="password"
            name="password"
            type={showPassword ? "text" : "password"}
            placeholder="••••••••"
            disabled={isLoading}
            className={`h-11 pr-10 ${fieldErrors.password ? "border-destructive focus-visible:ring-destructive" : ""}`}
          />
          <button
            type="button"
            tabIndex={-1}
            onClick={() => setShowPassword(!showPassword)}
            className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground transition-colors focus:outline-none"
            disabled={isLoading}
          >
            {showPassword ? (
              <EyeOff className="h-5 w-5" />
            ) : (
              <Eye className="h-5 w-5" />
            )}
            <span className="sr-only">Toggle password visibility</span>
          </button>
        </div>
        {fieldErrors.password && (
          <p className="text-xs font-medium text-destructive mt-1">{fieldErrors.password}</p>
        )}
      </div>

      {serverError && (
        <div className="p-3 text-sm font-medium text-destructive bg-destructive/10 rounded-md border border-destructive/20 text-center">
          {serverError}
        </div>
      )}

      <Button type="submit" className="w-full h-11 font-bold text-base cursor-pointer" disabled={isLoading}>
        {isLoading ? "Memverifikasi..." : "Masuk ke Sistem"}
      </Button>
    </form>
  );
}