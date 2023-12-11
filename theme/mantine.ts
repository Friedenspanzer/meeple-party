"use client";

import { generateColors } from "@mantine/colors-generator";
import { createTheme } from "@mantine/core";

export const theme = createTheme({
  colors: {
    murple: generateColors("hsl(269, 80%, 56%)"),
    mink: generateColors("rgb(238, 102, 217)"),
    gold: generateColors("rgb(255,215,0)"),
    darkgray: generateColors("rgba(99, 99, 99, 1)")
  },
  primaryColor: "murple",
  primaryShade: 5
});
