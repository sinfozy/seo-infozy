import NextAuth, { CredentialsSignin } from "next-auth";

import Credentials from "next-auth/providers/credentials";
import { Currency } from "./types/enums";
import { Reseller } from "./models/reseller";
import { User } from "./models/user";
import { Wallet } from "./models/wallet";
import connectDB from "./lib/db";
import mongoose from "mongoose";

class InvalidLoginError extends CredentialsSignin {
  code = "Invalid identifier or password";
}

class UnverifiedEmailError extends CredentialsSignin {
  code = "Your email is not verified.";
}

class DeactivatedAccountError extends CredentialsSignin {
  code = "Your account has been deactivated. Please contact support.";
}

class ResellerNotFoundError extends CredentialsSignin {
  code = "Reseller not found with this email.";
}

export const { handlers, signIn, signOut, auth } = NextAuth({
  providers: [
    Credentials({
      credentials: {
        identifier: { label: "Enter email or username" },
        password: { label: "Password", type: "password" },
        login: { label: "Login as", type: "text" },
      },
      async authorize(credentials) {
        if (!credentials?.identifier || !credentials?.password)
          throw new Error("Missing credentials");

        const isAdminLogin = credentials.login === "admin";
        const isResellerLogin = credentials.login === "reseller";

        if (isAdminLogin) {
          await connectDB();

          const adminWallet = await Wallet.findOne({
            ownerId: new mongoose.Types.ObjectId(process.env.ADMIN_ID),
            ownerModel: "Admin",
          });

          if (!adminWallet) {
            await Wallet.create({
              ownerId: new mongoose.Types.ObjectId(process.env.ADMIN_ID),
              ownerModel: "Admin",
              balance: 0,
              currency: Currency.INR,
              transactions: [],
            });
          }

          // Then validate against env credentials
          if (
            credentials.identifier === process.env.ADMIN_EMAIL &&
            credentials.password === process.env.ADMIN_PASSWORD
          ) {
            return {
              _id: process.env.ADMIN_ID as string,
              email: credentials.identifier as string,
              role: "admin",
            };
          } else {
            throw new InvalidLoginError();
          }
        } else if (isResellerLogin) {
          await connectDB();

          const reseller = await Reseller.findOne({
            email: credentials.identifier,
          }).select("+password");

          if (!reseller) throw new ResellerNotFoundError();

          if (reseller.isActive === false) {
            throw new DeactivatedAccountError();
          }

          const isPasswordCorrect = await reseller.comparePassword(
            credentials.password as string
          );

          if (isPasswordCorrect) {
            return {
              _id: reseller._id as string,
              email: reseller.email,
              name: reseller.fullname,
              username: reseller.companyName,
              isVerified: true,
              isActive: reseller.isActive,
              currency: reseller.currency,
              role: "reseller",
            };
          } else {
            throw new InvalidLoginError();
          }
        } else {
          await connectDB();

          const user = await User.findOne({
            $or: [
              { email: credentials.identifier },
              { username: credentials.identifier },
            ],
          })
            .populate("plan")
            .select("+password +name");

          console.log(user);

          if (!user) throw new Error("User not found");

          if (!user.isVerified) {
            throw new UnverifiedEmailError();
          }

          if (user.isActive === false) {
            throw new DeactivatedAccountError();
          }

          const isPasswordCorrect = await user.comparePassword(
            credentials.password as string
          );

          if (isPasswordCorrect) {
            return {
              _id: user._id as string,
              email: user.email,
              username: user.username,
              fullname: user.fullname,
              avatar: user.avatar,
              isVerified: user.isVerified,
              isActive: user.isActive,
              currency: user.currency,
              plan: {
                name:
                  user.plan &&
                  typeof user.plan === "object" &&
                  "name" in user.plan
                    ? String((user.plan as { name: string }).name) // enum -> string, safe even if null/undefined
                    : null,
                endsAt: user.planEndsAt,
              },
              role: "user",
            };
          } else {
            throw new InvalidLoginError();
          }
        }
      },
    }),
  ],
  callbacks: {
    async jwt({ token, user, trigger }) {
      if (user) {
        token._id = user._id?.toString();
        token.username = user.username;
        token.fullname = user.fullname;
        token.avatar = user.avatar;
        token.email = user.email;
        token.isVerified = user.isVerified;
        token.role = user.role;
        token.plan = {
          name: user.plan?.name,
          endsAt: user.plan?.endsAt,
        };
        token.currency = user.currency;
        token.isActive = user.isActive;
      }

      if (trigger === "update" && token.email) {
        try {
          await connectDB();
          const dbUser = await User.findOne({ email: token.email }).lean();
          if (dbUser) {
            token._id = dbUser._id.toString();
            token.username = dbUser.username;
            token.fullname = dbUser.fullname;
            token.avatar = dbUser.avatar;
            token.email = dbUser.email;
            token.isVerified = dbUser.isVerified;
            token.plan = {
              name:
                user.plan &&
                typeof user.plan === "object" &&
                "name" in user.plan
                  ? String((user.plan as { name: string }).name)
                  : null,
              endsAt: dbUser.planEndsAt,
            };
            token.currency = dbUser.currency;
            token.isActive = dbUser.isActive;
            token.role = "user";
          }
        } catch (error) {
          console.error("Error updating JWT token:", error);
        }
      }

      return token;
    },

    async session({ session, token }) {
      if (token && session.user) {
        session.user._id = token._id as string;
        session.user.username = token.username as string;
        session.user.fullname = token.fullname as string;
        session.user.avatar = token.avatar as string;
        session.user.email = token.email as string;
        session.user.isVerified = token.isVerified as boolean;
        session.user.isActive = token.isActive as boolean;
        session.user.role = token.role as "user" | "admin" | "reseller";
        session.user.plan = token.plan as {
          name: string;
          endsAt?: Date;
        };
        session.user.currency = token.currency as string;
      }
      return session;
    },
  },
  session: {
    strategy: "jwt",
  },
  secret: process.env.AUTH_SECRET,
  pages: {
    signIn: "/login",
  },
  trustHost: true,
});
