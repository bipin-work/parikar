import NextAuth from "next-auth";
import Credentials from "next-auth/providers/credentials";
import Github from "next-auth/providers/github";

import { email, z } from "zod";
import db from "./db";
import { prisma } from "./prisma";

const loginSchema = z.object({
  email: z.string().email(),
  password: z.string().min(6),
});

export const { auth, handlers, signIn, signOut } = NextAuth({
  providers: [
    Github,
    Credentials({
      credentials: {
        email: {},
        password: {},
      },
      authorize: async (credentials) => {
        const user = await db.user.findFirst({
          where: {
            email: credentials.email,
            password: credentials.password,
          },
        });

        if (!user) {
          throw new Error("Invalid Credentials");
        }
        return user;
      },
    }),
  ],
});
