import { Game } from "@/lib/datatypes/client/game";

export enum UserRole {
  USER,
  PREMIUM,
  FRIENDS_AND_FAMILY,
  ADMIN,
}

export interface UserProfile {
  id: string;
  name: string;
  role: UserRole;
  realName?: string;
  about?: string;
  place?: string;
  image?: string;
  bggName?: string;
  favorites: Game[];
}

export interface MyUserProfile extends UserProfile {
  email: string;
  profileComplete: boolean;
}
