/**
 * @jest-environment node
 */

import { prismaMock } from "@/utility/prismaMock";
import { mock, mockReset } from "jest-mock-extended";
import { DELETE, GET, RelationshipGetResult } from "./route";
import { convertToUserProfile } from "../../utility";
import "whatwg-fetch";
import { RelationshipType as PrismaRelationshipType } from "@prisma/client";
import {
  generateFullPrismaRelationship,
  generatePrismaUser,
  generateString,
} from "@/utility/test";
import { getUser } from "../../authentication";
import { RelationshipType } from "@/datatypes/relationship";
import { UserProfile } from "@/datatypes/userProfile";

jest.mock("../../authentication");

const requestMock = mock<Request>();
const myUser = generatePrismaUser();
const getUserMock = jest.mocked(getUser);

describe("GET relationship/[userId]", () => {
  beforeEach(() => {
    mockReset(requestMock);
    mockReset(getUserMock);

    getUserMock.mockResolvedValue(myUser);
  });
  it("fails for short user ids", async () => {
    await expect(
      GET(requestMock, {
        params: { userId: generateString(19) },
      })
    ).rejects.toEqual(new Error("User Profile ID format error"));
  });
  it("fails for long user ids", async () => {
    await expect(
      GET(requestMock, {
        params: { userId: generateString(41) },
      })
    ).rejects.toEqual(new Error("User Profile ID format error"));
  });
  it("returns 404 when no relationship is found", async () => {
    prismaMock.relationship.findMany.mockResolvedValue([]);

    const result = await GET(requestMock, {
      params: { userId: generateString(25) },
    });

    expect(result.status).toBe(404);
  });
  it("returns 500 when multiple relationships are found", async () => {
    prismaMock.relationship.findMany.mockResolvedValue([
      generateFullPrismaRelationship(),
      generateFullPrismaRelationship(),
    ]);

    const result = await GET(requestMock, {
      params: { userId: generateString(25) },
    });

    expect(result.status).toBe(500);
  });
  it("returns an existing friendship", async () => {
    const otherUser = generatePrismaUser();
    const expectedUser: UserProfile = convertToUserProfile(otherUser, true);

    const relationship = generateFullPrismaRelationship(
      PrismaRelationshipType.FRIENDSHIP,
      myUser,
      otherUser
    );

    prismaMock.relationship.findMany.mockResolvedValue([relationship]);

    const result = await GET(requestMock, {
      params: { userId: otherUser.id },
    });

    expect(result.status).toBe(200);

    const data = (await result.json()) as RelationshipGetResult;

    expect(data.normalizedRelationship.profile).toEqual(expectedUser);
    expect(data.normalizedRelationship.type).toEqual(
      RelationshipType.FRIENDSHIP
    );
    expect(new Date(data.normalizedRelationship.lastUpdate)).toEqual(
      relationship.updatedAt
    );

    expect(prismaMock.relationship.findMany).toHaveBeenCalledWith({
      where: {
        OR: [
          { recipientId: myUser.id, senderId: otherUser.id },
          { recipientId: otherUser.id, senderId: myUser.id },
        ],
      },
      include: {
        recipient: true,
        sender: true,
      },
    });
  });
  it("returns an existing reverse friendship", async () => {
    const otherUser = generatePrismaUser();
    const expectedUser: UserProfile = convertToUserProfile(otherUser, true);

    const relationship = generateFullPrismaRelationship(
      PrismaRelationshipType.FRIENDSHIP,
      otherUser,
      myUser
    );

    prismaMock.relationship.findMany.mockResolvedValue([relationship]);

    const result = await GET(requestMock, {
      params: { userId: otherUser.id },
    });

    expect(result.status).toBe(200);

    const data = (await result.json()) as RelationshipGetResult;

    expect(data.normalizedRelationship.profile).toEqual(expectedUser);
    expect(data.normalizedRelationship.type).toEqual(
      RelationshipType.FRIENDSHIP
    );
    expect(new Date(data.normalizedRelationship.lastUpdate)).toEqual(
      relationship.updatedAt
    );

    expect(prismaMock.relationship.findMany).toHaveBeenCalledWith({
      where: {
        OR: [
          { recipientId: myUser.id, senderId: otherUser.id },
          { recipientId: otherUser.id, senderId: myUser.id },
        ],
      },
      include: {
        recipient: true,
        sender: true,
      },
    });
  });
  it("returns an existing sent friend request", async () => {
    const otherUser = generatePrismaUser();
    const expectedUser: UserProfile = convertToUserProfile(otherUser, false);

    const relationship = generateFullPrismaRelationship(
      PrismaRelationshipType.FRIEND_REQUEST,
      myUser,
      otherUser
    );

    prismaMock.relationship.findMany.mockResolvedValue([relationship]);

    const result = await GET(requestMock, {
      params: { userId: otherUser.id },
    });

    expect(result.status).toBe(200);

    const data = (await result.json()) as RelationshipGetResult;

    expect(data.normalizedRelationship.profile).toEqual(expectedUser);
    expect(data.normalizedRelationship.type).toEqual(
      RelationshipType.FRIEND_REQUEST_SENT
    );
    expect(new Date(data.normalizedRelationship.lastUpdate)).toEqual(
      relationship.updatedAt
    );
  });
  it("returns an existing received friend request", async () => {
    const otherUser = generatePrismaUser();
    const expectedUser: UserProfile = convertToUserProfile(otherUser, false);

    const relationship = generateFullPrismaRelationship(
      PrismaRelationshipType.FRIEND_REQUEST,
      otherUser,
      myUser
    );

    prismaMock.relationship.findMany.mockResolvedValue([relationship]);

    const result = await GET(requestMock, {
      params: { userId: otherUser.id },
    });

    expect(result.status).toBe(200);

    const data = (await result.json()) as RelationshipGetResult;

    expect(data.normalizedRelationship.profile).toEqual(expectedUser);
    expect(data.normalizedRelationship.type).toEqual(
      RelationshipType.FRIEND_REQUEST_RECEIVED
    );
    expect(new Date(data.normalizedRelationship.lastUpdate)).toEqual(
      relationship.updatedAt
    );
  });
});

