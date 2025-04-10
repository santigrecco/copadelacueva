import { DefaultSession } from "next-auth";

declare module "next-auth" {
  interface Session {
    user: {
      id: string;
      role: "admin" | "viewer";
    } & DefaultSession["user"];
  }
}

export type UserRole = "admin" | "viewer";

export const ALLOWED_EMAILS = [
  "nicogcarbone@gmail.com",
  "santiagodgrecco@gmail.com",
] as const;

export const ADMIN_EMAILS = ALLOWED_EMAILS; 