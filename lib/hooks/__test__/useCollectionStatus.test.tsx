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
  CollectionStatus,
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
    queryClient.cancelQueries();
    queryClient.clear();
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
  it("updates optimistically", async () => {
    const gameId = generateNumber();
    const userId = generateString();
    const mutatedDataOnServer: GameCollection = {
      gameId,
      userId,
      own: generateBoolean(),
      wantToPlay: generateBoolean(),
      wishlist: generateBoolean(),
      updatedAt: null,
    };
    const mutationData: CollectionStatus = {
      own: generateBoolean(),
      wantToPlay: generateBoolean(),
      wishlist: generateBoolean(),
    };
    nock(baseUrl)
      .options(`/api/v2/game/${gameId}/collection`)
      .reply(200, {}, corsHeaders);
    const scope = nock(baseUrl)
      .patch(`/api/v2/game/${gameId}/collection`, (body) => true)
      .delay(500)
      .reply(200, mutatedDataOnServer, corsHeaders);

    const { result } = renderHook(() => useCollectionStatus(gameId), {
      wrapper,
    });

    result.current.mutate(mutationData);

    await waitFor(() => expect(result.current.data).toEqual(mutationData));

    await waitFor(() => expect(scope.isDone()).toBeTruthy());
    await waitFor(() =>
      expect(result.current.data).toEqual(mutatedDataOnServer)
    );
  });
  test.each(["own", "wantToPlay", "wishlist"])(
    "does partial optimistic updates for attribute %s",
    async (attribute) => {
      const gameId = generateNumber();
      const userId = generateString();
      const mutatedDataOnServer: GameCollection = {
        gameId,
        userId,
        own: generateBoolean(),
        wantToPlay: generateBoolean(),
        wishlist: generateBoolean(),
        updatedAt: null,
      };
      const mutationData: Partial<CollectionStatus> = {};
      if (attribute === "own") {
        mutationData.own = generateBoolean();
      } else if (attribute === "wantToPlay") {
        mutationData.wantToPlay = generateBoolean();
      } else if (attribute === "wishlist") {
        mutationData.wishlist = generateBoolean();
      }
      const dataBeforeMutation: CollectionStatus = {
        own: generateBoolean(),
        wantToPlay: generateBoolean(),
        wishlist: generateBoolean(),
      };

      const expectedOptimisticData = {
        own: mutationData.own || dataBeforeMutation.own,
        wantToPlay: mutationData.wantToPlay || dataBeforeMutation.wantToPlay,
        wishlist: mutationData.wishlist || dataBeforeMutation.wishlist,
      };

      nock(baseUrl)
        .options(`/api/v2/game/${gameId}/collection`)
        .reply(200, {}, corsHeaders);
      const scope = nock(baseUrl)
        .patch(`/api/v2/game/${gameId}/collection`, (body) => true)
        .delay(500)
        .reply(200, mutatedDataOnServer, corsHeaders);

      queryClient.setQueryData<CollectionStatus>(
        getCollectionStatusQueryKey(gameId),
        dataBeforeMutation
      );

      const { result } = renderHook(() => useCollectionStatus(gameId), {
        wrapper,
      });

      result.current.mutate(mutationData);

      await waitFor(() =>
        expect(result.current.data).toEqual(expectedOptimisticData)
      );

      await waitFor(() => expect(scope.isDone()).toBeTruthy());
      await waitFor(() =>
        expect(result.current.data).toEqual(mutatedDataOnServer)
      );
    }
  );
});
