import { prisma } from "@/db";
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
      const { term } = req.query;
      const searchResults = await Promise.all([
        searchInDatabase(term as string),
        searchOnBgg(term as string),
      ]).then(mergeSearchResults);
      res.status(200).json(searchResults);
    } else {
      res.status(405).send({});
    }
  } catch (e) {
    res.status(500).json({ success: false, error: e });
  }
}

async function searchInDatabase(term: string): Promise<SearchResult[]> {
  const result = await prisma.game.findMany({
    where: { name: { contains: term, mode: "insensitive" } },
  });
  return result.map((r) => ({ id: r.id, name: r.name }));
}

async function searchOnBgg(term: string): Promise<SearchResult[]> {
  //TODO Better error handling
  return fetch(`https://api.geekdo.com/xmlapi/search?search=${term}`)
    .then((response) => response.text())
    .then((xml) => parser.parse(xml))
    .then((bggGames) => bggGames.boardgames.boardgame.map(convertBggResult));
}

function convertBggResult(bggObject: any): SearchResult {
  return {
    id: Number.parseInt(bggObject["@_objectid"]),
    name: bggObject.name["#text"],
  };
}

async function mergeSearchResults(
  searches: SearchResult[][]
): Promise<SearchResult[]> {
  const result = [] as SearchResult[];
  searches.forEach((search) => {
    search.forEach((r) => {
      if (!result.find((s) => s.id === r.id)) {
        result.push(r);
      }
    });
  });
  return result;
}
