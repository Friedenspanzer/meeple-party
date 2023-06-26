"use client";

import { User } from "@prisma/client";
import { useSession } from "next-auth/react";
import { createContext, useContext, useMemo } from "react";

interface UserProviderProps {
  children?: React.ReactNode;
}

interface UserContext {
  user?: User;
  loading: boolean;
  update: () => void;
}

const UserContext = createContext<UserContext>({
  loading: true,
  update: () => {},
});

const UserProvider: React.FC<UserProviderProps> = ({ children }) => {
  const session = useSession();

  if (!session) {
    throw new Error(
      "Could not load session details. Did you forget using the UserProvider within an AuthProvider?"
    );
  }

  if (session.status === "authenticated" && !session.data?.user) {
    throw new Error("Could not load user from session.");
  }

  const value = useMemo(
    () => ({
      user: session.data?.user as User,
      loading: session.status === "loading",
      update: () => session.update(),
    }),
    [session]
  );

  return <UserContext.Provider value={value}>{children}</UserContext.Provider>;
};

export function useUser() {
  const context = useContext(UserContext);
  if (!context) {
    throw new Error("useUserProfile must be used within a UserProvider");
  }
  return context;
}

export default UserProvider;
