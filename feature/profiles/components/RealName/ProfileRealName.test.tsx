import { render } from "@/utility/test";
import ProfileRealName from "./ProfileRealName";
jest.mock("@/i18n/client");

describe("Profile real name", () => {
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
      <ProfileRealName>Test username</ProfileRealName>
    );
    expect(container).toMatchSnapshot();
  });
});
