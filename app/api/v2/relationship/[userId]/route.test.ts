/**
 * @jest-environment node
 */

import { prismaMock } from "@/utility/prismaMock";
import { mock, mockReset } from "jest-mock-extended";
import { GET } from "./route";
import { getUser } from "../../utility";
import "whatwg-fetch";
import { User } from "@prisma/client";
import { generateString } from "@/utility/test";

jest.mock("../../utility");

const requestMock = mock<Request>();
const userMock = mock<User>();
const getUserMock = jest.mocked(getUser);

describe("GET relationship/[userId]", () => {
  beforeEach(() => {
    mockReset(requestMock);
    mockReset(userMock);
    mockReset(getUserMock);

    getUserMock.mockResolvedValue(userMock);
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
  it("returns 404 when no relationship was found", async () => {
    prismaMock.relationship.findMany.mockResolvedValue([]);

    const result = await GET(requestMock, {
      params: { userId: generateString(25) },
    });

    expect(result.status).toBe(404);
  });
});
