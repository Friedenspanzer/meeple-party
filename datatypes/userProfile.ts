import { User } from "@prisma/client";

export type UserProfile = Omit<
  User,
  "email" | "emailVerified" | "profileComplete" | "preferences"
>;

export type UserPreferences = {
  sendAnalyticsData: boolean;
  showRealNameInProfile: boolean;
};

export const defaultUserPreferences: UserPreferences = {
  sendAnalyticsData: false,
  showRealNameInProfile: false
};
