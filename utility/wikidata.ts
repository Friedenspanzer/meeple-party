import { Game } from "@/datatypes/game";
import axios from "axios";

const endpointBase = "https://query.wikidata.org/sparql?format=json&query=";

type Result = {
  wikidataId: string;
  names: Name[];
};

type Name = { name: string; language: string };

export async function getWikidataInfo(games: Game[]) {
  const result = [];
  for (let game of games) {
    const data = await getTranslatedGameNames(game.id);
    result.push({ gameId: game.id, ...data });
  }
  return result;
}

export async function getTranslatedGameNames(
  bggId: number
): Promise<Result | undefined> {
  //TODO Add tests
  const query = getQuery(bggId);
  const uri = endpointBase + encodeURI(query);
  return axios
    .get(uri)
    .then((response) => response.data)
    .then(parseData)
    .then(filterData);
}

function filterData(result: Result | undefined): Result | undefined {
  if (!result) {
    return result;
  }
  return {
    wikidataId: result.wikidataId,
    names: result.names.filter((n) => n.language.length === 2),
  };
}

function parseData(data: any): Result | undefined {
  if (data?.results?.bindings && Array.isArray(data.results.bindings)) {
    if (data.results.bindings.length === 0) {
      return undefined;
    }
    const wikidataId = data.results.bindings[0].game.value;
    const names = data.results.bindings.map(parseResult);
    return { wikidataId, names };
  } else {
    console.warn(
      "Wrong format encountered when parsing WikiData response.",
      data
    );
  }
}

function parseResult(data: any): Name {
  return {
    language: data.language.value,
    name: data.name.value,
  };
}

function getQuery(bggId: number): string {
  return `SELECT ?game ?name (lang(?name) as ?language) WHERE { ?game wdt:P31 wd:Q131436 ; rdfs:label ?name ; wdt:P2339 "${bggId}" . }`;
}
