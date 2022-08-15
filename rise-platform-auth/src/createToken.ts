import type { Profile, User } from "@giftwizard/rise-platform-db";
import jwt from "jsonwebtoken";

export function createToken(profile: Profile, user?: User) {
  const token = jwt.sign(
    { profile_id: profile.id, user_id: user ? user.id : null },
    `${process.env.JWT_SECRET}`,
    { expiresIn: "2d" } // Tow days expiration
  );

  return token;
}
