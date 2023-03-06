-- CreateEnum
CREATE TYPE "RelationshipType" AS ENUM ('FRIEND_REQUEST', 'FRIENDSHIP');

-- CreateTable
CREATE TABLE "Relationship" (
    "senderId" INTEGER NOT NULL,
    "recipientId" INTEGER NOT NULL,
    "type" "RelationshipType" NOT NULL,
    "updatedAt" TIMESTAMP(3) NOT NULL,
    "cratedAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "Relationship_pkey" PRIMARY KEY ("senderId","recipientId")
);

-- AddForeignKey
ALTER TABLE "Relationship" ADD CONSTRAINT "Relationship_senderId_fkey" FOREIGN KEY ("senderId") REFERENCES "UserProfile"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Relationship" ADD CONSTRAINT "Relationship_recipientId_fkey" FOREIGN KEY ("recipientId") REFERENCES "UserProfile"("id") ON DELETE CASCADE ON UPDATE CASCADE;
