/**
 * @jest-environment node
 */
import { prismaMock } from "@/lib/utility/prismaMock";
import {
    generateBoolean,
    generateCollectionEntry,
    generateGame,
    generateNumber,
    generatePrismaUser,
    generateString,
    getRandomEntry,
    objectMatcher,
} from "@/lib/utility/test";
import { GameCollection } from "@prisma/client";
import { mockDeep, mockReset } from "jest-mock-extended";
import "whatwg-fetch";
import { getUser } from "../../../authentication";
import { GET, PATCH } from "./route";

jest.mock("../../../authentication");

const requestMock = mockDeep<Request>();
const myUser = generatePrismaUser();
const getUserMock = jest.mocked(getUser);

describe("GET game/[gameId]/collection", () => {
  beforeEach(() => {
    mockReset(requestMock);
    mockReset(getUserMock);

    getUserMock.mockResolvedValue(myUser);
  });
  it("returns an existing collection entry", async () => {
    const gameId = generateNumber(1, 9999999);
    const collection = generateCollectionEntry(myUser.id, gameId);

    prismaMock.gameCollection.findUnique
      .calledWith(
        objectMatcher({
          where: { userId_gameId: { userId: myUser.id, gameId } },
        })
      )
      .mockResolvedValue(collection);

    const result = await GET(requestMock, {
      params: { gameId: gameId.toString() },
    });
    const value = await result.json();

    expect(result.status).toBe(200);
    expect(value).toEqual({
      ...collection,
      updatedAt: collection.updatedAt?.toISOString(),
    });
  });
  it("returns empty when no collection entry exists", async () => {
    const gameId = generateNumber(1, 9999999);

    prismaMock.gameCollection.findUnique
      .calledWith(
        objectMatcher({
          where: { userId_gameId: { userId: myUser.id, gameId } },
        })
      )
      .mockResolvedValue(null);

    const result = await GET(requestMock, {
      params: { gameId: gameId.toString() },
    });
    const value = await result.json();

    expect(prismaMock.gameCollection.findUnique).toHaveBeenCalledWith({
      where: { userId_gameId: { gameId, userId: myUser.id } },
    });
    expect(value).toEqual({
      userId: myUser.id,
      gameId,
      own: false,
      wantToPlay: false,
      wishlist: false,
      updatedAt: null,
    } as GameCollection);
  });
  it("fails for non-numeric game ids", async () => {
    const gameId = generateString();

    const result = await GET(requestMock, {
      params: { gameId: gameId },
    });

    expect(result.status).toBe(400);
  });
  it("fails for negative game ids", async () => {
    const gameId = generateNumber() * -1;

    const result = await GET(requestMock, {
      params: { gameId: gameId.toString() },
    });

    expect(result.status).toBe(400);
  });
  it("fails for big game ids", async () => {
    const gameId = 10000000;

    const result = await GET(requestMock, {
      params: { gameId: gameId.toString() },
    });

    expect(result.status).toBe(400);
  });
});

