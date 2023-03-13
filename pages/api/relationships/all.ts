import { Relationship, RelationshipType } from "@/datatypes/relationship";
import { PrivateUserProfile, PublicUserProfile } from "@/datatypes/userProfile";
import { prisma } from "@/db";
import { getSession, Session, withApiAuthRequired } from "@auth0/nextjs-auth0";
import { UserProfile as Auth0Profile } from "@auth0/nextjs-auth0/client";
import {
  Relationship as PrismaRelationship,
  UserProfile,
} from "@prisma/client";
import { NextApiRequest, NextApiResponse } from "next";
import { getUserProfile, normalizeRelationship } from "./utility";

export default withApiAuthRequired(async function handle(
  req: NextApiRequest,
  res: NextApiResponse
) {
  const session = await getSession(req, res);
  if (!session) {
    res.status(401).send({});
  } else {
    try {
      const userProfile = await getUserProfile(session);

      if (req.method === "GET") {
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
        res.status(405).send({});
      }
    } catch (e) {
      return res.status(500).json({ success: false, error: e });
    }
  }
});
