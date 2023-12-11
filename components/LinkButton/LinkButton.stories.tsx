import { Group, Text } from "@mantine/core";
import type { Meta, StoryObj } from "@storybook/react";
import { IconHanger } from "@tabler/icons-react";
import LinkButton from "./LinkButton";

const meta = {
  title: "Parts/Link button",
  component: LinkButton,
  tags: ["autodocs"],
} satisfies Meta<typeof LinkButton>;

export default meta;
type Story = StoryObj<typeof meta>;

export const SimpleTextLink: Story = {
  args: {
    href: "https://greilach.dev",
    children: "greilach.dev",
  },
};

export const AlternativeColor: Story = {
  args: {
    href: "https://greilach.dev",
    children: "greilach.dev",
    color: "mink",
  },
};

export const ComplexChildren: Story = {
  args: {
    href: "https://greilach.dev",
    children: (
      <Group>
        <IconHanger />
        <Text>greilach.dev</Text>
        <Text c="mink">Your source for absolutely nothing!</Text>
      </Group>
    ),
  },
};

export const WithIcon: Story = {
  args: {
    href: "https://greilach.dev",
    children: "greilach.dev",
    leftSection: <IconHanger />,
  },
};
