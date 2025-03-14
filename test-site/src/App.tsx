import { ChatHeader, ChatPanel, ChatPopUp, ChatPopUpProps } from "@yext/chat-ui-react";
import {
  ChatHeadlessProvider,
  HeadlessConfig,
} from "@yext/chat-headless-react";
import { useState } from "react";

/**
 * The analytics SDK only supports the SANDBOX and PRODUCTION environments. If you want to test
 * chat with analytics events, set testEnvironment to SANDBOX.
 * */
const testEnvironment = 'DEV';
// eslint-disable-next-line @typescript-eslint/ban-ts-comment
// @ts-ignore
const chatEndpoint = testEnvironment === 'SANDBOX'
    ?  `https://sbx-cdn.us.yextapis.com/v2/accounts/me/chat/${process.env.REACT_APP_TEST_BOT_ID}/message`
    : `https://liveapi-dev.yext.com/v2/accounts/me/chat/${process.env.REACT_APP_TEST_BOT_ID}/message`;
// eslint-disable-next-line @typescript-eslint/ban-ts-comment
// @ts-ignore
const chatStreamEndpoint = testEnvironment === 'SANDBOX'
    ? `https://sbx-cdn.us.yextapis.com/v2/accounts/me/chat/${process.env.REACT_APP_TEST_BOT_ID}/message/streaming`
    : `https://liveapi-dev.yext.com/v2/accounts/me/chat/${process.env.REACT_APP_TEST_BOT_ID}/message/streaming`;

const config: HeadlessConfig = {
  botId: process.env.REACT_APP_TEST_BOT_ID || "BOT_ID_HERE",
  apiKey: process.env.REACT_APP_BOT_API_KEY || "BOT_KEY_HERE",
  env: 'SANDBOX',
  region: 'US',
  endpoints: {
    chat: chatEndpoint,
    chatStream: chatStreamEndpoint,
  },
  saveToLocalStorage: true,
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
                "What locations are nearby?",
                "I'd like to learn more about a location in Arlington",
              ]}
              footer="This is a test footer with [link](https://yext.com) and [another link](https://yext.com)"
              linkTarget="_parent"
            />
          </div>
          <ControlledPopup
            title="Clippy"
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
      <ChatHeadlessProvider config={config}></ChatHeadlessProvider>
    </div>
  );
}

function ControlledPopup(props: ChatPopUpProps) {
  const [open, setOpen] = useState(false);

  return (
    <div>
      <button
        className="bg-emerald-300 rounded-sm p-2"
        onClick={() => setOpen(true)}
      >
        Open Chat
      </button>
      <ChatPopUp {...props} isOpen={open} onClose={() => setOpen(false)} />
    </div>
  );
}

export default App;
