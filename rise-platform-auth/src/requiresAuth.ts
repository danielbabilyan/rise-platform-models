import type { RequestHandler } from "express";
import rateLimit from "express-rate-limit";
import jwt from "jsonwebtoken";
import _ from "lodash";
import validator from "validator";

import { getTokenFromReq } from "./getTokenFromReq";

interface JwtPayload {
  profile_id: string;
  user_id: string | null;
}

interface Options {
  scope?: string;
}

const apiLimiter = rateLimit({
  windowMs: 30 * 1000,
  max: (req, res) => {
    const account_id = req.query.account_id;
    if (account_id) {
      const accountLicenses = req.client?.account?.licenses as string[];
      if (accountLicenses?.includes("premium_rate_limit")) {
        return 10;
      }
      return 5;
    }

    return 1000;
  },
  standardHeaders: true,
  legacyHeaders: false,
});

const isExistsScope = (scopes: string[], scope: string) => {
  return (
    scopes.includes(scope) ||
    scopes.includes("owner") ||
    scopes.includes("admin")
  );
};

async function getAppClient(
  access_token: string,
  account_id: string,
  options: Options
) {
  const accessToken = await global.db_models.accessToken.findUniqueOrThrow({
    where: {
      access_token_account_id: {
        access_token,
        account_id,
      },
    },
    include: {
      app: true,
      account: true,
    },
  });

  if (options.scope) {
    const scopes = accessToken.scopes as string[];
    if (!isExistsScope(scopes, options.scope)) {
      throw new Error("scope not found");
    }
  }

  return {
    account: accessToken.account,
    app: accessToken.app,
  };
}

async function getUserClient(access_token: string, options: Options) {
  const { profile_id, user_id } = jwt.verify(
    access_token,
    `${process.env.JWT_SECRET}`
  ) as JwtPayload;

  if (user_id) {
    const user = await global.db_models.user.findUniqueOrThrow({
      where: {
        profile_id_id: {
          id: user_id,
          profile_id,
        },
      },
      include: {
        profile: true,
        account: true,
        role: true,
      },
    });

    if (options.scope) {
      const scopes = user.role.scopes as string[];
      if (!isExistsScope(scopes, options.scope)) {
        throw new Error("scope not found");
      }
    }

    return {
      profile: user.profile,
      account: user.account,
      user: _.omit(user, ["profile", "account"]),
    };
  }

  const profile = await global.db_models.profile.findUniqueOrThrow({
    where: { id: profile_id },
  });

  return {
    profile,
  };
}

export function requiresAuth(options: Options = {}) {
  const requestHandlers: RequestHandler[] = [
    async (req, res, next) => {
      try {
        const access_token = getTokenFromReq(req);

        if (!access_token) {
          throw new Error("access_token not found");
        }

        if (validator.isJWT(access_token)) {
          req.client = await getUserClient(access_token, options);
        } else {
          const account_id = req.query.account_id as string;
          if (!account_id) {
            throw new Error("account_id not found");
          }
          req.client = await getAppClient(access_token, account_id, options);
        }

        next();
      } catch (error) {
        console.error(error);
        res.clearCookie("jwt");
        return res.sendStatus(401);
      }
    },
    apiLimiter,
  ];

  return requestHandlers as unknown as RequestHandler;
}
