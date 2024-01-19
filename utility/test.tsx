import { FullPrismaRelationship } from "@/app/api/v2/utility";
import { defaultUserPreferences } from "@/datatypes/userProfile";
import { Game } from "@/lib/datatypes/client/game";
import { UserProfile, UserRole } from "@/lib/datatypes/client/userProfile";
import { MantineProvider } from "@mantine/core";
import {
  GameCollection,
  Game as PrismaGame,
  RelationshipType,
  Role,
  User,
} from "@prisma/client";
import { render as testingLibraryRender } from "@testing-library/react";
import { Matcher, MatcherCreator } from "jest-mock-extended";
import { CSSProperties } from "react";

export function getRandomEntry<T>(arr: T[]): T {
  return arr[Math.floor(Math.random() * arr.length)];
}

export function generateString(length = 32) {
  let result = "";
  const characters =
    "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789";
  while (result.length < length) {
    result += characters.charAt(Math.floor(Math.random() * characters.length));
  }
  return result;
}

export function generateNumber(min = 0, max = 999999999) {
  return Math.floor(Math.random() * (max - min + 1)) + min;
}

export function generateBoolean() {
  return Math.random() > 0.5;
}

export function generateArray<T>(generator: () => T, length = 10): T[] {
  const ret: T[] = [];
  for (let i = 0; i < length; i++) {
    ret.push(generator());
  }
  return ret;
}

export function generatePrismaUser(): User {
  return {
    id: generateString(25),
    name: generateString(25),
    about: generateString(1000),
    bggName: generateString(15),
    image: generateString(50),
    place: generateString(15),
    realName: generateString(25),
    role: getRandomEnumValue(Role),
    email: generateString(25),
    profileComplete: true,
    emailVerified: generateDate(),
    preferences: defaultUserPreferences,
  };
}

export function generateUserProfile(): UserProfile {
  return {
    id: generateString(25),
    name: generateString(25),
    about: generateString(1000),
    bggName: generateString(15),
    image: generateString(50),
    place: generateString(15),
    realName: generateString(25),
    role: getRandomEnumValue(UserRole),
    favorites: generateArray(generateGame),
  };
}

export function getStaticUserProfile(index: number): UserProfile {
  return {
    id: `static-profile-${index}`,
    name: `name-${index}`,
    about: `about-${index}`,
    bggName: `bggName-${index}`,
    image: `image-${index}`,
    place: `place-${index}`,
    realName: `realName-${index}`,
    role: UserRole.USER,
    favorites: [],
  };
}

export function generateFullPrismaRelationship(
  type: RelationshipType = RelationshipType.FRIENDSHIP,
  userA?: User,
  userB?: User
): FullPrismaRelationship {
  if (!userA) {
    userA = generatePrismaUser();
  }
  if (!userB) {
    userB = generatePrismaUser();
  }

  return {
    senderId: userA.id,
    recipientId: userB.id,
    type: type,
    sender: userA,
    recipient: userB,
    updatedAt: generateDate(),
    cratedAt: generateDate(),
  };
}

export function generateCollectionEntry(
  userId: string,
  gameId: number
): GameCollection {
  return {
    userId,
    gameId,
    own: generateBoolean(),
    wantToPlay: generateBoolean(),
    wishlist: generateBoolean(),
    updatedAt: generateDate(),
  };
}

export function generatePrismaGame(gameId: number): PrismaGame {
  return {
    id: gameId,
    name: generateString(),
    BGGRank: generateNumber(),
    BGGRating: generateNumber(),
    image: generateString(),
    maxPlayers: generateNumber(),
    minPlayers: generateNumber(),
    playingTime: generateNumber(),
    thumbnail: generateString(),
    weight: generateNumber(),
    year: generateNumber(),
    updatedAt: generateDate(),
  };
}

export function generateGame(): Game {
  return {
    id: generateNumber(),
    name: generateString(),
    BGGRank: generateNumber(),
    BGGRating: generateNumber(),
    image: generateString(),
    maxPlayers: generateNumber(),
    minPlayers: generateNumber(),
    playingTime: generateNumber(),
    thumbnail: generateString(),
    weight: generateNumber(),
    year: generateNumber(),
  };
}

const MAX_DATE_OFFSET = 1000 * 60 * 60 * 24 * 1000;

export function generateDate(): Date {
  const offset = generateNumber(0, MAX_DATE_OFFSET);
  const date = new Date();
  date.setTime(date.getTime() - offset);
  return date;
}

export function generateCssProperties(): CSSProperties {
  const css: CSSProperties = {};

  css.fontWeight = `${generateNumber(100, 900)}`;

  if (generateBoolean()) {
    css.backgroundColor = generateRgbColor();
  }
  if (generateBoolean()) {
    css.fontFamily = generateString();
  }
  if (generateBoolean()) {
    css.left = `${generateNumber()}px`;
  }
  if (generateBoolean()) {
    css.right = `${generateNumber()}px`;
  }
  if (generateBoolean()) {
    css.display = generateBoolean() ? "flex" : "grid";
  }

  return css;
}

export function generateRgbColor() {
  return `rgb(${generateNumber(0, 255)}, ${generateNumber(
    0,
    255
  )}, ${generateNumber(0, 255)})`;
}

export function generateHexColor() {
  const allowed = "1234567890ABCDEF";
  const color = ["#"];
  for (let i = 0; i < 6; i++) {
    color.push(allowed.charAt(generateNumber(0, allowed.length - 1)));
  }
  return color.join("");
}

function getRandomEnumValue<T extends object>(obj: T): T[keyof T] {
  const values = Object.values(obj);
  const index = Math.floor(Math.random() * values.length);
  return values[index];
}

export const objectMatcher: MatcherCreator<any> = (expected) =>
  new Matcher(
    (actual) => JSON.stringify(actual) === JSON.stringify(expected),
    "deep comparison"
  );

export function render(ui: React.ReactNode) {
  return testingLibraryRender(<>{ui}</>, {
    wrapper: ({ children }: { children: React.ReactNode }) => (
      <MantineProvider>{children}</MantineProvider>
    ),
  });
}
