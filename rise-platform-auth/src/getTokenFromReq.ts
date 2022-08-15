import type { Request } from "express";

export function getTokenFromReq(req: Request) {
  if (req.query.token) {
    return req.query.token as string;
  }
  if (req.cookies["jwt"]) {
    return req.cookies["jwt"] as string;
  }
  if (
    req.headers.authorization &&
    req.headers.authorization.split(" ")[0] === "Bearer"
  ) {
    return req.headers.authorization.split(" ")[1];
  }
  return null;
}
