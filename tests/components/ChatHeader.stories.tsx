import type { Meta, StoryObj } from "@storybook/react";
import { ChatHeader } from "../../src";
import {
  ChatHeadlessProvider,
  HeadlessConfig,
} from "@yext/chat-headless-react";

const meta: Meta<typeof ChatHeader> = {
  title: "Header",
  component: ChatHeader,
};
export default meta;

const config: HeadlessConfig = {
  botId: "DUMMY_BOT_ID",
  apiKey: "DUMMY_API_KEY",
};

export const Primary: StoryObj<typeof meta> = {
  render: (args) => (
    <ChatHeadlessProvider config={config}>
      <ChatHeader {...args} />
    </ChatHeadlessProvider>
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
