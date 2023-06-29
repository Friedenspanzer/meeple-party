import { Relationship } from "@/datatypes/relationship";
import { prisma } from "@/db";
import { normalizeRelationship } from "@/selectors/relationships";
import { User } from "@prisma/client";
import { NextApiRequest, NextApiResponse } from "next";
import { withErrorHandling, withUser } from "../utility";

export interface RelationshipGetResult {
  normalizedRelationships: Relationship[];
}

export default withErrorHandling(
  withUser(async function handle(
    req: NextApiRequest,
    res: NextApiResponse,
    user: User
  ) {
    if (req.method === "GET") {
      const relationships = await prisma.relationship.findMany({
        where: {
          OR: [{ recipientId: user.id }, { senderId: user.id }],
        },
        include: {
          recipient: true,
          sender: true,
        },
      });

      const normalizedRelationships = relationships.map((r) =>
        normalizeRelationship(r, user.id)
      );

      res
        .status(200)
        .json({ normalizedRelationships } as RelationshipGetResult);
    } else {
      res.status(405).send({});
    }
  })
);
