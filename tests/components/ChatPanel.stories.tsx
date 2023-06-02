import type { Meta, StoryObj } from "@storybook/react";
import { ChatHeader, ChatPanel } from "../../src";
import {
  ChatHeadlessProvider,
  HeadlessConfig,
} from "@yext/chat-headless-react";

const meta: Meta<typeof ChatPanel> = {
  title: "ChatPanel",
  component: ChatPanel,
};
export default meta;

const config: HeadlessConfig = {
  botId: "DUMMY_BOT_ID",
  apiKey: "DUMMY_API_KEY",
};

export const Primary: StoryObj<typeof meta> = {
  render: (args) => (
    <ChatHeadlessProvider config={config}>
      <div className="h-[600px] w-96">
        <ChatPanel {...args} />
      </div>
    </ChatHeadlessProvider>
  ),
  args: {
    stream: false
  }
};

export const PanelWithHeader: StoryObj<typeof meta> = {
  ...Primary,
  args: {
    Header: <ChatHeader
    title="My Chatbot"
    showRefreshButton={true}
    customCssClasses={{
      header: "rounded-t-3xl",
    }}
  />,
  stream: false
  }
};
