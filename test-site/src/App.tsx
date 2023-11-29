import { ChatHeader, ChatPanel, ChatPopUp } from "@yext/chat-ui-react";
import {
  ChatHeadlessProvider,
  HeadlessConfig,
} from "@yext/chat-headless-react";

const config: HeadlessConfig = {
  botId: process.env.REACT_APP_TEST_BOT_ID || "BOT_ID_HERE",
  apiKey: process.env.REACT_APP_BOT_API_KEY || "BOT_KEY_HERE",
  endpoints: {
    chat: `https://liveapi-dev.yext.com/v2/accounts/me/chat/${process.env.REACT_APP_TEST_BOT_ID}/message`,
    chatStream: `https://liveapi-dev.yext.com/v2/accounts/me/chat/${process.env.REACT_APP_TEST_BOT_ID}/message/streaming`,
  },
  analyticsConfig: {
    endpoint: "https://www.dev.us.yextevents.com/accounts/me/events",
  },
};

function App() {
  return (
    <div>
      <div className="h-screen w-screen flex justify-center items-center bg-slate-700">
        {/* <h1 className="external-element">External Element!</h1> */}
        <ChatHeadlessProvider config={config}>
          <div className="h-5/6 w-1/2">
            <ChatPanel
              header={
                <ChatHeader title="Clippy's Chatbot" showRestartButton={true} />
              }
              messageSuggestions={[
                "Hello",
                "How are you?",
                "Goodbye",
                "What is your name?",
                "This is a longer message to test how it scales with more text",
              ]}
            />
          </div>
        </ChatHeadlessProvider>
      </div>
      <ChatHeadlessProvider config={config}>
        <ChatPopUp
          title="Clippy"
          messageSuggestions={[
            "hey how are you",
            "I'm looking to order a pair of all-mountain skis",
            "Who sells cheeseburgers?",
          ]}
        />
      </ChatHeadlessProvider>
    </div>
  );
}

export default App;
