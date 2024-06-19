import { prisma } from "@/db";
import { generateString } from "@/utility/test";
import { FullConfig, chromium } from "@playwright/test";
import { ADMIN, ADMIN_STORAGE, USER, USER_STORAGE } from "./constants";

export default async function globalSetup(config: FullConfig) {
  const adminUser = await prisma.user.create({
    data: { ...ADMIN, role: "ADMIN" },
  });
  const adminSession = await prisma.session.create({
    data: {
      userId: adminUser.id,
      sessionToken: generateString(),
      expires: new Date(Date.now() + 1000 * 60 * 60 * 24 * 7),
    },
  });

  const user = await prisma.user.create({
    data: { ...USER, role: "USER" },
  });
  const userSession = await prisma.session.create({
    data: {
      userId: user.id,
      sessionToken: generateString(),
      expires: new Date(Date.now() + 1000 * 60 * 60 * 24 * 7),
    },
  });

  const browser = await chromium.launch();
  const adminContext = await browser.newContext();
  await adminContext.addCookies([
    {
      name: "next-auth.session-token",
      value: adminSession.sessionToken,
      url: "https://127.0.0.1:3000",
      httpOnly: true,
    },
  ]);
  await adminContext.storageState({
    path: ADMIN_STORAGE,
  });

  const userContext = await browser.newContext();
  await userContext.addCookies([
    {
      name: "next-auth.session-token",
      value: userSession.sessionToken,
      url: "https://127.0.0.1:3000",
      httpOnly: true,
    },
  ]);
  await userContext.storageState({ path: USER_STORAGE });

  await browser.close();
}
