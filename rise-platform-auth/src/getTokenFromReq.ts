import type { Request } from 'express';

export function getTokenFromReq(
  req: Request,
  { cookie_name }: { cookie_name?: string } = {},
) {
  if (req.query.token) {
    return req.query.token as string;
  }
  if (cookie_name && req.cookies[cookie_name]) {
    return req.cookies[cookie_name] as string;
  }
  if (
    req.headers.authorization &&
    req.headers.authorization.split(' ')[0] === 'Bearer'
  ) {
    return req.headers.authorization.split(' ')[1];
  }
  return null;
}
