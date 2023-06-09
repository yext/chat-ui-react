import type { Meta, StoryObj } from "@storybook/react";
import { within, userEvent } from "@storybook/testing-library";
import { ChatPopUp } from "../../src";
import {
  ChatHeadlessProvider,
  HeadlessConfig,
} from "@yext/chat-headless-react";

const meta: Meta<typeof ChatPopUp> = {
  title: "ChatPopUp",
  component: ChatPopUp,
};
export default meta;

const config: HeadlessConfig = {
  botId: "DUMMY_BOT_ID",
  apiKey: "DUMMY_API_KEY",
};

export const PopupButton: StoryObj<typeof meta> = {
  render: (args) => (
    <ChatHeadlessProvider config={config}>
      <ChatPopUp {...args} />
    </ChatHeadlessProvider>
  ),
  args: {
    title: "My Chatbot",
  },
};

export const PopupPanel: StoryObj<typeof meta> = {
  ...PopupButton,
  play: ({ canvasElement }) => {
    const canvas = within(canvasElement);
    userEvent.click(canvas.getByLabelText("Chat Popup Button"));
  },
};
