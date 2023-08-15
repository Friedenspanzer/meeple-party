import { FullPrismaRelationship } from "@/app/api/v2/utility";
import { defaultUserPreferences } from "@/datatypes/userProfile";
import { RelationshipType, Role, User } from "@prisma/client";

test("Foo", () => {});

export function generateString(length = 32) {
  let result = "";
  const characters =
    "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789";
  while (result.length < length) {
    result += characters.charAt(Math.floor(Math.random() * characters.length));
  }
  return result;
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
