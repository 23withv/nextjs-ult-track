import { SignInForm } from "./signin-form";
import { ModeToggle } from "@/components/mode-toggle";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { ShieldCheck } from "lucide-react";

export default function SignInPage() {
  return (
    <div className="flex min-h-screen items-center justify-center p-4 bg-muted/30">
      <div className="absolute top-4 right-4">
        <ModeToggle />
      </div>
      
      <Card className="w-full max-w-sm shadow-xl border-border/50">
        <CardHeader className="space-y-2 text-center pb-6">
          <div className="flex justify-center mb-2">
            <div className="h-12 w-12 rounded-full bg-primary/10 flex items-center justify-center">
              <ShieldCheck className="h-6 w-6 text-primary" />
            </div>
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