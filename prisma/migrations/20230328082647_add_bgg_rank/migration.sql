-- AlterTable
ALTER TABLE "Game" ADD COLUMN     "BGGRank" INTEGER NOT NULL DEFAULT 0;

-- Force update for all games
UPDATE "Game" SET "updatedAt" = NULL