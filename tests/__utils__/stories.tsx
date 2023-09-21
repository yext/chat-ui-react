import {
  ChatHeadlessProvider,
  HeadlessConfig,
} from "@yext/chat-headless-react";

const config: HeadlessConfig = {
  botId: "DUMMY_BOT_ID",
  apiKey: "DUMMY_API_KEY",
};

export function DummyChatHeadlessProvider({ children }) {
  return (
    <ChatHeadlessProvider config={config}>{children}</ChatHeadlessProvider>
  );
}
