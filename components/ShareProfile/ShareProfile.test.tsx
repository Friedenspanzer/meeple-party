import { generateString, render } from "@/utility/test";
import { screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import ShareProfile from "./ShareProfile";

jest.mock("@/i18n/client");

describe("Share Profile", () => {
  const env = process.env;
  afterAll(() => {
    jest.restoreAllMocks();
    process.env = env;
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
  it("matches snapshot", () => {
    const { container } = render(<ShareProfile profileId="abc" />);
    expect(container).toMatchSnapshot();
  });
  it("matches snapshot without native sharing", () => {
    const { container } = render(
      <ShareProfile profileId="abc" disableNative />
    );
    expect(container).toMatchSnapshot();
  });
  it("matches snapshot without native sharing after clicking share button", async () => {
    jest.spyOn(Math, "random").mockImplementation(() => 0.5);
    const user = userEvent.setup();
    const { container } = render(
      <ShareProfile profileId="abc" disableNative />
    );
    const button = screen.getByRole("button");
    await user.click(button);
    expect(container).toMatchSnapshot();
  });
  it("shares using native sharing", async () => {
    const user = userEvent.setup();

    const baseUrl = generateString();
    const profileId = generateString();

    process.env.BASE_URL = baseUrl;

    const expectedShareData: ShareData = {
      url: `${baseUrl}/app/profile/${profileId}`,
    };

    const canShareMock = jest.fn();
    canShareMock.mockReturnValue(true);

    const shareMock = jest.fn();

    jest
      .spyOn(global, "navigator", "get")
      .mockImplementation(
        () => ({ canShare: canShareMock, share: shareMock } as any)
      );

    render(<ShareProfile profileId={profileId} />);

    const button = screen.getByRole("button");
    await user.click(button);

    expect(canShareMock).toHaveBeenCalledTimes(1);
    expect(canShareMock.mock.calls[0][0]).toEqual(expectedShareData);
    expect(shareMock).toHaveBeenCalledTimes(1);
    expect(shareMock.mock.calls[0][0]).toEqual(expectedShareData);
  });
});
