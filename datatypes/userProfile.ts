import { User } from "@prisma/client";

export type PrivateUser = Omit<User, "bggName" | "email" | "emailVerified" | "profileComplete">;
export type PublicUser = Omit<PrivateUser, "realName" | "place">;
