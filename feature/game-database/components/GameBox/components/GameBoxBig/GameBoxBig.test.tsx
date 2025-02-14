import useCollectionStatus from "@/feature/game-collection/hooks/useCollectionStatus";
import Avatar from "@/feature/profiles/components/Avatar/Avatar";
import { useModal } from "@/lib/contexts/modalContext";
import { ExpandedGame } from "@/lib/types/game";
import { generateArray, generateUserProfile, render } from "@/lib/utility/test";
import { StatusByUser } from "../../../../../../lib/types/collection";
import GameBoxBig from "./GameBoxBig";

jest.mock("@/i18n/client");
jest.mock("@/feature/game-collection/hooks/useCollectionStatus");
jest.mock("@/feature/profiles/components/Avatar/Avatar", () => ({
  __esModule: true,
  namedExport: jest.fn(),
  default: jest.fn(),
}));
jest.mock("@/lib/contexts/modalContext");

const game: ExpandedGame = {
  id: 123,
  name: "Test game",
  BGGRank: 23,
  BGGRating: 8.4,
  minPlayers: 1,
  maxPlayers: 5,
  playingTime: 120,
  weight: 3.8,
  year: 2018,
  image: "testimage",
  thumbnail: "testthumbnail",
  wikidataId: "testwikidata",
  names: [
    { language: "en", name: "nameen" },
    { language: "de", name: "namede" },
    { language: "fr", name: "namefr" },
  ],
};

describe("GameBoxBig", () => {
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
    jest.mocked(Avatar).mockImplementation(() => <>Avatar</>);
  });
  beforeEach(() => {
    jest.mocked(useModal).mockImplementation(() => ({
      open: () => {},
      close: () => {},
    }));
  });
  it("Matches snapshot", async () => {
    jest.mocked(useCollectionStatus).mockReturnValue({
      invalidate: () => {},
      isError: false,
      isLoading: false,
      mutate: () => {},
      data: {
        gameId: 123,
        own: true,
        userId: "abc123",
        wantToPlay: true,
        wishlist: true,
        updatedAt: null,
      },
    });
    const friendCollection: StatusByUser = {
      own: generateArray(generateUserProfile),
      wantToPlay: generateArray(generateUserProfile),
      wishlist: generateArray(generateUserProfile),
    };
    const { container: rendered } = render(
      <GameBoxBig
        game={game}
        friendCollection={friendCollection}
        showFriendCollection
      />
    );
    expect(rendered).toMatchSnapshot();
  });
  it("Matches snapshot without friend collection", async () => {
    jest.mocked(useCollectionStatus).mockReturnValue({
      invalidate: () => {},
      isError: false,
      isLoading: false,
      mutate: () => {},
      data: {
        gameId: 123,
        userId: "abc123",
        own: true,
        wantToPlay: true,
        wishlist: true,
        updatedAt: null,
      },
    });
    const friendCollection: StatusByUser = {
      own: generateArray(generateUserProfile),
      wantToPlay: generateArray(generateUserProfile),
      wishlist: generateArray(generateUserProfile),
    };
    const { container: rendered } = render(
      <GameBoxBig
        game={game}
        friendCollection={friendCollection}
        showFriendCollection={false}
      />
    );
    expect(rendered).toMatchSnapshot();
  });
  it("Matches snapshot when not in collection", async () => {
    jest.mocked(useCollectionStatus).mockReturnValue({
      invalidate: () => {},
      isError: false,
      isLoading: false,
      mutate: () => {},
      data: {
        gameId: 123,
        userId: "abc123",
        own: false,
        wantToPlay: false,
        wishlist: false,
        updatedAt: null,
      },
    });
    const { container: rendered } = render(
      <GameBoxBig game={game} showFriendCollection />
    );
    expect(rendered).toMatchSnapshot("default game");
  });
  it("Matches snapshot for precise weight", async () => {
    jest.mocked(useCollectionStatus).mockReturnValue({
      invalidate: () => {},
      isError: false,
      isLoading: false,
      mutate: () => {},
      data: {
        gameId: 123,
        userId: "abc123",
        own: false,
        wantToPlay: false,
        wishlist: false,
        updatedAt: null,
      },
    });
    const { container: rendered } = render(
      <GameBoxBig game={{ ...game, weight: Math.PI }} showFriendCollection />
    );
    expect(rendered).toMatchSnapshot("default game");
  });
});
