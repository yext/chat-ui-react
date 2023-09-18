import type { Meta, StoryObj } from "@storybook/react";
import { ChatHeader } from "../../src";
import { DummyChatHeadlessProvider } from "../__utils__/stories";

const meta: Meta<typeof ChatHeader> = {
  title: "Header",
  component: ChatHeader,
};
export default meta;

export const Primary: StoryObj<typeof meta> = {
  render: (args) => (
    <DummyChatHeadlessProvider>
      <ChatHeader {...args} />
    </DummyChatHeadlessProvider>
  ),
  args: {
    title: "Chat Header",
    showRestartButton: false,
    showCloseButton: false,
    customCssClasses: {},
  },
};

export const HeaderWithButtons: StoryObj<typeof meta> = {
  ...Primary,
  args: {
    title: "Chat Header",
    showRestartButton: true,
    showCloseButton: true,
    customCssClasses: {},
  },
};
