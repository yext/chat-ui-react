import type { Meta, StoryObj } from "@storybook/react";
import { ChatHeader, ChatPanel } from "../../src";
import { DummyChatHeadlessProvider } from "../__utils__/stories";

const meta: Meta<typeof ChatPanel> = {
  title: "ChatPanel",
  component: ChatPanel,
};
export default meta;

export const Primary: StoryObj<typeof meta> = {
  render: (args) => (
    <DummyChatHeadlessProvider>
      <div className="h-[600px] w-96">
        <ChatPanel {...args} />
      </div>
    </DummyChatHeadlessProvider>
  ),
  args: {
    stream: false,
  },
};

export const PanelWithHeader: StoryObj<typeof meta> = {
  ...Primary,
  args: {
    header: <ChatHeader title="My Chatbot" showRestartButton={true} />,
    stream: false,
  },
};
