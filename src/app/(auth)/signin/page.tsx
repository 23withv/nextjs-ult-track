import Image from "next/image";
import { SignInForm } from "./signin-form";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";

export default function SignInPage() {
  return (
    <div className="w-full max-w-sm">
      <Card className="shadow-xl border-border/50">
        <CardHeader className="space-y-2 text-center pb-6">
          <div className="flex justify-center mb-2">
            <Image 
              src="/logo-poliwangi.png" 
              alt="Logo Poliwangi" 
              width={48} 
              height={48} 
              className="shrink-0 rounded-full object-cover shadow-sm" 
              style={{ width: "48px", height: "48px" }} 
            />
          </div>
          <CardTitle className="text-2xl font-black tracking-tight">ULT-Track</CardTitle>
          <CardDescription className="font-medium">
            Sistem Manajemen Surat Kampus
          </CardDescription>
        </CardHeader>
        <CardContent>
          <SignInForm />
        </CardContent>
      </Card>
    </div>
  );
}