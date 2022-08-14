import type { NextFunction, Request, Response } from "express";
import jwt from "jsonwebtoken";

import { PROFILE_TOKEN_COOKIE_NAME } from "./createProfileToken";
import { getTokenFromReq } from "./getTokenFromReq";

interface ProfileJwtPayload {
  profile_id: string;
}

export async function requiresProfileAuth(
  req: Request,
  res: Response,
  next: NextFunction
) {
  try {
    const token = getTokenFromReq(req, {
      cookie_name: PROFILE_TOKEN_COOKIE_NAME,
    });

    if (!token) {
      throw new Error("Token not found");
    }

    const { profile_id } = jwt.verify(
      token,
      `${process.env.JWT_SECRET}`
    ) as ProfileJwtPayload;

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

    next();
  } catch (error) {
    console.error(error);
    res.clearCookie(PROFILE_TOKEN_COOKIE_NAME);
    return res.sendStatus(401);
  }
}
