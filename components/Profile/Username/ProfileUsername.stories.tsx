import type { Meta, StoryObj } from "@storybook/react";
import ProfileUsername from "./ProfileUsername";

const meta = {
  title: "Parts/Profile/Username",
  component: ProfileUsername,
  tags: ["autodocs"],
} satisfies Meta<typeof ProfileUsername>;

export default meta;
type Story = StoryObj<typeof meta>;

export const SimpleName: Story = {
  args: {
    children: "Frdnspnzr",
  },
};

export const NameWithBlanks: Story = {
  args: {
    children: "This is a name with blanks",
  },
};

export const NameWithTwoByteCharacters: Story = {
  args: {
    children: "사회과학원 어학연구소",
  },
};
