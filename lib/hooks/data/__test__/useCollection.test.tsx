import { GameCollectionResult } from "@/app/api/v2/user/[userId]/collection/route";
import getCollection from "@/lib/dataAccess/collection";
import { Collection } from "@/lib/datatypes/client/collection";
import { Game } from "@/lib/datatypes/client/game";
import { UserId } from "@/lib/datatypes/client/userProfile";
import {
  ObjectData,
  convertClientGame,
  generateCollection,
} from "@/lib/util/test";
import { generateUserProfile, render } from "@/utility/test";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import "@testing-library/jest-dom";
import { screen, waitFor } from "@testing-library/react";
import useCollection from "../useCollection";

jest.mock("@/lib/dataAccess/collection");

function TestComponent({ userId }: { userId: UserId }) {
  const collection = useCollection(userId);
  return <ObjectData object={collection} />;
}

describe("useCollection hook", () => {
  beforeAll(() => {
    Object.defineProperty(window, "matchMedia", {
      writable: true,
      value: jest.fn().mockImplementation((query) => ({
        matches: false,
        media: query,
        onchange: null,
        addListener: jest.fn(),
        removeListener: jest.fn(),
        addEventListener: jest.fn(),
        removeEventListener: jest.fn(),
        dispatchEvent: jest.fn(),
      })),
    });
  });
  beforeEach(() => {
    jest.resetAllMocks();
  });

  it("returns queried data", async () => {
    const queryClient = new QueryClient();

    const user = generateUserProfile();

    const { collection, games } = generateCollection(user.id);

    const getCollectionMock = jest.mocked(getCollection);
    getCollectionMock.mockResolvedValue(
      convertCollection(collection, games, user.id)
    );

    render(
      <QueryClientProvider client={queryClient}>
        <TestComponent userId={user.id} />
      </QueryClientProvider>
    );

    await waitFor(() =>
      expect(screen.getByTestId("isLoading").innerHTML).toBe("false")
    );
    const actualCollection = JSON.parse(screen.getByTestId("data").innerHTML);
    expect(actualCollection).toEqual(collection);
    expect(getCollectionMock.mock.calls[0][0]).toBe(user.id);
  });

  it("returns isLoading during load", async () => {
    const queryClient = new QueryClient();

    const user = generateUserProfile();

    const { collection, games } = generateCollection(user.id);

    const getCollectionMock = jest.mocked(getCollection);
    getCollectionMock.mockResolvedValue(
      convertCollection(collection, games, user.id)
    );

    render(
      <QueryClientProvider client={queryClient}>
        <TestComponent userId={user.id} />
      </QueryClientProvider>
    );

    expect(screen.getByTestId("isLoading").innerHTML).toBe("true");
    expect(screen.getByTestId("data")).toBeEmptyDOMElement();
  });

  it("returns queried data", async () => {
    const queryClient = new QueryClient();

    const user = generateUserProfile();

    const { collection: serverCollection, games: serverGames } =
      generateCollection(user.id);
    const { collection: cachedCollection, games: cachedGames } =
      generateCollection(user.id);

    queryClient.setQueryData(["collection", user.id], cachedCollection);

    const getCollectionMock = jest.mocked(getCollection);
    getCollectionMock.mockResolvedValue(
      convertCollection(serverCollection, serverGames, user.id)
    );

    render(
      <QueryClientProvider client={queryClient}>
        <TestComponent userId={user.id} />
      </QueryClientProvider>
    );

    await waitFor(() =>
      expect(screen.getByTestId("isLoading").innerHTML).toBe("false")
    );
    const actualCollection = JSON.parse(screen.getByTestId("data").innerHTML);
    expect(actualCollection).toEqual(cachedCollection);
    expect(getCollectionMock.mock.calls.length).toBe(0);
  });

  it("caches data", async () => {
    const queryClient = new QueryClient();

    const user = generateUserProfile();

    const { collection, games } = generateCollection(user.id);

    const getCollectionMock = jest.mocked(getCollection);
    getCollectionMock.mockResolvedValue(
      convertCollection(collection, games, user.id)
    );

    render(
      <QueryClientProvider client={queryClient}>
        <TestComponent userId={user.id} />
      </QueryClientProvider>
    );

    await waitFor(() =>
      expect(screen.getByTestId("isLoading").innerHTML).toBe("false")
    );

    const cachedCollection = queryClient.getQueryData(["collection", user.id]);
    expect(cachedCollection).toEqual(collection);
  });

  it("caches game data", async () => {
    const queryClient = new QueryClient();

    const user = generateUserProfile();

    const { collection, games } = generateCollection(user.id);

    const getCollectionMock = jest.mocked(getCollection);
    getCollectionMock.mockResolvedValue(
      convertCollection(collection, games, user.id)
    );

    render(
      <QueryClientProvider client={queryClient}>
        <TestComponent userId={user.id} />
      </QueryClientProvider>
    );

    await waitFor(() =>
      expect(screen.getByTestId("isLoading").innerHTML).toBe("false")
    );

    games.forEach((game) => {
      const cachedGame = queryClient.getQueryData(["game", game.id]);
      expect(cachedGame).toEqual(game);
    });
  });
});

function convertCollection(
  collection: Collection,
  games: Game[],
  userId: UserId
): GameCollectionResult {
  return {
    userId,
    collection: games.map((g) => ({
      game: convertClientGame(g),
      own: collection.own.includes(g.id),
      wantToPlay: collection.wantToPlay.includes(g.id),
      wishlist: collection.wishlist.includes(g.id),
    })),
  };
}
