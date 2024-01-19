/**
 * @jest-environment node
 */
import { prismaMock } from "@/utility/prismaMock";
import {
  generateArray,
  generateBoolean,
  generateCollectionEntry,
  generateNumber,
  generatePrismaGame,
  generatePrismaUser,
  generateString,
  objectMatcher,
} from "@/utility/test";
import {
  GameCollection,
  Relationship,
  RelationshipType,
  User,
} from "@prisma/client";
import { mockDeep, mockReset } from "jest-mock-extended";
import "whatwg-fetch";
import { getUser } from "../../../authentication";
import { GET, GameCollectionResult } from "./route";

jest.mock("../../../authentication");

const requestMock = mockDeep<Request>();
const myUser = generatePrismaUser();
const getUserMock = jest.mocked(getUser);

type UserWithCollectionAndRelationships =
  | (User & {
      games: GameCollection[];
      sentRelationships: Relationship[];
      receivedRelationships: Relationship[];
    })
  | null;

describe("GET game/[gameId]/collection", () => {
  beforeEach(() => {
    mockReset(requestMock);
    mockReset(getUserMock);

    getUserMock.mockResolvedValue(myUser);
  });
  it("returns 404 for non-existant users", async () => {
    const userId = generateString();

    const queryMock = prismaMock.user.findUnique.calledWith(
      objectMatcher({
        where: { id: userId },
        include: {
          games: {
            include: {
              game: true,
            },
          },
          receivedRelationships: true,
          sentRelationships: true,
        },
      })
    );
    queryMock.mockResolvedValue(null);

    const result = await GET(requestMock, { params: { userId } });

    expect(result.status).toBe(404);
    expect(queryMock).toHaveBeenCalledTimes(1);
  });
  it("returns returns 403 for strangers", async () => {
    const user = generatePrismaUser();
    const userCollection = generateArray(() =>
      generateCollectionEntry(myUser.id, generateNumber())
    ).map((c) => ({
      ...c,
      game: generatePrismaGame(c.gameId),
    }));
    const actualResult: UserWithCollectionAndRelationships = {
      ...user,
      games: userCollection,
      sentRelationships: [],
      receivedRelationships: [],
    };

    const queryMock = prismaMock.user.findUnique.calledWith(
      objectMatcher({
        where: { id: user.id },
        include: {
          games: {
            include: {
              game: true,
            },
          },
          receivedRelationships: true,
          sentRelationships: true,
        },
      })
    );
    queryMock.mockResolvedValue(actualResult);

    const result = await GET(requestMock, { params: { userId: user.id } });

    expect(result.status).toBe(403);
    expect(queryMock).toHaveBeenCalledTimes(1);
  });
  it("returns collection for myself", async () => {
    const userCollection = generateArray(() =>
      generateCollectionEntry(myUser.id, generateNumber())
    ).map((c) => ({
      ...c,
      game: generatePrismaGame(c.gameId),
    }));
    const queryResult: UserWithCollectionAndRelationships = {
      ...myUser,
      games: userCollection,
      sentRelationships: [],
      receivedRelationships: [],
    };

    const queryMock = prismaMock.user.findUnique.calledWith(
      objectMatcher({
        where: { id: myUser.id },
        include: {
          games: {
            include: {
              game: true,
            },
          },
          receivedRelationships: true,
          sentRelationships: true,
        },
      })
    );
    queryMock.mockResolvedValue(queryResult);

    const result = await GET(requestMock, { params: { userId: myUser.id } });
    const actualResult = (await result.json()) as GameCollectionResult;

    const expectedResult = {
      userId: myUser.id,
      collection: userCollection.map((c) => ({
        game: c.game,
        own: c.own,
        wantToPlay: c.wantToPlay,
        wishlist: c.wishlist,
      })),
    };

    expect(result.status).toBe(200);
    expect(queryMock).toHaveBeenCalledTimes(1);
    expect(actualResult).toEqual(JSON.parse(JSON.stringify(expectedResult)));
  });
  it("returns collection for friends", async () => {
    const user = generatePrismaUser();
    const userCollection = generateArray(() =>
      generateCollectionEntry(myUser.id, generateNumber())
    ).map((c) => ({
      ...c,
      game: generatePrismaGame(c.gameId),
    }));
    const queryResult: UserWithCollectionAndRelationships = {
      ...user,
      games: userCollection,
      sentRelationships: [],
      receivedRelationships: [],
    };

    if (generateBoolean()) {
      queryResult.sentRelationships.push({
        senderId: user.id,
        recipientId: myUser.id,
        type: RelationshipType.FRIENDSHIP,
        updatedAt: new Date(),
        cratedAt: new Date(),
      });
    } else {
      queryResult.receivedRelationships.push({
        senderId: myUser.id,
        recipientId: user.id,
        type: RelationshipType.FRIENDSHIP,
        updatedAt: new Date(),
        cratedAt: new Date(),
      });
    }

    const queryMock = prismaMock.user.findUnique.calledWith(
      objectMatcher({
        where: { id: user.id },
        include: {
          games: {
            include: {
              game: true,
            },
          },
          receivedRelationships: true,
          sentRelationships: true,
        },
      })
    );
    queryMock.mockResolvedValue(queryResult);

    const result = await GET(requestMock, { params: { userId: user.id } });
    const actualResult = (await result.json()) as GameCollectionResult;

    const expectedResult = {
      userId: user.id,
      collection: userCollection.map((c) => ({
        game: c.game,
        own: c.own,
        wantToPlay: c.wantToPlay,
        wishlist: c.wishlist,
      })),
    };

    expect(result.status).toBe(200);
    expect(queryMock).toHaveBeenCalledTimes(1);
    expect(actualResult).toEqual(JSON.parse(JSON.stringify(expectedResult)));
  });
});
