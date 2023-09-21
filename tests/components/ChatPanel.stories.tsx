import type { Meta, StoryObj } from "@storybook/react";
import { ChatHeader, ChatPanel } from "../../src";
import { DummyChatHeadlessProvider } from "../__utils__/stories";

const meta: Meta<typeof ChatPanel> = {
  title: "ChatPanel",
  component: ChatPanel,
};
export default meta;

export const Footer = () => {
  return (
    <div className="yext-chat__footer text-center text-slate-400 rounded-b-3xl px-4 pb-4 text-[12px]">
      This is a footer example
    </div>
  );
};

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

export const PanelWithFooter: StoryObj<typeof meta> = {
  ...Primary,
  args: {
    header: <ChatHeader title="My Chatbot" showRestartButton={true} />,
    footer: <Footer />,
    stream: false,
  },
};
