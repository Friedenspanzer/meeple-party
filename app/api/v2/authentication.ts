import { authOptions } from "@/pages/api/auth/[...nextauth]";
import { User } from "@prisma/client";
import { getServerSession } from "next-auth";

export async function getUser(): Promise<User> {
  const session = await getServerSession(authOptions);
  if (!session || !session.user) {
    throw Error("Unauthorized");
  }
  return session.user;
}
