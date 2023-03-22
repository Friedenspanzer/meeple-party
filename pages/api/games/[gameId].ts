import { fetchGames } from "@/utility/games";
import { XMLParser } from "fast-xml-parser";
import { NextApiRequest, NextApiResponse } from "next";
import validator from "validator";

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
      const { gameId } = req.query;
      if (!gameId || Array.isArray(gameId) || !validator.isInt(gameId)) {
        throw new Error("Error parsing game id.");
      }
      const games = await fetchGames(validator.toInt(gameId));
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
