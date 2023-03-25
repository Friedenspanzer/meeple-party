import { prisma } from "@/db";
import { withUser } from "@/utility/apiAuth";
import { User } from "@prisma/client";
import { NextApiRequest, NextApiResponse } from "next";
import { normalizeRelationship } from "./utility";

export default withUser(async function handle(
  req: NextApiRequest,
  res: NextApiResponse,
  user: User
) {
  try {
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

      res.status(200).json(normalizedRelationships);
    } else {
      res.status(405).send({});
    }
  } catch (e) {
      console.error(e);
      return res.status(500).json({ success: false, error: e });
  }
});
