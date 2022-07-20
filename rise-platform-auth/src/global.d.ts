import type { PrismaClient } from "@prisma/client";
import "express";
import type { ProfileContext, UserContext } from "./types";

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
