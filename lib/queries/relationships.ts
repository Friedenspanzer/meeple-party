import { RelationshipType } from "@prisma/client";

export const myFriends = (userId: string) => ({
  type: RelationshipType.FRIENDSHIP,
  OR: [{ recipientId: userId }, { senderId: userId }],
});
