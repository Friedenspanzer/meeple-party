import type { Meta, StoryObj } from "@storybook/react";
import ProfileRealName from "./ProfileRealName";

const meta = {
  title: "Parts/Profile/Real name",
  component: ProfileRealName,
  tags: ["autodocs"],
} satisfies Meta<typeof ProfileRealName>;

export default meta;
type Story = StoryObj<typeof meta>;

export const SimpleName: Story = {
  args: {
    children: "Pascal Greilach",
  },
};

export const NameWithTwoByteCharacters: Story = {
  args: {
    children: "사회과학원 어학연구소",
  },
};

