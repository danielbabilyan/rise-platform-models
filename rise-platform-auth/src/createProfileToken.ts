import type { Profile } from "@prisma/client";
import jwt from "jsonwebtoken";

export const PROFILE_TOKEN_COOKIE_NAME = "rpj";

export function createProfileToken(profile: Profile) {
  const profile_token = jwt.sign(
    { profile_id: profile.id },
    `${process.env.JWT_SECRET}`,
    { expiresIn: "2d" } // Tow days expiration
  );

  return { profile_token, PROFILE_TOKEN_COOKIE_NAME };
}
