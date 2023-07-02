-- DropForeignKey
ALTER TABLE "GameCollection" DROP CONSTRAINT "GameCollection_gameId_fkey";

-- DropForeignKey
ALTER TABLE "GameCollection" DROP CONSTRAINT "GameCollection_userId_fkey";

-- AddForeignKey
ALTER TABLE "GameCollection" ADD CONSTRAINT "GameCollection_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "GameCollection" ADD CONSTRAINT "GameCollection_gameId_fkey" FOREIGN KEY ("gameId") REFERENCES "Game"("id") ON DELETE CASCADE ON UPDATE CASCADE;
