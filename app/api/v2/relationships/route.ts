import { prisma } from "@/db";
import { NextResponse } from "next/server";
import { getUser, normalizeRelationship } from "../utility";

export async function GET(request: Request) {
  const user = await getUser();
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

  return NextResponse.json(normalizedRelationships);
}
