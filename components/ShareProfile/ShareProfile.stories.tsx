import type { Meta, StoryObj } from "@storybook/react";

import ShareProfile from "./ShareProfile";

const meta = {
  title: "Share Profile",
  component: ShareProfile,
  parameters: {
    layout: "centered",
  },
  tags: ["autodocs"],
} satisfies Meta<typeof ShareProfile>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Simple: Story = {
  args: {
    profileId: "abc",
  },
};
