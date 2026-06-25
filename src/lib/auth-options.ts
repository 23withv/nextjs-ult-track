import { NextAuthOptions } from "next-auth";
import CredentialsProvider from "next-auth/providers/credentials";
import bcrypt from "bcryptjs";
import { connectDB } from "@/lib/db";
import Mahasiswa from "@/models/Mahasiswa";
import Admin from "@/models/Admin";

export const authOptions: NextAuthOptions = {
  session: { strategy: "jwt", maxAge: 24 * 60 * 60, updateAge: 24 * 60 * 60 },
  jwt: { maxAge: 24 * 60 * 60 },
  providers: [
    CredentialsProvider({
      name: "Credentials",
      credentials: {
        id: { label: "NIM/NIP", type: "text" },
        password: { label: "Password", type: "password" },
      },
      async authorize(credentials) {
        if (!credentials?.id || !credentials?.password) return null;

        await connectDB();

        let user = await Mahasiswa.findOne({ nim: credentials.id });
        let role: "mahasiswa" | "admin_ult" = "mahasiswa";

        if (!user) {
          user = await Admin.findOne({ nip: credentials.id });
          role = "admin_ult";
        }

        if (!user) return null;

        const isMatch = await bcrypt.compare(credentials.password, user.password);
        if (!isMatch) return null;

        return { 
          id: user._id.toString(), 
          name: user.name, 
          email: user.email, 
          role 
        };
      },
    }),
  ],
  callbacks: {
    async jwt({ token, user }) {
      if (user) {
        token.id = user.id;
        token.role = user.role;
      }
      return token;
    },
    async session({ session, token }) {
      if (token && session.user) {
        session.user.id = token.id as string;
        session.user.role = token.role as "mahasiswa" | "admin_ult";
      }
      return session;
    },
  },
  pages: { signIn: "/auth/signin" },
  secret: process.env.NEXTAUTH_SECRET,
};