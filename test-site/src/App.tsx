import { ChatInput, ChatHeader } from "@yext/chat-ui-react";
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

//TODO: replace this with MessageBubble component
function Messages() {
  const messages = useChatState((s) => s.conversation.messages);
  const isLoading = useChatState((s) => s.conversation.isLoading);
  return (
    <div>
      {messages.map((m, i) => (
        <p key={i}>{`${m.source}: ${m.text}`}</p>
      ))}
      {isLoading && <p>loading...</p>}
    </div>
  );
}

function App() {
  return (
    <div className="App">
      <ChatHeadlessProvider config={config}>
        <ChatHeader
<<<<<<< HEAD
            title="Clippy's Chatbot" 
            showRefreshButton={true}
=======
          title="Clippy's Chatbot" 
          showRefreshButton={true}
>>>>>>> c9c1689 (Add Header component)
        />
        <Messages />
        <ChatInput />
      </ChatHeadlessProvider>
    </div>
  );
}

export default App;