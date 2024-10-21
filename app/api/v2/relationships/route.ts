import { prisma } from "@/db";
import { Relationship } from "@/lib/types/relationship";
import { NextResponse } from "next/server";
import { getUser } from "../authentication";
import { normalizeRelationship } from "../utility";

export interface RelationshipsGetResult {
  normalizedRelationships: Relationship[];
}

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

  return NextResponse.json({
    normalizedRelationships,
  } as RelationshipsGetResult);
}
