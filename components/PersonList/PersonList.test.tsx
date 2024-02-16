import { UserProfile } from "@/datatypes/userProfile";
import {
  generateArray,
  generateArrayWithIndex,
  generateNumber,
  generateUserProfile,
  getUserProfile,
  render,
} from "@/utility/test";
import { screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import PersonList from "./PersonList";

jest.mock("@/i18n/client");

describe("Person list", () => {
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
  it("Matches snapshot", () => {
    const persons: UserProfile[] = generateArrayWithIndex((i) =>
      getUserProfile(i)
    );
    const { container } = render(<PersonList persons={persons} />);
    expect(container).toMatchSnapshot();
  });
  it("Calls callback", async () => {
    const user = userEvent.setup();

    const persons: UserProfile[] = generateArray(generateUserProfile);
    let called = false;
    const callback = () => {
      called = true;
    };
    render(<PersonList persons={persons} onClick={callback} />);
    const buttons = screen.getAllByRole("button");
    await user.click(buttons[generateNumber(0, buttons.length - 1)]);
    expect(called).toBeTruthy();
  });
});
