-- CreateEnum
CREATE TYPE "Role" AS ENUM ('USER', 'PREMIUM', 'FRIENDS_FAMILY', 'ADMIN');

-- AlterTable
ALTER TABLE "User" ADD COLUMN     "role" "Role" NOT NULL DEFAULT 'USER';

-- CreateTable
CREATE TABLE "FeatureFlag" (
    "id" SERIAL NOT NULL,
    "name" TEXT NOT NULL,
    "roles" "Role"[],

    CONSTRAINT "FeatureFlag_pkey" PRIMARY KEY ("id")
);
