import { Role, User } from "@giftwizard/rise-platform-db";
import type { NextFunction, Request, Response } from "express";
import jwt from "jsonwebtoken";

import { getTokenFromReq } from "./getTokenFromReq";

interface JwtPayload {
  profile_id: string;
  user_id: string;
}

export const isAllowedUser = (
  user: User & { roles: Role[] },
  scope: string
) => {
  const userScopes = user.roles?.flatMap((role) => role.scopes) as string[];

  return user
    ? userScopes.includes(scope) ||
        userScopes.includes("owner") ||
        userScopes.includes("admin")
    : false;
};

export function requiresAuth({ scope }: { scope?: string } = {}) {
  return async (req: Request, res: Response, next: NextFunction) => {
    try {
      const token = getTokenFromReq(req);

      if (!token) {
        throw new Error("Token not found");
      }

      const { profile_id, user_id } = jwt.verify(
        token,
        `${process.env.JWT_SECRET}`
      ) as JwtPayload;

      const profile = await global.db_models.profile.findUnique({
        where: { id: profile_id },
        include: {
          users: {
            include: {
              account: true,
            },
          },
        },
      });

      if (!profile) throw new Error("profile not found");
      req.profile = profile;

      if (user_id) {
        const user = await global.db_models.user.findUnique({
          where: { id: user_id },
          include: {
            profile: true,
            account: true,
            roles: true,
          },
        });

        if (!user) throw new Error("user not found");

        if (scope) {
          if (!isAllowedUser(user, scope)) throw new Error("scope not found");
        }
        req.user = user;
      }

      next();
    } catch (error) {
      console.error(error);
      res.clearCookie("jwt");
      return res.sendStatus(401);
    }
  };
}
