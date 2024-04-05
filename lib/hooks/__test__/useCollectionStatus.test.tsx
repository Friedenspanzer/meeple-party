import {
  generateBoolean,
  generateNumber,
  generateString,
} from "@/utility/test";
import { GameCollection } from "@prisma/client";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { renderHook, waitFor } from "@testing-library/react";
import axios from "axios";
import nock from "nock";
import { PropsWithChildren } from "react";
import useCollectionStatus, {
  getCollectionStatusQueryKey,
} from "../useCollectionStatus";

const queryClient = new QueryClient({
  defaultOptions: { queries: { retry: false, gcTime: Infinity } },
});
const wrapper = ({ children }: PropsWithChildren) => (
  <QueryClientProvider client={queryClient}>{children}</QueryClientProvider>
);

const baseUrl = "http://localhost:4567";
const corsHeaders = {
  "access-control-allow-origin": "*",
};

describe("useCollectionStatus", () => {
  beforeAll(() => {
    axios.defaults.baseURL = baseUrl;
    nock.disableNetConnect();
  });
  afterAll(() => {
    axios.defaults.baseURL = undefined;
    nock.enableNetConnect();
  });
  afterEach(() => {
    nock.cleanAll();
  });
  it("fetches data from the server", async () => {
    const gameId = generateNumber();
    const userId = generateString();
    const expectedData: GameCollection = {
      gameId,
      userId,
      own: generateBoolean(),
      wishlist: generateBoolean(),
      wantToPlay: generateBoolean(),
      updatedAt: null,
    };
    const scope = nock(baseUrl)
      .get(`/api/v2/game/${gameId}/collection`)
      .reply(200, expectedData, corsHeaders);

    const { result } = renderHook(() => useCollectionStatus(gameId), {
      wrapper,
    });

    await waitFor(() => expect(scope.isDone()).toBeTruthy());
    await waitFor(() => expect(result.current.isLoading).toBeFalsy());
    await waitFor(() => expect(result.current.data).toEqual(expectedData));
  });
  it("is loading until fetch resolves", async () => {
    const gameId = generateNumber();
    const scope = nock(baseUrl)
      .get(`/api/v2/game/${gameId}/collection`)
      .reply(200, {}, corsHeaders);

    const { result } = renderHook(() => useCollectionStatus(gameId), {
      wrapper,
    });

    expect(result.current.isLoading).toBeTruthy();
    await waitFor(() => expect(scope.isDone()).toBeTruthy());
    expect(result.current.isLoading).toBeFalsy();
  });
  it("is error on unknown game", async () => {
    const gameId = generateNumber();
    nock(baseUrl)
      .get(`/api/v2/game/${gameId}/collection`)
      .reply(404, {}, corsHeaders);

    const { result } = renderHook(() => useCollectionStatus(gameId), {
      wrapper,
    });

    await waitFor(() => expect(result.current.isError).toBe(true));
    await waitFor(() => expect(result.current.data).toBeUndefined());
  });
  it("refetches stale data", async () => {
    const gameId = generateNumber();
    const userId = generateString();
    const oldData: GameCollection = {
      gameId,
      userId,
      own: generateBoolean(),
      wishlist: generateBoolean(),
      wantToPlay: generateBoolean(),
      updatedAt: null,
    };
    const expectedData: GameCollection = {
      gameId,
      userId,
      own: generateBoolean(),
      wishlist: generateBoolean(),
      wantToPlay: generateBoolean(),
      updatedAt: null,
    };
    let scope = nock(baseUrl)
      .get(`/api/v2/game/${gameId}/collection`)
      .reply(200, oldData, corsHeaders);

    const { result } = renderHook(() => useCollectionStatus(gameId), {
      wrapper,
    });

    await waitFor(() => expect(scope.isDone()).toBeTruthy());
    await waitFor(() => expect(result.current.isLoading).toBeFalsy());
    await waitFor(() => expect(result.current.data).toEqual(oldData));

    scope = nock(baseUrl)
      .get(`/api/v2/game/${gameId}/collection`)
      .reply(200, expectedData, corsHeaders);

    queryClient.invalidateQueries({
      queryKey: getCollectionStatusQueryKey(gameId),
    });

    await waitFor(() => expect(scope.isDone()).toBeTruthy());
    await waitFor(() => expect(result.current.isLoading).toBeFalsy());
    await waitFor(() => expect(result.current.data).toEqual(expectedData));
  });
});
