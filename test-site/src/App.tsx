import { ChatInput, ChatInputCssClasses, MessageBubble } from "@yext/chat-ui-react";
import {
  ChatHeadlessProvider,
  HeadlessConfig,
  useChatState,
} from "@yext/chat-headless-react";

const config: HeadlessConfig = {
  botId: "red-dog-bot",
  apiKey: process.env.REACT_APP_BOT_API_KEY || "BOT_KEY_HERE",
  apiDomain: "liveapi-dev.yext.com",
};

function Messages() {
  const messages = useChatState((s) => s.conversation.messages);
  const isLoading = useChatState((s) => s.conversation.isLoading);
  return (
    <div>
      {messages.map((m, i) => <MessageBubble message={m} key={i} />)}
      {isLoading && <p>loading...</p>}
    </div>
  );
}

const chatInputCssClasses: ChatInputCssClasses = { container: "mt-4" }

function App() {
  return (
    <div className="App">
      <ChatHeadlessProvider config={config}>
        <div className="m-4">
          <Messages />
          <ChatInput customCssClasses={chatInputCssClasses}/>
        </div>
      </ChatHeadlessProvider>
    </div>
  );
}

export default App;
