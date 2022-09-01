import type {
  Account,
  App,
  DBClient,
  Profile,
  Role,
  User,
} from "@giftwizard/rise-platform-db";
import "express";

type ClientContext = {
  profile?: Profile;
  user?: User & { role: Role };
  account?: Account;
  app?: App;
};
declare global {
  var db_models: DBClient;
  namespace Express {
    interface Request {
      client?: ClientContext;
    }
  }
}

export {};
