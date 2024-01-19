import { getGame } from "@/lib/dataAccess/game";
import { generateGame, render } from "@/utility/test";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import "@testing-library/jest-dom";
import { screen, waitFor } from "@testing-library/react";
import useGame, { useGameQueryKey } from "../useGame";

function TestComponent({ gameId }: { gameId: number }) {
  const game = useGame(gameId);
  return (
    <>
      {Object.entries(game).map(([key, value]) => (
        <div data-testid={key} key={key}>
          {JSON.stringify(value)}
        </div>
      ))}
    </>
  );
}

jest.mock("@/lib/dataAccess/game");

describe("useGame hook", () => {
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

    const game = generateGame();

    const getGameMock = jest.mocked(getGame);
    getGameMock.mockResolvedValue(game);

    render(
      <QueryClientProvider client={queryClient}>
        <TestComponent gameId={game.id} />
      </QueryClientProvider>
    );

    await waitFor(() =>
      expect(screen.getByTestId("isLoading").innerHTML).toBe("false")
    );
    const actualGame = JSON.parse(screen.getByTestId("data").innerHTML);
    expect(actualGame).toEqual(game);
  });
  it("returns isLoading during load", async () => {
    const queryClient = new QueryClient();

    const game = generateGame();

    const getGameMock = jest.mocked(getGame);
    getGameMock.mockResolvedValue(game);

    render(
      <QueryClientProvider client={queryClient}>
        <TestComponent gameId={game.id} />
      </QueryClientProvider>
    );

    expect(screen.getByTestId("isLoading").innerHTML).toBe("true");
    expect(screen.getByTestId("data")).toBeEmptyDOMElement();
  });
  it("returns cached data", async () => {
    const queryClient = new QueryClient();

    const serverGame = generateGame();
    const cachedGame = generateGame();
    cachedGame.id = serverGame.id;
    const getQueryKey = useGameQueryKey();

    const getGameMock = jest.mocked(getGame);
    getGameMock.mockResolvedValue(serverGame);

    queryClient.setQueryData(getQueryKey(cachedGame.id), cachedGame);

    render(
      <QueryClientProvider client={queryClient}>
        <TestComponent gameId={cachedGame.id} />
      </QueryClientProvider>
    );

    await waitFor(() =>
      expect(screen.getByTestId("isLoading").innerHTML).toBe("false")
    );
    const actualGame = JSON.parse(screen.getByTestId("data").innerHTML);
    expect(actualGame).toEqual(cachedGame);
    expect(getGameMock).not.toHaveBeenCalled();
  });
  it("caches data", async () => {
    const queryClient = new QueryClient();

    const serverGame = generateGame();
    const getQueryKey = useGameQueryKey();

    const getGameMock = jest.mocked(getGame);
    getGameMock.mockResolvedValue(serverGame);

    render(
      <QueryClientProvider client={queryClient}>
        <TestComponent gameId={serverGame.id} />
      </QueryClientProvider>
    );

    await waitFor(() =>
      expect(screen.getByTestId("isLoading").innerHTML).toBe("false")
    );
    const cachedGame = queryClient.getQueryData(getQueryKey(serverGame.id));
    expect(cachedGame).toEqual(serverGame);
  });
});
