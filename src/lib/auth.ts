import NextAuth from "next-auth";
import Credentials from "next-auth/providers/credentials";
import Github from "next-auth/providers/github";
import { encode as defaultEncode } from "next-auth/jwt";

import { v4 as uuid } from "uuid";
import { email, z } from "zod";
import db from "./db";
import { prisma } from "./prisma";
import { PrismaAdapter } from "@auth/prisma-adapter";

export const loginSchema = z.object({
  email: z.string().email(),
  password: z.string().min(1),
});

const adapter = PrismaAdapter(db);

export const { auth, handlers, signIn, signOut } = NextAuth({
  adapter,
  providers: [
    Github,
    Credentials({
      credentials: {
        email: {},
        password: {},
      },
      authorize: async (credentials) => {
        const validCredentials = loginSchema.parse(credentials);
        const user = await db.user.findFirst({
          where: {
            email: validCredentials.email,
            password: validCredentials.password,
          },
        });

        if (!user) {
          throw new Error("Invalid Credentials");
        }
        return user;
      },
    }),
  ],
  callbacks: {
    async jwt({ token, account }) {
      if (account?.provider === "credentials") {
        token.credentials = true;
      }
      return token;
    },
  },
  jwt: {
    encode: async function (params) {
      if (params.token?.credentials) {
        const sessionToken = uuid();
        if (!params.token.sub) {
          throw new Error("No user ID found in token");
        }

        const createdSession = await adapter?.createSession?.({
          sessionToken: sessionToken,
          userId: params.token.sub,
          expires: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000),
        });
        if (!createdSession) {
          throw new Error("Failed to create session");
        }

        return sessionToken;
      }
      return defaultEncode(params);
    },
  },
});
