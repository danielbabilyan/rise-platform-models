import type { Account, Profile, User } from "@prisma/client";

export type ProfileContext = Profile & {
  users: (User & {
    account: Account;
  })[];
};

export type UserContext = User & {
  account: Account;
  profile: Profile;
};
