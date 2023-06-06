import { ChatHeader, ChatPanel, ChatPopUp } from "@yext/chat-ui-react";
import {
  ChatHeadlessProvider,
  HeadlessConfig,
} from "@yext/chat-headless-react";

const config: HeadlessConfig = {
  botId: "red-dog-bot",
  apiKey: process.env.REACT_APP_BOT_API_KEY || "",
  apiDomain: "liveapi-dev.yext.com",
};

function App() {
  return (
    <div className="h-screen w-screen flex justify-center items-center">
      <ChatHeadlessProvider config={config}>
        <div className="h-5/6 w-1/2">
          <ChatPanel
            header={
              <ChatHeader title="Clippy's Chatbot" showRestartButton={true} />
            }
          />
          <ChatPopUp />
        </div>
      </ChatHeadlessProvider>
    </div>
  );
}

export default App;
