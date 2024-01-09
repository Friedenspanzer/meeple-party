import { render } from "@/utility/test";
import Logo from "./Logo";

describe("Profile badge", () => {
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
  test.each(["xs", "sm", "md", "lg"])("size %s matches snapshot", (size) => {
    const { container } = render(<Logo size={size as any} />);
    expect(container).toMatchSnapshot();
  });
  test.each(["xs", "sm", "md", "lg"])(
    "size %s matches unstyled snapshot",
    (size) => {
      const { container } = render(<Logo size={size as any} unstyled />);
      expect(container).toMatchSnapshot();
    }
  );
  test.each(["xs", "sm", "md", "lg"])(
    "size %s matches snapshot with additional class names",
    (size) => {
      const className = "test class name";
      const { container } = render(
        <Logo size={size as any} className={className} />
      );
      expect(container).toMatchSnapshot();
    }
  );
});
