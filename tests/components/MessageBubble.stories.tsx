import type { Meta, StoryObj } from "@storybook/react";
import { MessageBubble } from "../../src";
import { Message, MessageSource } from "@yext/chat-headless-react";

const meta: Meta<typeof MessageBubble> = {
  title: "MessageBubble",
  component: MessageBubble,
};
export default meta;

export const BotMessage: StoryObj<typeof meta> = {
  render: () => (
    <MessageBubble
      message={{
        text: "Hello! How can I help you?",
        timestamp: "2023-06-01T15:26:55.362Z",
        source: MessageSource.BOT,
      }}
    />
  ),
};

const userMessage: Message = {
  text: "What is Yext Chat?",
  timestamp: "2023-06-01T15:26:55.362Z",
  source: MessageSource.USER,
};

export const UserMessage: StoryObj<typeof meta> = {
  render: () => <MessageBubble message={userMessage} />,
};

export const MessageWithTimestamp: StoryObj<typeof meta> = {
  render: () => (
    <div className="border border-gray-300 p-4 rounded-md w-96">
      <MessageBubble
        message={userMessage}
        showTimestamp={true}
        customCssClasses={{
          //mock when timestamp appear on hover
          timestamp: "opacity-100",
        }}
      />
    </div>
  ),
};

export const MessageWithTimestampLargeScreen: StoryObj<typeof meta> = {
  render: () => (
    <div className="border border-gray-300 p-4 w-full">
      <MessageBubble
        message={userMessage}
        showTimestamp={true}
        customCssClasses={{
          //mock when timestamp appear on hover
          timestamp: "opacity-100",
        }}
      />
    </div>
  ),
};
