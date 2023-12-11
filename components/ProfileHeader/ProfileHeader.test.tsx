import useLayout from "@/hooks/useLayout";
import { render } from "@/utility/test";
import { Role } from "@prisma/client";
import ProfileHeader from "./ProfileHeader";

jest.mock("@/i18n/client");
jest.mock("@/hooks/useLayout");

describe("Profile header", () => {
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
    jest
      .mocked(useLayout)
      .mockReturnValue({ isMobile: false, isDesktop: true });
  });
  it("matches snapshot for full user details", () => {
    const user = {
      name: "Frdnspnzr",
      realName: "Pascal Greilach",
      bggName: "Friedenspanzer",
      about: "Help, this thing is keeping me from playing games.",
      id: "abc123",
      place: "Kaiserslautern",
      role: Role.ADMIN,
      image: null,
    };
    const { container } = render(<ProfileHeader user={user} />);
    expect(container).toMatchSnapshot();
  });
  it("matches snapshot for minimal user details", () => {
    const user = {
      name: "Frdnspnzr",
      realName: null,
      bggName: null,
      about: null,
      id: "abc123",
      place: null,
      role: Role.USER,
      image: null,
    };
    const { container } = render(<ProfileHeader user={user} />);
    expect(container).toMatchSnapshot();
  });
  it("matches snapshot for friend profile", () => {
    const user = {
      name: "Frdnspnzr",
      realName: "Pascal Greilach",
      bggName: "Friedenspanzer",
      about: "Help, this thing is keeping me from playing games.",
      id: "abc123",
      place: "Kaiserslautern",
      role: Role.PREMIUM,
      image: null,
    };
    const { container } = render(<ProfileHeader user={user} friend />);
    expect(container).toMatchSnapshot();
  });
  it("matches snapshot for own profile", () => {
    const user = {
      name: "Frdnspnzr",
      realName: "Pascal Greilach",
      bggName: "Friedenspanzer",
      about: "Help, this thing is keeping me from playing games.",
      id: "abc123",
      place: "Kaiserslautern",
      role: Role.FRIENDS_FAMILY,
      image: null,
    };
    const { container } = render(<ProfileHeader user={user} myself />);
    expect(container).toMatchSnapshot();
  });
  it("matches snapshot for mobile layout", () => {
    jest
      .mocked(useLayout)
      .mockReturnValue({ isMobile: true, isDesktop: false });
    const user = {
      name: "Frdnspnzr",
      realName: "Pascal Greilach",
      bggName: "Friedenspanzer",
      about: "Help, this thing is keeping me from playing games.",
      id: "abc123",
      place: "Kaiserslautern",
      role: Role.ADMIN,
      image: null,
    };
    const { container } = render(<ProfileHeader user={user} />);
    expect(container).toMatchSnapshot();
  });
});
