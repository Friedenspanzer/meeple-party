import { UserProfile } from "@prisma/client";
import { createContext } from "react";

export const UserContext = createContext<UserProfile>({
  id: -1,
  email: "",
  name: "",
  picture: null,
  realName: null,
  bggName: null,
});
