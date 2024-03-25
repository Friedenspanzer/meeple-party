import Avatar from "@/components/Avatar/Avatar";
import { useModal } from "@/context/modalContext";
import { GameCollectionStatus, StatusByUser } from "@/datatypes/collection";
import { Game } from "@/datatypes/game";
import useCollectionStatus from "@/hooks/api/useCollectionStatus";
import { generateArray, generateUserProfile, render } from "@/utility/test";
import GameboxBig from "./GameboxBig";

jest.mock("@/i18n/client");
jest.mock("@/hooks/api/useCollectionStatus");
jest.mock("@/components/Avatar/Avatar", () => ({
  __esModule: true,
  namedExport: jest.fn(),
  default: jest.fn(),
}));
jest.mock("@/context/modalContext");

const game: Game = {
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
    const friendCollections: StatusByUser = {
      own: generateArray(generateUserProfile),
      wantToPlay: generateArray(generateUserProfile),
      wishlist: generateArray(generateUserProfile),
    };
    const myCollection: GameCollectionStatus = {
      own: true,
      wantToPlay: false,
      wishlist: true,
    };
    const { container: rendered } = render(
      <GameboxBig
        game={game}
        friendCollections={friendCollections}
        myCollection={myCollection}
      />
    );
    expect(rendered).toMatchSnapshot();
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
    const friendCollections: StatusByUser = {
      own: generateArray(generateUserProfile),
      wantToPlay: generateArray(generateUserProfile),
      wishlist: generateArray(generateUserProfile),
    };
    const myCollection: GameCollectionStatus = {
      own: true,
      wantToPlay: false,
      wishlist: true,
    };
    const { container: rendered } = render(
      <GameboxBig
        game={{ ...game, weight: Math.PI }}
        friendCollections={friendCollections}
        myCollection={myCollection}
      />
    );
    expect(rendered).toMatchSnapshot("default game");
  });
});
