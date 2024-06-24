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
  saveToLocalStorage: true,
};

function App() {
  const botIdKey = `${config.botId}.openOnLoad`
  if (config.saveToLocalStorage && window.localStorage.getItem(botIdKey) === null) {
    window.localStorage.setItem(botIdKey, "false");
  }
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
                "What locations are nearby?",
                "I'd like to learn more about a location in Arlington",
              ]}
              footer="This is a test footer with [link](https://yext.com) and [another link](https://yext.com)"
              linkTarget="_parent"
            />
          </div>
        </ChatHeadlessProvider>
      </div>
      <ChatHeadlessProvider config={config}>
        <ChatPopUp
          title="Clippy"
          botId={config.botId}
          openOnLoad={false}
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
