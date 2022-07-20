import type { Account, PrismaClient, Profile, User } from "@prisma/client";
import "express";

type ProfileContext = Profile & {
  users: (User & {
    account: Account;
  })[];
};

type UserContext = User & {
  account: Account;
  profile: Profile;
};

declare global {
  var db_models: PrismaClient;
  namespace Express {
    interface Request {
      profile?: ProfileContext | null;
      rise_user?: UserContext | null;
    }
  }
}

export {};
