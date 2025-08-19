import NextAuth from "next-auth";
import Github from "next-auth/providers/github";

import { z } from "zod";

const loginSchema = z.object({
  email: z.string().email(),
  password: z.string().min(6),
});

export const { auth, handlers, signIn, signOut } = NextAuth({
  providers: [Github],
});
