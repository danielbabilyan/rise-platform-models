import type { User } from "@giftwizard/rise-platform-db";
import jwt from "jsonwebtoken";

export const USER_TOKEN_COOKIE_NAME = "user_token";

export function createUserToken(user: User) {
  const user_token = jwt.sign(
    { user_id: user.id },
    `${process.env.JWT_SECRET}`,
    { expiresIn: "2d" } // Tow days expiration
  );

  return { user_token, USER_TOKEN_COOKIE_NAME };
}
