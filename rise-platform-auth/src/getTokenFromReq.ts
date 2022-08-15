import type { Request } from "express";

export function getTokenFromReq(req: Request) {
  if (req.query.access_token) {
    return req.query.access_token as string;
  }
  if (
    req.headers.authorization &&
    req.headers.authorization.split(" ")[0] === "Bearer"
  ) {
    return req.headers.authorization.split(" ")[1];
  }
  return null;
}
