-- CreateTable
CREATE TABLE "Game" (
    "id" INTEGER NOT NULL,
    "name" TEXT NOT NULL,
    "thumbnail" TEXT,
    "image" TEXT,
    "year" INTEGER NOT NULL,
    "playingTime" INTEGER NOT NULL,
    "minPlayers" INTEGER NOT NULL,
    "maxPlayers" INTEGER NOT NULL,
    "updatedAt" TIMESTAMP(3),

    CONSTRAINT "Game_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "GameCollection" (
    "userId" INTEGER NOT NULL,
    "gameId" INTEGER NOT NULL,
    "own" BOOLEAN NOT NULL,
    "wantToPlay" BOOLEAN NOT NULL,
    "wishlist" BOOLEAN NOT NULL,

    CONSTRAINT "GameCollection_pkey" PRIMARY KEY ("userId","gameId")
);

-- AddForeignKey
ALTER TABLE "GameCollection" ADD CONSTRAINT "GameCollection_userId_fkey" FOREIGN KEY ("userId") REFERENCES "UserProfile"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "GameCollection" ADD CONSTRAINT "GameCollection_gameId_fkey" FOREIGN KEY ("gameId") REFERENCES "Game"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
