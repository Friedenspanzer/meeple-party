import { prisma } from "@/db";
import { FullConfig } from "@playwright/test";
import { ADMIN, USER } from "./constants";

export default async function globalTeardown(config: FullConfig) {
  await prisma.user.delete({ where: { email: ADMIN.email } });
  await prisma.user.delete({ where: { email: USER.email } });
}
