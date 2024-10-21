import { render } from "@/lib/utility/test";
import ProfileUsername from "./ProfileUsername";
jest.mock("@/i18n/client");

describe("Profile username", () => {
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
    const { container } = render(
      <ProfileUsername>Test username</ProfileUsername>
    );
    expect(container).toMatchSnapshot();
  });
});
