import type { Meta, StoryObj } from "@storybook/react";
import { within, userEvent } from "@storybook/testing-library";
import { ChatInput } from "../../src";
import {
  ChatHeadlessProvider,
  HeadlessConfig,
} from "@yext/chat-headless-react";

const meta: Meta<typeof ChatInput> = {
  title: "ChatInput",
  component: ChatInput,
};
export default meta;

const config: HeadlessConfig = {
  botId: "DUMMY_BOT_ID",
  apiKey: "DUMMY_API_KEY",
};

export const Primary: StoryObj<typeof meta> = {
  render: () => (
    <ChatHeadlessProvider config={config}>
      <ChatInput />
    </ChatHeadlessProvider>
  ),
};

export const InputWithText: StoryObj<typeof meta> = {
  ...Primary,
  play: ({ canvasElement }) => {
    const canvas = within(canvasElement);
    userEvent.type(canvas.getByRole("textbox"), "my message");
  },
};
