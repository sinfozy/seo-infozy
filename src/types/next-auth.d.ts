import "next-auth";
import { DefaultSession } from "next-auth";

declare module "next-auth" {
  interface User {
    _id: string;
    username?: string;
    fullname?: string;
    avatar?: string;
    email: string;
    isVerified?: boolean;
    isActive?: boolean;
    plan?: {
      name: string | null;
      endsAt?: Date | null;
    } | null;
    role: "user" | "admin" | "reseller";
    currency?: string;
  }

  interface Session {
    user: {
      _id: string;
      username?: string;
      email: string;
      isVerified?: boolean;
      isActive?: boolean;
      plan?: {
        name: string | null;
        endsAt?: Date | null;
      } | null;
      role: "user" | "admin" | "reseller";
      currency?: string;
    } & DefaultSession["user"];
  }
}

declare module "next-auth/jwt" {
  interface JWT {
    _id: string;
    username?: string;
    fullname?: string;
    avatar?: string;
    email: string;
    isVerified?: boolean;
    isActive?: boolean;
    plan?: {
      name: string | null;
      endsAt?: Date | null;
    } | null;
    role: "user" | "admin" | "reseller";
    currency?: string;
  }
}
