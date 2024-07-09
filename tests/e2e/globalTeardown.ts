import { prisma } from "@/db";
import { FullConfig } from "@playwright/test";
import { PLAYWRIGHT_TEST_USER_PLACE } from "./utility";

export default async function globalTeardown(config: FullConfig) {
  await prisma.user.deleteMany({
    where: { place: PLAYWRIGHT_TEST_USER_PLACE },
  });
}
