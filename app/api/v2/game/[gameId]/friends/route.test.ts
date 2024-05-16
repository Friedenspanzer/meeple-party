/**
 * @jest-environment node
 */

import { myFriends } from "@/lib/queries/relationships";
import { prismaMock } from "@/utility/prismaMock";
import {
  generateArray,
  generateBoolean,
  generateDate,
  generateFullPrismaRelationship,
  generateNumber,
  generatePrismaUser,
  generateString,
  objectMatcher,
} from "@/utility/test";
import { RelationshipType } from "@prisma/client";
import { mock, mockReset } from "jest-mock-extended";
import "whatwg-fetch";
import { getUser } from "../../../authentication";
import { normalizeRelationship } from "../../../utility";
import { FriendCollectionGetResult, GET } from "./route";

jest.mock("../../../authentication");

const requestMock = mock<Request>();
const myUser = generatePrismaUser();
const getUserMock = jest.mocked(getUser);

const relationshipMock = prismaMock.relationship.findMany;
const collectionMock = prismaMock.gameCollection.findMany;

describe("GET game/[gameId]/friends", () => {
  beforeEach(() => {
    mockReset(requestMock);
    mockReset(getUserMock);

    getUserMock.mockResolvedValue(myUser);
  });
  it("rejects non-numeric game id", async () => {
    relationshipMock.mockResolvedValue([]);
    collectionMock.mockResolvedValue([]);
    const { response } = await get(requestMock, generateString());
    expect(response.status).toBe(400);
  });
  it("rejects negative game id", async () => {
    relationshipMock.mockResolvedValue([]);
    collectionMock.mockResolvedValue([]);
    const { response } = await get(requestMock, generateNumber(-9999999, -1));
    expect(response.status).toBe(400);
  });
  it("rejects big game id", async () => {
    relationshipMock.mockResolvedValue([]);
    collectionMock.mockResolvedValue([]);
    const { response } = await get(requestMock, 1000000000);
    expect(response.status).toBe(400);
  });
  it("returns empty lists when I have no friends", async () => {
    relationshipMock.mockResolvedValue([]);
    collectionMock.mockResolvedValue([]);

    const { response, data } = await get(requestMock, 1);

    expect(response.status).toBe(200);
    expect(data.own.length).toBe(0);
    expect(data.wantToPlay.length).toBe(0);
    expect(data.wishlist.length).toBe(0);
    expect(relationshipMock).toHaveBeenCalledTimes(1);
    expect(collectionMock).toHaveBeenCalledTimes(0);
  });
  it("transforms results to expected output", async () => {
    const gameId = generateNumber();
    const relationships = generateArray(() => {
      const a = generateBoolean() ? myUser : undefined;
      const b = a ? undefined : myUser;
      return generateFullPrismaRelationship(RelationshipType.FRIENDSHIP, a, b);
    });
    const normalizedRelationships = relationships.map((r) =>
      normalizeRelationship(r, myUser.id)
    );
    const friendCollections = normalizedRelationships.map((r) => ({
      userId: r.profile.id,
      gameId,
      own: generateBoolean(),
      wantToPlay: generateBoolean(),
      wishlist: generateBoolean(),
      updatedAt: generateDate(),
    }));

    relationshipMock
      .calledWith(
        objectMatcher({
          where: myFriends(myUser.id),
          include: { sender: true, recipient: true },
        })
      )
      .mockResolvedValue(relationships);
    collectionMock
      .calledWith(
        objectMatcher({
          where: {
            userId: { in: normalizedRelationships.map((f) => f.profile.id) },
            gameId,
          },
        })
      )
      .mockResolvedValue(friendCollections);

    const expectedOwn = friendCollections
      .filter((c) => c.own)
      .map((c) => c.userId);
    const expectedWantToPlay = friendCollections
      .filter((c) => c.wantToPlay)
      .map((c) => c.userId);
    const expectedWishlist = friendCollections
      .filter((c) => c.wishlist)
      .map((c) => c.userId);

    const { response, data } = await get(requestMock, gameId);

    expect(response.status).toBe(200);
    expect(data.own.map((p) => p.id)).toEqual(expectedOwn);
    expect(data.wantToPlay.map((p) => p.id)).toEqual(expectedWantToPlay);
    expect(data.wishlist.map((p) => p.id)).toEqual(expectedWishlist);

    expect(relationshipMock).toHaveBeenCalledTimes(1);
    expect(collectionMock).toHaveBeenCalledTimes(1);
  });
});

async function get(
  request: Request,
  gameId: number | string
): Promise<{ response: Response; data: FriendCollectionGetResult }> {
  const response = await GET(request, { params: { gameId: `${gameId}` } });
  const data = await response.json();
  return { response, data };
}
