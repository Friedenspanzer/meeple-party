import Avatar from "@/feature/profiles/components/Avatar/Avatar";
import {
    generateArray,
    generateCssProperties,
    generateRgbColor,
    generateString,
} from "@/lib/utility/test";
import "@testing-library/jest-dom";
import { render, screen } from "@testing-library/react";
import Image, { ImageProps } from "next/image";

jest.mock("next/image", () => ({
  __esModule: true,
  namedExport: jest.fn(),
  default: jest.fn(),
}));

jest.mock("@/i18n/client");

const ImageMock = ({ ...props }: ImageProps) => {
  return (
    <span
      data-testid="imagemock"
      data-optimized={props.unoptimized ? "no" : "yes"}
      data-styleString={JSON.stringify(props.style)}
      {...props}
    />
  );
};

describe("Component: Avatar", () => {
  beforeAll(() => {
    jest.mocked(Image).mockImplementation(ImageMock);
  });
  it("matches the snapshot for avatar with image", async () => {
    const image = "testimage";
    const name = "testname";
    const { container } = render(<Avatar name={name} image={image} />);

    expect(container).toMatchSnapshot("");
  });
  it("renders the image when available", async () => {
    const image = generateString();
    const name = generateString();
    render(<Avatar name={name} image={image} />);

    const nextImage = await screen.findByTestId("imagemock");

    expect(nextImage).toHaveAttribute("src", image);
    expect(nextImage).toHaveAttribute("alt", name);
    expect(nextImage).toHaveAttribute("referrerPolicy", "no-referrer");
    expect(nextImage).toHaveAttribute("data-optimized", "no");
  });
  it("passes styles to the image", async () => {
    const image = generateString();
    const name = generateString();
    const style = generateCssProperties();
    render(<Avatar name={name} image={image} style={style} />);

    const nextImage = await screen.findByTestId("imagemock");

    expect(nextImage).toHaveAttribute(
      "data-styleString",
      JSON.stringify(style)
    );
  });
  it("passes classes to the image", async () => {
    const image = generateString();
    const name = generateString();
    const classes = generateArray(generateString);
    render(<Avatar name={name} image={image} className={classes.join(" ")} />);

    const nextImage = await screen.findByTestId("imagemock");

    classes.forEach((c) => expect(nextImage).toHaveClass(c));
  });
  it("renders a placeholder when no image is provided", async () => {
    const name = generateString();
    render(<Avatar name={name} />);

    const placeholder = await screen.findAllByText(
      name.charAt(0).toUpperCase()
    );

    expect(placeholder).toBeDefined();
    expect(placeholder.length).toBe(1);
  });
  it("matches the snapshot for avatar without image", async () => {
    const name = "testname";
    const { container } = render(<Avatar name={name} />);

    expect(container).toMatchSnapshot("");
  });
  it("works with an empty name", async () => {
    render(<Avatar name={""} />);

    const placeholder = await screen.findAllByText("?");

    expect(placeholder).toBeDefined();
  });
  it("passes classes to the placeholder", async () => {
    const name = generateString();
    const classes = generateArray(generateString);
    render(<Avatar name={name} className={classes.join(" ")} />);

    const placeholder = (
      await screen.findAllByText(name.charAt(0).toUpperCase())
    )[0];

    classes.forEach((c) => expect(placeholder).toHaveClass(c));
  });
  it("assigns different colors to placeholders", async () => {
    const names = generateArray(generateString, 5);
    const { container } = render(
      <>
        {names.map((name) => (
          <Avatar name={name} key={name} />
        ))}
      </>
    );
    const colors = getColorsFromDivs(container);

    expect(colors.length).toBe(names.length);
    colors.forEach((t) =>
      expect(colors.filter((t2) => colorEquals(t, t2)).length).toBe(1)
    );
  });
  it("assigns same colors to placeholders for same names", async () => {
    const name = generateString();
    const names = generateArray(() => name);
    const { container } = render(
      <>
        {names.map((name) => (
          <Avatar name={name} key={name} />
        ))}
      </>
    );

    const colors = getColorsFromDivs(container);

    expect(colors.length).toBe(names.length);
    colors.forEach((t) =>
      expect(colors.filter((t2) => colorEquals(t, t2)).length).toBe(
        names.length
      )
    );
  });
  it("passes styles to the placeholder", async () => {
    const style = generateCssProperties();
    if (style.backgroundColor) {
      style.color = style.backgroundColor;
      delete style.backgroundColor;
    }
    const name = generateString();

    render(<Avatar name={name} style={style} />);

    const placeholder = await screen.findByText(name.charAt(0).toUpperCase());

    expect(placeholder.style).toMatchObject(style);
  });
  it("overwrites a passed background color", async () => {
    const passedColor = generateRgbColor();
    const style = generateCssProperties();
    style.backgroundColor = passedColor;
    const name = generateString();

    render(<Avatar name={name} style={style} />);

    const placeholder = await screen.findByText(name.charAt(0).toUpperCase());

    expect(placeholder.style.backgroundColor).not.toBe(passedColor);
  });
});

type Color = {
  r: number;
  g: number;
  b: number;
};
function colorEquals(a: Color, b: Color): boolean {
  return a.r === b.r && a.g === b.g && a.b === b.b;
}

function getColorsFromDivs(container: HTMLElement): Color[] {
  const placeholders = container.querySelectorAll("div");
  const colors: string[] = [];
  placeholders.forEach((p) => colors.push(p.style.backgroundColor));
  return colors.map((c) => {
    const match = /rgb\((\d{1,3}), (\d{1,3}), (\d{1,3})\)/.exec(c);
    if (!match || match.length < 4) {
      throw new Error("Wrong color format");
    }
    return {
      r: Number.parseInt(match[1]),
      g: Number.parseInt(match[2]),
      b: Number.parseInt(match[3]),
    } as Color;
  });
}
