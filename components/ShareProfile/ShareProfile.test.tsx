import { render } from "@/utility/test";
import { screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import ShareProfile from "./ShareProfile";

jest.mock("@/i18n/client");

describe("Share Profile", () => {
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
    const user = userEvent.setup();
    const { container } = render(
      <ShareProfile profileId="abc" disableNative />
    );
    const button = screen.getByRole("button");
    await user.click(button);
    expect(container).toMatchSnapshot();
  });
});
