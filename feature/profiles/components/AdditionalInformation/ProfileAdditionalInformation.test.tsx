import { render } from "@/lib/utility/test";
import { ProfileAdditionalInformation } from "./ProfileAdditionalInformation";

describe("Profile additional information", () => {
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
      <ProfileAdditionalInformation bggName="bgg name" place="place" />
    );
    expect(container).toMatchSnapshot();
  });
  it("matches snapshot with only bgg name", () => {
    const { container } = render(
      <ProfileAdditionalInformation bggName="bgg name" />
    );
    expect(container).toMatchSnapshot();
  });
  it("matches snapshot with only place", () => {
    const { container } = render(
      <ProfileAdditionalInformation place="place" />
    );
    expect(container).toMatchSnapshot();
  });
  it("matches snapshot with no parameters", () => {
    const { container } = render(<ProfileAdditionalInformation />);
    expect(container).toMatchSnapshot();
  });
});
