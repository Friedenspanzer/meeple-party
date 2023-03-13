
import { Relationship, RelationshipType } from "@/datatypes/relationship";
import { PrivateUserProfile, PublicUserProfile } from "@/datatypes/userProfile";
import { prisma } from "@/db";
import { Session } from "@auth0/nextjs-auth0";
import { UserProfile as Auth0Profile } from "@auth0/nextjs-auth0/client";
import {
  Relationship as PrismaRelationship,
  UserProfile,
} from "@prisma/client";

export type FullPrismaRelationship = PrismaRelationship & {
  sender: UserProfile;
  recipient: UserProfile;
};

export function normalizeRelationship(
  prismaRelationship: FullPrismaRelationship,
  userId: number
): Relationship {
  return {
    profile: getProfile(prismaRelationship, userId),
    type: getRelationshipType(prismaRelationship, userId),
    lastUpdate: prismaRelationship.updatedAt,
  };
}

export function getRelationshipType(
  relationship: FullPrismaRelationship,
  userId: number
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

export function getProfile(
  relationship: FullPrismaRelationship,
  userId: number
): PrivateUserProfile | PublicUserProfile {
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

export function convertToPrivateProfile(profile: UserProfile): PrivateUserProfile {
  return {
    ...convertToPublicProfile(profile),
    realName: profile.realName,
  };
}

export function convertToPublicProfile(profile: UserProfile): PublicUserProfile {
  return {
    id: profile.id,
    name: profile.name,
    picture: profile.picture,
  };
}

export function isFriendRequestReveiced(
  relationship: FullPrismaRelationship,
  userId: number
): boolean {
  return (
    relationship.type === "FRIEND_REQUEST" &&
    relationship.recipientId === userId
  );
}

export async function getUserProfile(session: Session): Promise<UserProfile> {
  const user = session.user as Auth0Profile;
  if (!user.email) {
    throw new Error("User from Auth0 does not have an E-Mail adress");
  }
  const userProfile = await prisma.userProfile.findUnique({
    where: { email: user.email as string },
  });

  if (!userProfile) {
    throw new Error("No user profile corresponding to Auth0 user found.");
  }

  return userProfile;
}