describe("DELETE relationship/[userId]", () => {
  beforeEach(() => {
    mockReset(requestMock);
    mockReset(getUserMock);

    getUserMock.mockResolvedValue(myUser);
  });
  it("fails for short user ids", async () => {
    await expect(
      DELETE(requestMock, {
        params: { userId: generateString(19) },
      })
    ).rejects.toEqual(new Error("User Profile ID format error"));
  });
  it("fails for long user ids", async () => {
    await expect(
      DELETE(requestMock, {
        params: { userId: generateString(41) },
      })
    ).rejects.toEqual(new Error("User Profile ID format error"));
  });
  it("returns 404 when no relationship is found", async () => {
    prismaMock.relationship.findMany.mockResolvedValue([]);

    const result = await DELETE(requestMock, {
      params: { userId: generateString(25) },
    });

    expect(result.status).toBe(404);
  });
  it("returns 500 when multiple relationships are found", async () => {
    prismaMock.relationship.findMany.mockResolvedValue([
      generateFullPrismaRelationship(),
      generateFullPrismaRelationship(),
    ]);

    const result = await DELETE(requestMock, {
      params: { userId: generateString(25) },
    });

    expect(result.status).toBe(500);
  });
  it("deletes the relationship", async () => {
    const otherUser = generatePrismaUser();

    const relationship = generateFullPrismaRelationship(
      PrismaRelationshipType.FRIENDSHIP,
      myUser,
      otherUser
    );

    prismaMock.relationship.findMany.mockResolvedValue([relationship]);

    const result = await DELETE(requestMock, {
      params: { userId: otherUser.id },
    });

    expect(result.status).toBe(200);

    expect(prismaMock.relationship.findMany).toHaveBeenCalledWith({
      where: {
        OR: [
          { recipientId: myUser.id, senderId: otherUser.id },
          { recipientId: otherUser.id, senderId: myUser.id },
        ],
      },
      include: {
        recipient: true,
        sender: true,
      },
    });
    expect(prismaMock.relationship.delete).toHaveBeenCalledWith({
      where: {
        senderId_recipientId: {
          recipientId: relationship.recipientId,
          senderId: relationship.senderId,
        },
      },
    });
  });
  it("returns an existing friendship", async () => {
    const otherUser = generatePrismaUser();
    const expectedUser: UserProfile = convertToUserProfile(otherUser, true);

    const relationship = generateFullPrismaRelationship(
      PrismaRelationshipType.FRIENDSHIP,
      myUser,
      otherUser
    );

    prismaMock.relationship.findMany.mockResolvedValue([relationship]);

    const result = await DELETE(requestMock, {
      params: { userId: otherUser.id },
    });

    expect(result.status).toBe(200);

    const data = (await result.json()) as RelationshipGetResult;

    expect(data.normalizedRelationship.profile).toEqual(expectedUser);
    expect(data.normalizedRelationship.type).toEqual(
      RelationshipType.FRIENDSHIP
    );
    expect(new Date(data.normalizedRelationship.lastUpdate)).toEqual(
      relationship.updatedAt
    );

    expect(prismaMock.relationship.findMany).toHaveBeenCalledWith({
      where: {
        OR: [
          { recipientId: myUser.id, senderId: otherUser.id },
          { recipientId: otherUser.id, senderId: myUser.id },
        ],
      },
      include: {
        recipient: true,
        sender: true,
      },
    });
  });
  it("returns an existing reverse friendship", async () => {
    const otherUser = generatePrismaUser();
    const expectedUser: UserProfile = convertToUserProfile(otherUser, true);

    const relationship = generateFullPrismaRelationship(
      PrismaRelationshipType.FRIENDSHIP,
      otherUser,
      myUser
    );

    prismaMock.relationship.findMany.mockResolvedValue([relationship]);

    const result = await DELETE(requestMock, {
      params: { userId: otherUser.id },
    });

    expect(result.status).toBe(200);

    const data = (await result.json()) as RelationshipGetResult;

    expect(data.normalizedRelationship.profile).toEqual(expectedUser);
    expect(data.normalizedRelationship.type).toEqual(
      RelationshipType.FRIENDSHIP
    );
    expect(new Date(data.normalizedRelationship.lastUpdate)).toEqual(
      relationship.updatedAt
    );

    expect(prismaMock.relationship.findMany).toHaveBeenCalledWith({
      where: {
        OR: [
          { recipientId: myUser.id, senderId: otherUser.id },
          { recipientId: otherUser.id, senderId: myUser.id },
        ],
      },
      include: {
        recipient: true,
        sender: true,
      },
    });
  });
  it("returns an existing sent friend request", async () => {
    const otherUser = generatePrismaUser();
    const expectedUser: UserProfile = convertToUserProfile(otherUser, false);

    const relationship = generateFullPrismaRelationship(
      PrismaRelationshipType.FRIEND_REQUEST,
      myUser,
      otherUser
    );

    prismaMock.relationship.findMany.mockResolvedValue([relationship]);

    const result = await DELETE(requestMock, {
      params: { userId: otherUser.id },
    });

    expect(result.status).toBe(200);

    const data = (await result.json()) as RelationshipGetResult;

    expect(data.normalizedRelationship.profile).toEqual(expectedUser);
    expect(data.normalizedRelationship.type).toEqual(
      RelationshipType.FRIEND_REQUEST_SENT
    );
    expect(new Date(data.normalizedRelationship.lastUpdate)).toEqual(
      relationship.updatedAt
    );
  });
  it("returns an existing received friend request", async () => {
    const otherUser = generatePrismaUser();
    const expectedUser: UserProfile = convertToUserProfile(otherUser, false);

    const relationship = generateFullPrismaRelationship(
      PrismaRelationshipType.FRIEND_REQUEST,
      otherUser,
      myUser
    );

    prismaMock.relationship.findMany.mockResolvedValue([relationship]);

    const result = await DELETE(requestMock, {
      params: { userId: otherUser.id },
    });

    expect(result.status).toBe(200);

    const data = (await result.json()) as RelationshipGetResult;

    expect(data.normalizedRelationship.profile).toEqual(expectedUser);
    expect(data.normalizedRelationship.type).toEqual(
      RelationshipType.FRIEND_REQUEST_RECEIVED
    );
    expect(new Date(data.normalizedRelationship.lastUpdate)).toEqual(
      relationship.updatedAt
    );
  });
});
