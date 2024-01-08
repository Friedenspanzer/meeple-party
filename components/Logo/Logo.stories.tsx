import type { Meta, StoryObj } from "@storybook/react";
import Logo from "./Logo";

const meta = {
  title: "Parts/Logo",
  component: Logo,
  tags: ["autodocs"],
} satisfies Meta<typeof Logo>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Large: Story = {
  args: {
    size: "lg",
  },
};

export const Medium: Story = {
  args: {
    size: "md",
  },
};

export const Small: Story = {
  args: {
    size: "sm",
  },
};

export const ExtraSmall: Story = {
  args: {
    size: "xs",
  },
};
