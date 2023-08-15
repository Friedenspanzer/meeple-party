import { Relationship } from "@/datatypes/relationship";
import { prisma } from "@/db";
import { NextResponse } from "next/server";
import { getUser } from "../../authentication";
import { normalizeRelationship } from "../../utility";

interface RelationshipReadResult {
  normalizedRelationship: Relationship;
}

export type RelationshipGetResult = RelationshipReadResult;
export type RelationshipDeleteResult = RelationshipReadResult;

export async function GET(
  request: Request,
  { params }: { params: { userId: string } }
) {
  const user = await getUser();
  const targetUserId = params.userId;

  checkUserId(targetUserId);

  const normalizedRelationships = await findNormalizedRelationships(
    user.id,
    targetUserId
  );

  if (normalizedRelationships.length > 1) {
    return new Response("More than one relationship found", { status: 500 });
  } else if (!normalizedRelationships || normalizedRelationships.length === 0) {
    return new Response(
      `You don't have a relationship with user ${targetUserId}`,
      { status: 404 }
    );
  } else {
    return NextResponse.json({
      normalizedRelationship: normalizedRelationships[0],
    } as RelationshipGetResult);
  }
}

export async function DELETE(
  request: Request,
  { params }: { params: { userId: string } }
) {
  const user = await getUser();
  const targetUserId = params.userId;

  checkUserId(targetUserId);

  const relationships = await findRelationships(user.id, targetUserId);

  if (relationships.length > 1) {
    return new Response("More than one relationship found", { status: 500 });
  } else if (relationships.length === 0) {
    return new Response(
      `You don't have a relationship with user ${targetUserId}`,
      { status: 404 }
    );
  } else {
    const targetRelationship = relationships[0];

    await prisma.relationship.delete({
      where: {
        senderId_recipientId: {
          recipientId: targetRelationship.recipientId,
          senderId: targetRelationship.senderId,
        },
      },
    });

    return NextResponse.json({
      normalizedRelationship: normalizeRelationship(
        targetRelationship,
        user.id
      ),
    } as RelationshipDeleteResult);
  }
}

function checkUserId(id: string) {
  if (id.length < 20 || id.length > 40) {
    throw new Error("User Profile ID format error");
  }
}

async function findRelationships(selfId: string, otherId: string) {
  return await prisma.relationship.findMany({
    where: {
      OR: [
        { recipientId: selfId, senderId: otherId },
        { recipientId: otherId, senderId: selfId },
      ],
    },
    include: {
      recipient: true,
      sender: true,
    },
  });
}

async function findNormalizedRelationships(selfId: string, otherId: string) {
  const relationships = await findRelationships(selfId, otherId);
  return relationships.map((r) => normalizeRelationship(r, selfId));
}
