import { getServerSession as nextServerSession } from "next-auth/next";
import { authOptions } from "@/pages/api/auth/[...nextauth]";
import { User } from "@prisma/client";

export const getServerUser = async () => {
  const session = await nextServerSession(authOptions);
  if (!session || !session.user) {
    throw new Error("Could not find user data");
  }
  return session.user as User;
};
