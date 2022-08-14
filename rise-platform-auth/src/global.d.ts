import type {
  Account,
  DBClient,
  Profile,
  User,
} from "@giftwizard/rise-platform-db";
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
  var db_models: DBClient;
  namespace Express {
    interface Request {
      profile?: ProfileContext | null;
      user?: UserContext | null;
    }
  }
}

export {};
