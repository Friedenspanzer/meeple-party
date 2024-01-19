import { getMyUserProfile } from "@/lib/dataAccess/userProfile";
import { generateMyUserProfile, render } from "@/utility/test";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import "@testing-library/jest-dom";
import { screen, waitFor } from "@testing-library/react";
import useMyUserProfile, {
  MY_USER_PROFILE_QUERY_KEY,
} from "../useMyUserProfile";

function TestComponent() {
  const profile = useMyUserProfile();
  return (
    <>
      {Object.entries(profile).map(([key, value]) => (
        <div data-testid={key} key={key}>
          {JSON.stringify(value)}
        </div>
      ))}
    </>
  );
}

jest.mock("@/lib/dataAccess/userProfile");

describe("useMyUserProfile hook", () => {
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
    const profileFromServer = generateMyUserProfile();

    const getMyUserProfileMock = jest.mocked(getMyUserProfile);
    getMyUserProfileMock.mockResolvedValue(profileFromServer);

    render(
      <QueryClientProvider client={queryClient}>
        <TestComponent />
      </QueryClientProvider>
    );

    await waitFor(() =>
      expect(screen.getByTestId("isLoading").innerHTML).toBe("false")
    );
    const actualProfile = JSON.parse(
      screen.getByTestId("userProfile").innerHTML
    );
    expect(actualProfile).toEqual(profileFromServer);
  });
  it("returns isLoading during load", async () => {
    const queryClient = new QueryClient();
    const profileFromServer = generateMyUserProfile();

    const getMyUserProfileMock = jest.mocked(getMyUserProfile);
    getMyUserProfileMock.mockResolvedValue(profileFromServer);

    render(
      <QueryClientProvider client={queryClient}>
        <TestComponent />
      </QueryClientProvider>
    );

    expect(screen.getByTestId("isLoading").innerHTML).toBe("true");
    expect(screen.getByTestId("userProfile")).toBeEmptyDOMElement();
  });
  it("returns cached data", async () => {
    const queryClient = new QueryClient();

    const cachedProfile = generateMyUserProfile();
    const profileFromServer = generateMyUserProfile();

    const getMyUserProfileMock = jest.mocked(getMyUserProfile);
    getMyUserProfileMock.mockResolvedValue(profileFromServer);

    queryClient.setQueryData(MY_USER_PROFILE_QUERY_KEY, cachedProfile);

    render(
      <QueryClientProvider client={queryClient}>
        <TestComponent />
      </QueryClientProvider>
    );

    await waitFor(() =>
      expect(screen.getByTestId("isLoading").innerHTML).toBe("false")
    );
    const actualProfile = JSON.parse(
      screen.getByTestId("userProfile").innerHTML
    );
    expect(actualProfile).toEqual(cachedProfile);
    expect(getMyUserProfileMock).not.toHaveBeenCalled();
  });
  it("caches data", async () => {
    const queryClient = new QueryClient();

    const profileFromServer = generateMyUserProfile();

    const getMyUserProfileMock = jest.mocked(getMyUserProfile);
    getMyUserProfileMock.mockResolvedValue(profileFromServer);

    render(
      <QueryClientProvider client={queryClient}>
        <TestComponent />
      </QueryClientProvider>
    );

    await waitFor(() =>
      expect(screen.getByTestId("isLoading").innerHTML).toBe("false")
    );
    const cachedProfile = queryClient.getQueryData(["user"]);
    expect(cachedProfile).toEqual(profileFromServer);
  });
});
