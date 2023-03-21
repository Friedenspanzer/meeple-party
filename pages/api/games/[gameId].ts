import { prisma } from "@/db";
import { fetchGames } from "@/utility/games";
import { XMLParser } from "fast-xml-parser";
import { NextApiRequest, NextApiResponse } from "next";

export type SearchResult = {
  id: number;
  name: string;
};

const parser = new XMLParser({
  ignoreAttributes: false,
});

export default async function handle(
  req: NextApiRequest,
  res: NextApiResponse
) {
  try {
    if (req.method === "GET") {
      //TODO Validation
      const { gameId } = req.query;
      if (!gameId) {
        throw new Error("No game ID given");
      }
      const games = await fetchGames(Number.parseInt(gameId as string));
      if (!games || games.length === 0) {
        throw new Error("No game with that ID found");
      }
      res.status(200).json(games[0]);
    } else {
      res.status(405).send({});
    }
  } catch (e) {
    res.status(500).json({ success: false, error: e });
  }
}
