import type { NextFunction, Request, Response } from "express";
import jwt from "jsonwebtoken";

import { USER_TOKEN_COOKIE_NAME } from "./createUserToken";
import { getTokenFromReq } from "./getTokenFromReq";

interface UserJwtPayload {
  user_id: number;
}

export async function requiresUserAuth(
  req: Request,
  res: Response,
  next: NextFunction
) {
  try {
    const token = getTokenFromReq(req, { cookie_name: USER_TOKEN_COOKIE_NAME });

    if (!token) {
      throw new Error("Token not found");
    }

    const { user_id } = jwt.verify(
      token,
      `${process.env.JWT_SECRET}`
    ) as UserJwtPayload;

    const user = await global.db_models.user.findUnique({
      where: { id: user_id },
      include: {
        profile: true,
        account: true,
      },
    });

    if (!user) throw new Error("user not found");
    req.rise_user = user;

    next();
  } catch (error) {
    res.clearCookie(USER_TOKEN_COOKIE_NAME);
    return res.sendStatus(401);
  }
}
