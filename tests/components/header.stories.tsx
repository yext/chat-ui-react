import type { Meta, StoryObj } from "@storybook/react";
import { ChatHeader } from "../../src";
<<<<<<< HEAD
import { ChatHeadlessProvider, ChatConfig } from "@yext/chat-headless-react";
=======
>>>>>>> c9c1689 (Add Header component)

const meta: Meta<typeof ChatHeader> = {
  title: "Header",
  component: ChatHeader,
};
export default meta;

<<<<<<< HEAD
const config: ChatConfig = {
  botId: "",
  apiKey: ""
};

export const Primary: StoryObj<typeof meta> = {
  render: (args) => (
    <ChatHeadlessProvider config={config}>
      <ChatHeader {...args} />,
    </ChatHeadlessProvider>
  )
};
Primary.args = {
  title: 'Chat Header',
  showRefreshButton: false,
  customCssClasses: {}
};  
=======
export const Primary: StoryObj<typeof meta> = {
  render: () => <ChatHeader title={"Header Title"} />,
};
>>>>>>> c9c1689 (Add Header component)
