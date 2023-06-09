# chat-ui-react

A library of React Components for powering Yext Chat integrations.

See the [full documentation](./docs/chat-ui-react.md) here.

## Getting Started

Install the library through NPM:

```bash
npm install @yext/chat-ui-react
```

Once the library and its peer dependencies are installed, our React Components should be nested inside the `ChatHeadlessProvider`. `ChatHeadlessProvider` requires a `HeadlessConfig` object with the appropriate credentials and configurations:

```tsx
import {
  ChatHeadlessProvider,
  HeadlessConfig,
} from "@yext/chat-headless-react";
import { ChatPanel } from "@yext/chat-ui-react";

const config: HeadlessConfig = {
  apiKey: "<apiKey>",
  botId: "<botId>",
};

function App() {
  return (
    <ChatHeadlessProvider config={config}>
      <ChatPanel />
    </ChatHeadlessProvider>
  );
}

export default App;
```

To use the Component Library's Styling without adding Tailwind to your project, add the following import:

```tsx
import "@yext/chat-ui-react/bundle.css";
```

To have tailwind preflight disabled, import the following css bundle instead:
```tsx
import "@yext/chat-ui-react/bundle-no-resets.css";
```