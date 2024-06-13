import { prisma } from "@/db";
import { getGameData } from "@/utility/games";
import { NextResponse } from "next/server";
import { getCronAuthToken } from "../../utility";

interface UpdateGamesResult {
  success: boolean;
}

const AUTHENTICATION_HEADER_NAME = "CronAuth";

//TODO Test, document
export async function PATCH(request: Request) {
  try {
    const token = getCronAuthToken();
    if (
      !request.headers.has(AUTHENTICATION_HEADER_NAME) ||
      request.headers.get(AUTHENTICATION_HEADER_NAME) !== token
    ) {
      throw "Wrong authentication header";
    }
  } catch (error) {
    console.error(error);
    return NextResponse.json({ success: false } as UpdateGamesResult, {
      status: 403,
    });
  }

  try {
    const gamesToUpdate = await prisma.game.findMany({
      where: { updatedAt: { lte: new Date() } },
      select: { id: true },
      orderBy: { updatedAt: "asc" },
      take: 10,
    });

    await getGameData(gamesToUpdate.map((g) => g.id));

    return NextResponse.json({ success: true } as UpdateGamesResult);
  } catch (error) {
    return NextResponse.json({ success: false } as UpdateGamesResult);
  }
}
