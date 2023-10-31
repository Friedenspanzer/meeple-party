import { prisma } from "@/db";
import { GameCollection } from "@prisma/client";
import { NextResponse } from "next/server";
import validator from "validator";
import { getUser } from "../../../authentication";

export async function GET(
  request: Request,
  { params }: { params: { gameId: string } }
) {
  if (!validator.isNumeric(params.gameId)) {
    return new Response("Invalid game id", { status: 400 });
  }
  const gameId = Number.parseInt(params.gameId);

  if (gameId < 0 || gameId > 9999999) {
    return new Response("Invalid game id", { status: 400 });
  }

  const userId = (await getUser()).id;

  const result = await prisma.gameCollection.findUnique({
    where: { userId_gameId: { userId, gameId } },
  });

  if (result) {
    return NextResponse.json(result);
  } else {
    return NextResponse.json({
      userId,
      gameId,
      own: false,
      wantToPlay: false,
      wishlist: false,
      updatedAt: null,
    } as GameCollection);
  }
}

export async function PATCH(
  request: Request,
  { params }: { params: { gameId: string } }
) {
  try {
    if (!validator.isNumeric(params.gameId)) {
      return new Response("Invalid game id", { status: 400 });
    }
    const gameId = Number.parseInt(params.gameId);
    const userId = (await getUser()).id;

    if (gameId < 0 || gameId > 9999999) {
      return new Response("Invalid game id", { status: 400 });
    }

    const game = await prisma.game.findUnique({
      where: { id: gameId },
    });

    if (!game) {
      return new Response("Game not found", { status: 404 });
    }

    const data = await request.json();
    const newData = {
      own: data.own ? true : false,
      wantToPlay: data.wantToPlay ? true : false,
      wishlist: data.wishlist ? true : false,
    };

    if (!newData.own && !newData.wantToPlay && !newData.wishlist) {
      await prisma.gameCollection.delete({
        where: { userId_gameId: { userId, gameId } },
      });
      return NextResponse.json({
        userId,
        gameId,
        own: false,
        wantToPlay: false,
        wishlist: false,
      } as GameCollection);
    } else {
      const upsertedData = await prisma.gameCollection.upsert({
        where: { userId_gameId: { gameId, userId } },
        update: newData,
        create: { gameId, userId, ...newData },
      });

      if (upsertedData) {
        return NextResponse.json(upsertedData);
      }
    }
  } catch (e) {
    return new Response("Error", { status: 400 });
  }
  return new Response("Error", { status: 500 });
}
