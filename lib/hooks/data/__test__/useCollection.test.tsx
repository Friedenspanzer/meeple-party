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
