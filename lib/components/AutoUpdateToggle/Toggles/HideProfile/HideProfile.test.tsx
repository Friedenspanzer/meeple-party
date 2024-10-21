import { defaultUserPreferences } from "@/datatypes/userProfile";
import { useUserPreferences } from "@/lib/hooks/useUserPreferences";
import { generateBoolean, render } from "@/utility/test";
import { screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import HideProfile from "./HideProfile";

jest.mock("@/i18n/client");
jest.mock("@/lib/hooks/useUserPreferences");

describe("Hide profile settings toggle", () => {
  afterEach(() => {
    jest.restoreAllMocks();
  });
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
  it("matches snapshot when loading", () => {
    jest.mocked(useUserPreferences).mockReturnValue({
      loading: true,
      preferences: undefined,
      update: () => {
        return Promise.resolve();
      },
    });
    const { container } = render(<HideProfile />);
    expect(container).toMatchSnapshot();
  });
  it("matches snapshot when true", () => {
    jest.mocked(useUserPreferences).mockReturnValue({
      loading: false,
      preferences: { ...defaultUserPreferences, hideProfile: true },
      update: () => {
        return Promise.resolve();
      },
    });
    const { container } = render(<HideProfile />);
    expect(container).toMatchSnapshot();
  });
  it("matches snapshot when false", () => {
    jest.mocked(useUserPreferences).mockReturnValue({
      loading: false,
      preferences: { ...defaultUserPreferences, hideProfile: false },
      update: () => {
        return Promise.resolve();
      },
    });
    const { container } = render(<HideProfile />);
    expect(container).toMatchSnapshot();
  });
  it("changes setting when button is clicked", async () => {
    const expectedSetting = generateBoolean();
    let actualSetting: boolean | undefined = undefined;
    jest.mocked(useUserPreferences).mockReturnValue({
      loading: false,
      preferences: { ...defaultUserPreferences, hideProfile: !expectedSetting },
      update: (preferences) => {
        actualSetting = preferences.hideProfile;
        return Promise.resolve();
      },
    });

    const user = userEvent.setup();
    render(<HideProfile />);
    const toggle = screen.getByRole("switch");
    await user.click(toggle);

    expect(actualSetting).toBe(expectedSetting);
  });
});
