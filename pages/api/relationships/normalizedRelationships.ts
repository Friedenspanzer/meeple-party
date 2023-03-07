import { Relationship, RelationshipType } from "@/datatypes/relationship";
import {
  PrivateUserProfile,
  PublicUserProfile,
} from "@/datatypes/userProfile";
import { prisma } from "@/db";
import { getSession, withApiAuthRequired } from "@auth0/nextjs-auth0";
import { UserProfile as Auth0Profile } from "@auth0/nextjs-auth0/client";
import {
  Relationship as PrismaRelationship,
  UserProfile,
} from "@prisma/client";
import { NextApiRequest, NextApiResponse } from "next";

export default withApiAuthRequired(async function handle(
  req: NextApiRequest,
  res: NextApiResponse
) {
  if (req.method === "GET") {
    const session = await getSession(req, res);
    if (!!session) {
      const user = session.user as Auth0Profile;
      if (!user.email) {
        throw new Error("User from Auth0 does not have an E-Mail adress");
      }
      const userProfile = await prisma.userProfile.findUnique({
        where: { email: user.email as string },
      });

      if (!userProfile) {
        //TODO Better error handling
        return res.status(500).send({});
      }

      const relationships = await prisma.relationship.findMany({
        where: {
          OR: [{ recipientId: userProfile.id }, { senderId: userProfile.id }],
        },
        include: {
          recipient: true,
          sender: true,
        },
      });

      const normalizedRelationships = relationships.map((r) =>
        normalizeRelationship(r, userProfile.id)
      );

      res.status(200).json(normalizedRelationships);
    } else {
      res.status(401).send({});
    }
  } else {
    res.status(405).send({});
  }
});

type FullPrismaRelationship = PrismaRelationship & {
  sender: UserProfile;
  recipient: UserProfile;
};

function normalizeRelationship(
  prismaRelationship: FullPrismaRelationship,
  userId: number
): Relationship {
  return {
    profile: getProfile(prismaRelationship, userId),
    type: getRelationshipType(prismaRelationship, userId),
    lastUpdate: prismaRelationship.updatedAt,
  };
}

function getRelationshipType(
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

function getProfile(
  relationship: FullPrismaRelationship,
  userId: number
): PrivateUserProfile | PublicUserProfile {
  const profile =
    relationship.recipientId === userId
      ? relationship.sender
      : relationship.recipient;
  if (relationship.type === "FRIENDSHIP") {
    return convertToPrivateProfile(profile);
  } else {
    return convertToPublicProfile(profile);
  }
}

function convertToPrivateProfile(profile: UserProfile): PrivateUserProfile {
  return {
    ...convertToPublicProfile(profile),
    realName: profile.realName,
  };
}

function convertToPublicProfile(profile: UserProfile): PublicUserProfile {
  return {
    id: profile.id,
    name: profile.name,
    picture: profile.picture,
  };
}
