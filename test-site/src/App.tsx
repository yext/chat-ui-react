import { ChatHeader } from "@yext/chat-ui-react";
import { ChatHeadlessProvider, ChatConfig } from "@yext/chat-headless-react";

const config: ChatConfig = {
  botId: "ski-warehouse-chat",
  apiKey: "ba41c60c65d874c5340985ad4fcda69a"
};

function App() {
  return (
    <ChatHeadlessProvider config={config}>
      <div className="App">
          <ChatHeader
            title="Clippy's Chatbot" 
            showRefreshButton={true}
          />
      </div>
    </ChatHeadlessProvider>
  );
}

export default App;
