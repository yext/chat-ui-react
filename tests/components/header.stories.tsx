import type { Meta, StoryObj } from "@storybook/react";
import { ChatHeader } from "../../src";

const meta: Meta<typeof ChatHeader> = {
  title: "Header",
  component: ChatHeader,
};
export default meta;

export const Primary: StoryObj<typeof meta> = {
  render: () => <ChatHeader title={"Header Title"} />,
};
