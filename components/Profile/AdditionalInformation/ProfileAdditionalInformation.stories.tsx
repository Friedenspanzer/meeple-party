import type { Meta, StoryObj } from "@storybook/react";
import { ProfileAdditionalInformation } from "./ProfileAdditionalInformation";

const meta = {
  title: "Parts/Profile/Additional information",
  component: ProfileAdditionalInformation,
  tags: ["autodocs"],
} satisfies Meta<typeof ProfileAdditionalInformation>;

export default meta;
type Story = StoryObj<typeof meta>;

export const AllData: Story = {
  args: {
    bggName: "BGGUser",
    place: "Place",
  },
};

export const BggOnly: Story = {
  args: {
    bggName: "BGGUser",
  },
};

export const PlaceOnly: Story = {
  args: {
    place: "Place",
  },
};
