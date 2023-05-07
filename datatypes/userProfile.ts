import { User } from "@prisma/client";

export type PrivateUser = Omit<
  User,
  "bggName" | "email" | "emailVerified" | "profileComplete" | "preferences"
>;
export type PublicUser = Omit<PrivateUser, "realName" | "place">;

export type UserPreferences = {
  sendAnalyticsData: boolean;
};

export const defaultUserPreferences: UserPreferences = {
  sendAnalyticsData: false,
};
