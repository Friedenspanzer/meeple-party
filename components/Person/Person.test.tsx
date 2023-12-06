import Avatar, { AvatarProps } from "@/components/Avatar/Avatar";
import { generateString } from "@/utility/test";
import "@testing-library/jest-dom";
import { render, screen } from "@testing-library/react";
import Person from "./Person";

const AvatarMock = ({ name, image }: AvatarProps) => (
  <span data-testid="avatarmock" data-name={name} data-image={image} />
);

jest.mock("@/components/Avatar/Avatar", () => ({
  __esModule: true,
  namedExport: jest.fn(),
  default: jest.fn(),
}));

describe("Component: Person", () => {
  beforeAll(() => {
    jest.mocked(Avatar).mockImplementation(AvatarMock);
  });
  it("matches the snapshot for full data", async () => {
    const {container} = render(<Person name="Display Name" realName="Real name" image="image" />);

    expect(container).toMatchSnapshot()
  })
  it("matches the snapshot for minimal data", async () => {
    const {container} = render(<Person name="Display Name" />);

    expect(container).toMatchSnapshot()
  })
  it("renders with minimal data", async () => {
    const name = generateString();
    render(<Person name={name} />);

    const avatarMock = await screen.findByTestId("avatarmock");

    expect(await screen.findByText(name));
    expect(avatarMock).toHaveAttribute("data-name", name);
    expect(avatarMock).not.toHaveAttribute("data-image");
  });
  it("passes image to avatar", async () => {
    const name = generateString();
    const image = generateString();
    render(<Person name={name} image={image} />);

    expect(await screen.findByTestId("avatarmock")).toHaveAttribute(
      "data-image",
      image
    );
  });
  it("includes both name and real name", async () => {
    const name = generateString();
    const realName = generateString();
    render(<Person name={name} realName={realName} />);

    expect(await screen.findByText(name));
    expect(await screen.findByText(realName));
  });
});
