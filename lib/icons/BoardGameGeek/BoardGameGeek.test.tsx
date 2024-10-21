import { render } from "@/lib/utility/test";
import IconBoardGameGeek from "./BoardGameGeek";

describe("BoardGameGeek Icon", () => {
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
    const { container } = render(<IconBoardGameGeek />);
    expect(container).toMatchSnapshot();
  });
  it("matches snapshot with all parameters", () => {
    const { container } = render(
      <IconBoardGameGeek height={123} color="#c80815" paddingInline="2rem" />
    );
    expect(container).toMatchSnapshot();
  });
});
