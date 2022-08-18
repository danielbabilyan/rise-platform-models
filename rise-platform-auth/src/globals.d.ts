import type {
  Account,
  DBClient,
  Profile,
  Role,
  User,
} from "@giftwizard/rise-platform-db";
import "express";

type ProfileContext = Profile & {
  users: (User & {
    role: Role;
    account: Account;
  })[];
};

type UserContext = User & {
  role: Role;
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
