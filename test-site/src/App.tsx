import { ChatPopUp } from "@yext/chat-ui-react";
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
      <ChatHeadlessProvider config={config}>
        <ChatPopUp
          title="Clippy"
          openOnLoad={true}
          showInitialMessagePopUp={true}
          showHeartBeatAnimation={true}
          showUnreadNotification={true}
          messageSuggestions={[
            "hey how are you",
            "I'm looking to order a pair of all-mountain skis",
            "Who sells cheeseburgers?",
            "I want to go home",
            "This sucks I want a refund and also I am suing you for negligence",
          ]}
        />
      </ChatHeadlessProvider>
    </div>
  );
}

export default App;
