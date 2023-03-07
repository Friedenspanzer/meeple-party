import { UserProfile } from "@prisma/client";

export type PrivateUserProfile = Omit<UserProfile, "bggName" | "email">;
export type PublicUserProfile = Omit<PrivateUserProfile, "realName">;
