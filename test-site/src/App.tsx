import {
  ChatHeader,
  ChatHeaderCssClasses,
  ChatPanel,
} from "@yext/chat-ui-react";
import {
  ChatHeadlessProvider,
  HeadlessConfig,
} from "@yext/chat-headless-react";

const config: HeadlessConfig = {
  botId: "red-dog-bot",
  apiKey: process.env.REACT_APP_BOT_API_KEY || "",
  apiDomain: "liveapi-dev.yext.com",
};

const chatHeaderCssClasses: ChatHeaderCssClasses = {
  header: "rounded-t-3xl",
};

function App() {
  return (
    <div className="h-screen w-screen flex justify-center items-center">
      <ChatHeadlessProvider config={config}>
        <div className="h-5/6 w-5/6">
          <ChatPanel
            header={
              <ChatHeader
                title="Clippy's Chatbot"
                showRefreshButton={true}
                customCssClasses={chatHeaderCssClasses}
              />
            }
          />
        </div>
      </ChatHeadlessProvider>
    </div>
  );
}

export default App;
