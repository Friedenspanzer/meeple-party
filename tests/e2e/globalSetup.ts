import { prisma } from "@/db";
import { getGameData } from "@/utility/games";
import { generateString } from "@/utility/test";
import { FullConfig, chromium } from "@playwright/test";
import { ADMIN, ADMIN_STORAGE, USER, USER_STORAGE } from "./constants";

export const AVAILABLE_GAMES = [
  224517, 161936, 174430, 342942, 233078, 316554, 167791, 115746, 187645,
  291457, 162886, 220308, 12333, 182028, 193738, 84876, 169786, 246900, 173346,
  28720, 167355, 266507, 177736, 124361, 205637, 266192, 341169, 120677, 312484,
  295770, 237182, 164928, 192135, 96848, 199792, 251247, 324856, 183394, 175914,
  366013, 285774, 256960, 247763, 3076, 295947, 521, 102794, 284378, 185343,
  170216, 184267, 314040, 31260, 255984, 221107, 161533, 205059, 253344, 126163,
  276025,
];

export default async function globalSetup(config: FullConfig) {
  await createUsers();
  await createGames();
}

async function createUsers() {
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

async function createGames() {
  await getGameData(AVAILABLE_GAMES);
}
