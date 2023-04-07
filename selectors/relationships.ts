import { PrivateUser, PublicUser } from "@/datatypes/userProfile";
import { prisma } from "@/db";
import {
  Relationship as PrismaRelationship,
  RelationshipType as PrismaRelationshipType,
  User,
} from "@prisma/client";
import { Relationship, RelationshipType } from "@/datatypes/relationship";

export async function getFriends(userId: string): Promise<PrivateUser[]> {
  const friends = await prisma.relationship.findMany({
    where: {
      type: PrismaRelationshipType.FRIENDSHIP,
      OR: [{ recipientId: userId }, { senderId: userId }],
    },
    include: {
      recipient: true,
      sender: true,
    },
  });

  const normalizedRelationships = friends.map((r) =>
    normalizeRelationship(r, userId)
  );

  return normalizedRelationships.map((r) => r.profile as PrivateUser);
}

type FullPrismaRelationship = PrismaRelationship & {
  sender: User;
  recipient: User;
};

export function normalizeRelationship(
  prismaRelationship: FullPrismaRelationship,
  userId: string
): Relationship {
  return {
    profile: getProfile(prismaRelationship, userId),
    type: getRelationshipType(prismaRelationship, userId),
    lastUpdate: prismaRelationship.updatedAt,
  };
}

function getProfile(
  relationship: FullPrismaRelationship,
  userId: string
): PrivateUser | PublicUser {
  const profile =
    relationship.recipientId === userId
      ? relationship.sender
      : relationship.recipient;
  if (
    relationship.type === "FRIENDSHIP" ||
    isFriendRequestReveiced(relationship, userId)
  ) {
    return convertToPrivateProfile(profile);
  } else {
    return convertToPublicProfile(profile);
  }
}

function isFriendRequestReveiced(
  relationship: FullPrismaRelationship,
  userId: string
): boolean {
  return (
    relationship.type === "FRIEND_REQUEST" &&
    relationship.recipientId === userId
  );
}

function convertToPrivateProfile(user: User): PrivateUser {
  return {
    ...convertToPublicProfile(user),
    realName: user.realName,
    place: user.place,
  };
}

function convertToPublicProfile(user: User): PublicUser {
  return {
    id: user.id,
    name: user.name,
    image: user.image,
    role: user.role,
    about: user.about,
    preference: user.preference,
  };
}

function getRelationshipType(
  relationship: FullPrismaRelationship,
  userId: string
): RelationshipType {
  if (relationship.type === "FRIENDSHIP") {
    return RelationshipType.FRIENDSHIP;
  } else if (relationship.type === "FRIEND_REQUEST") {
    if (relationship.sender.id === userId) {
      return RelationshipType.FRIEND_REQUEST_SENT;
    } else {
      return RelationshipType.FRIEND_REQUEST_RECEIVED;
    }
  }
  throw new Error("Error determining relationship type");
}
