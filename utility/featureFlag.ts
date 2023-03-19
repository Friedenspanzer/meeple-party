import { prisma } from "@/db";
import { getServerUser } from "./serverSession";

export async function useFeatureFlagServer(flag: string): Promise<boolean> {
  const user = await getServerUser();
  const dbResult = await prisma.featureFlag.count({
    where: { roles: { has: user.role }, name: flag },
  });
  return dbResult > 0;
}
