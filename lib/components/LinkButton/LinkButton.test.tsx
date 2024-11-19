import { render } from "@/lib/utility/test";
import LinkButton from "./LinkButton";

jest.mock("@/i18n/client");

describe("Link button", () => {
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
  it("matches snapshot for simple links", () => {
    const { container } = render(
      <LinkButton href="Test Link">Text</LinkButton>
    );
    expect(container).toMatchSnapshot();
  });
  it("matches snapshot for complex links", () => {
    const { container } = render(
      <LinkButton href="Test Link" color="mink" leftSection="Left section">
        Text
      </LinkButton>
    );
    expect(container).toMatchSnapshot();
  });
});