describe("PATCH game/[gameId]/collection", () => {
  beforeEach(() => {
    mockReset(requestMock);
    mockReset(getUserMock);

    getUserMock.mockResolvedValue(myUser);
  });
  it("upserts collection entry", async () => {
    const gameId = generateNumber(1, 9999999);
    const sentCollectionData = {
      own: true,
      wantToPlay: generateBoolean(),
      wishlist: generateBoolean(),
    } as Partial<GameCollection>;
    const returnedCollection = generateCollectionEntry(myUser.id, gameId);

    prismaMock.gameCollection.upsert
      .calledWith(
        objectMatcher({
          where: { userId_gameId: { gameId, userId: myUser.id } },
          update: sentCollectionData,
          create: { gameId, userId: myUser.id, ...sentCollectionData },
        })
      )
      .mockResolvedValue(returnedCollection);
    prismaMock.game.findUnique.mockResolvedValue(generateGame(gameId));

    requestMock.json.mockResolvedValue(sentCollectionData);
    const result = await PATCH(requestMock, {
      params: { gameId: gameId.toString() },
    });

    expect(result.status).toBe(200);

    const value = await result.json();
    expect(value).toEqual({
      ...returnedCollection,
      updatedAt: returnedCollection.updatedAt?.toISOString(),
      gameId,
      userId: myUser.id,
    });
  });
  it("upserts partial data", async () => {
    const gameId = generateNumber(1, 9999999);
    const sentCollectionData = {} as { [key: string]: any };
    const returnedCollection = generateCollectionEntry(myUser.id, gameId);
    const possibleKeys = ["own", "wantToPlay", "wishlist"];

    possibleKeys.forEach((key) => {
      if (generateBoolean()) {
        sentCollectionData[key] = generateBoolean();
      }
    });

    if (Object.keys(sentCollectionData).length === 0) {
      sentCollectionData[getRandomEntry(possibleKeys)] = generateBoolean();
    }

    if (
      !Object.keys(sentCollectionData).some(
        (key) => sentCollectionData[key] === true
      )
    ) {
      sentCollectionData[getRandomEntry(possibleKeys)] = true;
    }

    const expectedData: Partial<GameCollection> = {
      own: sentCollectionData.own ? true : false,
      wantToPlay: sentCollectionData.wantToPlay ? true : false,
      wishlist: sentCollectionData.wishlist ? true : false,
    };

    prismaMock.gameCollection.upsert
      .calledWith(
        objectMatcher({
          where: { userId_gameId: { gameId, userId: myUser.id } },
          update: expectedData,
          create: { gameId, userId: myUser.id, ...expectedData },
        })
      )
      .mockResolvedValue(returnedCollection);
    prismaMock.game.findUnique.mockResolvedValue(generateGame(gameId));

    requestMock.json.mockResolvedValue(sentCollectionData);
    const result = await PATCH(requestMock, {
      params: { gameId: gameId.toString() },
    });
    expect(result.status).toBe(200);

    const value = await result.json();

    expect(value).toEqual({
      ...returnedCollection,
      updatedAt: returnedCollection.updatedAt?.toISOString(),
      gameId,
      userId: myUser.id,
    });
  });
  it("deletes an empty collection entry", async () => {
    const gameId = generateNumber(1, 9999999);
    const sentCollectionData = {
      own: false,
      wantToPlay: false,
      wishlist: false,
    } as Partial<GameCollection>;
    const returnedCollection = generateCollectionEntry(myUser.id, gameId);

    prismaMock.gameCollection.delete
      .calledWith(
        objectMatcher({
          where: { userId_gameId: { gameId, userId: myUser.id } },
        })
      )
      .mockResolvedValue(returnedCollection);
    prismaMock.game.findUnique.mockResolvedValue(generateGame(gameId));

    requestMock.json.mockResolvedValue(sentCollectionData);
    const result = await PATCH(requestMock, {
      params: { gameId: gameId.toString() },
    });

    const value = await result.json();

    expect(result.status).toBe(200);
    expect(prismaMock.gameCollection.upsert).toBeCalledTimes(0);
    expect(value.userId).toBe(myUser.id);
    expect(value.gameId).toBe(gameId);
    expect(value.own).toBe(false);
    expect(value.wantToPlay).toBe(false);
    expect(value.wishlist).toBe(false);
  });
  it("fails for malformed data", async () => {
    const gameId = generateNumber(1, 9999999);
    const sentCollectionData = {} as { [key: string]: any };

    for (let i = 0; i < generateNumber(0, 10); i++) {
      sentCollectionData[generateString()] = generateBoolean();
    }

    prismaMock.game.findUnique.mockResolvedValue(generateGame(gameId));

    const result = await PATCH(requestMock, {
      params: { gameId: gameId.toString() },
    });
    expect(result.status).toBe(400);
  });
  it("fails when game does not exist", async () => {
    const gameId = generateNumber(1, 9999999);

    prismaMock.game.findUnique.mockResolvedValue(null);

    const result = await PATCH(requestMock, {
      params: { gameId: gameId.toString() },
    });

    expect(result.status).toBe(404);
  });
  it("fails for non-numeric game ids", async () => {
    const gameId = generateString();

    const result = await PATCH(requestMock, {
      params: { gameId: gameId },
    });

    expect(result.status).toBe(400);
  });
  it("fails for negative game ids", async () => {
    const gameId = generateNumber() * -1;

    const result = await PATCH(requestMock, {
      params: { gameId: gameId.toString() },
    });

    expect(result.status).toBe(400);
  });
  it("fails for big game ids", async () => {
    const gameId = 10000000;

    const result = await PATCH(requestMock, {
      params: { gameId: gameId.toString() },
    });

    expect(result.status).toBe(400);
  });
});
