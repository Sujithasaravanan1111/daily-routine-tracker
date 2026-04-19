import { NextAuthOptions } from "next-auth";
import CredentialsProvider from "next-auth/providers/credentials";
import { PrismaAdapter } from "@auth/prisma-adapter";
import { prisma } from "./prisma";
import bcrypt from "bcryptjs";

export const authOptions: NextAuthOptions = {
    adapter: PrismaAdapter(prisma) as any,
    providers: [
        CredentialsProvider({
            name: "credentials",
            credentials: {
                email: { label: "Email", type: "email" },
                password: { label: "Password", type: "password" }
            },
            async authorize(credentials) {
                try {
                    if (!credentials?.email || !credentials?.password) {
                        throw new Error("Email and password are required");
                    }

                    const email = credentials.email.toLowerCase();
                    const user = await prisma.user.findUnique({
                        where: { email }
                    });

                    if (!user || !user.password) {
                        console.error(`AUTH ERROR: User not found for email ${credentials.email}`);
                        throw new Error("Invalid credentials");
                    }

                    const isCorrectPassword = await bcrypt.compare(
                        credentials.password,
                        user.password
                    );

                    if (!isCorrectPassword) {
                        console.error(`AUTH ERROR: Password mismatch for email ${credentials.email}`);
                        throw new Error("Invalid credentials");
                    }

                    return user;
                } catch (error: any) {
                    console.error("NEXTAUTH AUTHORIZE ERROR:", error);
                    throw error;
                }
            }
        })
    ],
    session: {
        strategy: "jwt"
    },
    callbacks: {
        session: ({ session, token }) => {
            if (token && session.user) {
                (session.user as any).id = token.sub;
            }
            return session;
        }
    },
    pages: {
        signIn: "/login"
    },
    secret: process.env.NEXTAUTH_SECRET || "your-secret-here",
};
