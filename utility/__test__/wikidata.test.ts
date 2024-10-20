import { getWikidataInfo } from "../wikidata";

const WINGSPAN = 266192;

describe("Wikidata", () => {
  it("fetches real data", async () => {
    const result = await getWikidataInfo([WINGSPAN]);
    expect(result.length).toBe(1);

    const wingspan = result[0];
    expect(wingspan.gameId).toBe(WINGSPAN);
    expect(wingspan.wikidataId).toBe(
      "http://www.wikidata.org/entity/Q65784798"
    );

    const german = wingspan.names.find((n) => n.language === "de");
    expect(german).not.toBeUndefined();
    expect(german?.language).toBe("de");
    expect(german?.name).toBe("Flügelschlag");

    const japanese = wingspan.names.find((n) => n.language === "ja");
    expect(japanese).not.toBeUndefined();
    expect(japanese?.language).toBe("ja");
    expect(japanese?.name).toBe("ウイングスパン");
  });
});
