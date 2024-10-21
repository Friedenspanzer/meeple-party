import Image from "next/image";
import svg from "./logo.svg";

type Size = "xs" | "sm" | "md" | "lg";

export interface LogoProps {
  size: Size;
  className?: string;
  unstyled?: boolean;
}

export default function Logo({
  size,
  className = "",
  unstyled = false,
}: Readonly<LogoProps>) {
  const widthToLoad = getWidthToLoad(size);
  const heightToLoad = getHeightToLoad(widthToLoad);
  const height = getHeight(size);
  return (
    <Image
      src={svg}
      width={widthToLoad}
      height={heightToLoad}
      alt="Meeple Party"
      style={unstyled ? {} : { height, width: "100%" }}
      className={className}
    />
  );
}

function getWidthToLoad(size: Size): number {
  switch (size) {
    case "xs":
      return 16;
    case "sm":
      return 24;
    case "md":
      return 96;
    case "lg":
      return 400;
  }
}

function getHeightToLoad(width: number): number {
  return (width * 3) / 4;
}

function getHeight(size: Size): string {
  switch (size) {
    case "xs":
      return "2ex";
    case "sm":
      return "3rem";
    case "md":
      return "6rem";
    case "lg":
      return "18rem";
  }
}
