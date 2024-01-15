import { User } from "@prisma/client";

/**
 * @deprecated This type should be replaced by the Data Layer V2 version
 */
export type UserProfile = Omit<
  User,
  "email" | "emailVerified" | "profileComplete" | "preferences"
>;

/**
 * @deprecated This type should be replaced by the Data Layer V2 version
 */
export type UserPreferences = {
  sendAnalyticsData: boolean;
  showRealNameInProfile: boolean;
  showPlaceInProfile: boolean;
  allowSearchByPlace: boolean;
  pageLanguage: string;
  gameLanguage: string;
};

/**
 * @deprecated This constant should be replaced by the Data Layer V2 version
 */
export const defaultUserPreferences: UserPreferences = {
  sendAnalyticsData: false,
  showRealNameInProfile: false,
  showPlaceInProfile: false,
  allowSearchByPlace: false,
  pageLanguage: "auto",
  gameLanguage: "follow",
};
