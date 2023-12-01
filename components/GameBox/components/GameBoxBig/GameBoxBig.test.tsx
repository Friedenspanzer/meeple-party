import { Game } from "@/datatypes/game";
import { render } from "@testing-library/react";
import useCollectionStatus from "../../../../hooks/api/useCollectionStatus";
import GameBoxBig from "./GameBoxBig";

jest.mock("@/i18n/client");
jest.mock("@/hooks/api/useCollectionStatus");

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
    const { container: rendered } = render(
      <GameBoxBig game={game} showFriendCollection />
    );
    expect(rendered).toMatchSnapshot("");
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
    const { container: rendered } = render(
      <GameBoxBig game={game} showFriendCollection={false} />
    );
    expect(rendered).toMatchSnapshot("default game");
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
