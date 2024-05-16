import { StatusByUser } from "@/datatypes/collection";
import {
  generateArray,
  generateNumber,
  generateUserProfile,
} from "@/utility/test";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { renderHook, waitFor } from "@testing-library/react";
import axios from "axios";
import nock from "nock";
import { PropsWithChildren } from "react";
import useFriendCollectionStatus from "../useFriendCollectionStatus";

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

describe("useFriendCollectionStatus", () => {
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
    const expectedData: StatusByUser = {
      own: generateArray(generateUserProfile),
      wantToPlay: generateArray(generateUserProfile),
      wishlist: generateArray(generateUserProfile),
    };
    const scope = nock(baseUrl)
      .get(`/api/v2/game/${gameId}/friends`)
      .reply(200, expectedData, corsHeaders);

    const { result } = renderHook(() => useFriendCollectionStatus(gameId), {
      wrapper,
    });

    await waitFor(() => expect(scope.isDone()).toBeTruthy());
    await waitFor(() => expect(result.current.isLoading).toBeFalsy());
    await waitFor(() => expect(result.current.data).toEqual(expectedData));
  });
  it("is loading until fetch resolves", async () => {
    const gameId = generateNumber();
    const scope = nock(baseUrl)
      .get(`/api/v2/game/${gameId}/friends`)
      .reply(200, { own: [], wantToPlay: [], wishlist: [] }, corsHeaders);

    const { result } = renderHook(() => useFriendCollectionStatus(gameId), {
      wrapper,
    });

    expect(result.current.isLoading).toBeTruthy();
    await waitFor(() => expect(scope.isDone()).toBeTruthy());
    expect(result.current.isLoading).toBeFalsy();
  });
  it("is error on unknown game", async () => {
    const gameId = generateNumber();
    nock(baseUrl)
      .get(`/api/v2/game/${gameId}/friends`)
      .reply(404, {}, corsHeaders);

    const { result } = renderHook(() => useFriendCollectionStatus(gameId), {
      wrapper,
    });

    await waitFor(() => expect(result.current.isError).toBe(true));
    await waitFor(() => expect(result.current.data).toBeUndefined());
  });
  it("refetches stale data", async () => {
    const gameId = generateNumber();
    const oldData: StatusByUser = {
      own: generateArray(generateUserProfile),
      wantToPlay: generateArray(generateUserProfile),
      wishlist: generateArray(generateUserProfile),
    };
    const expectedData: StatusByUser = {
      own: generateArray(generateUserProfile),
      wantToPlay: generateArray(generateUserProfile),
      wishlist: generateArray(generateUserProfile),
    };
    let scope = nock(baseUrl)
      .get(`/api/v2/game/${gameId}/friends`)
      .reply(200, oldData, corsHeaders);

    const { result } = renderHook(() => useFriendCollectionStatus(gameId), {
      wrapper,
    });

    await waitFor(() => expect(scope.isDone()).toBeTruthy());
    await waitFor(() => expect(result.current.isLoading).toBeFalsy());
    await waitFor(() => expect(result.current.data).toEqual(oldData));

    scope = nock(baseUrl)
      .get(`/api/v2/game/${gameId}/friends`)
      .reply(200, expectedData, corsHeaders);

    queryClient.invalidateQueries({
      queryKey: ["friendcollectionstatus", gameId],
    });

    await waitFor(() => expect(scope.isDone()).toBeTruthy());
    await waitFor(() => expect(result.current.isLoading).toBeFalsy());
    await waitFor(() => expect(result.current.data).toEqual(expectedData));
  });
});
