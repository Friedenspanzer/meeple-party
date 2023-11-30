import { FullPrismaRelationship } from "@/app/api/v2/utility";
import { defaultUserPreferences } from "@/datatypes/userProfile";
import {
  Game,
  GameCollection,
  RelationshipType,
  Role,
  User,
} from "@prisma/client";
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
    email: generateString(25),
    profileComplete: true,
    role: Role.USER,
    emailVerified: new Date(),
    about: generateString(1000),
    bggName: generateString(15),
    image: null,
    place: generateString(15),
    realName: generateString(25),
    preferences: defaultUserPreferences,
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
    updatedAt: new Date(),
    cratedAt: new Date(),
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
    updatedAt: new Date(),
  };
}

export function generateGame(gameId: number): Game {
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
    updatedAt: new Date(),
  };
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

export const objectMatcher: MatcherCreator<any> = (expected) =>
  new Matcher(
    (actual) => JSON.stringify(actual) === JSON.stringify(expected),
    "deep comparison"
  );
