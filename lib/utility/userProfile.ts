import {
  defaultUserPreferences,
  UserPreferences,
} from "@/lib/types/userProfile";
import { Prisma, User } from "@prisma/client";

export function getUserPreferences(user: User): UserPreferences {
  const preferences = user.preferences as Prisma.JsonObject;
  return {
    ...defaultUserPreferences,
    ...preferences,
  };
}
