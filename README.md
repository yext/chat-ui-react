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

## Styling

### default styling

By default, the component library uses Tailwind styling.

To use the Component library's styling without adding Tailwind to your project, add
`ChatStyleProvider` as a wrapper for all Chat related components:

```tsx
<ChatStyleProvider>
  <ChatHeadlessProvider config={config}>
    <ChatPanel />
  </ChatHeadlessProvider>
</ChatStyleProvider>
```

`ChatStyleProvider` imports "@yext/chat-ui-react/bundle.css" and provides
a parent div with classname `yext-chat`. The styling in the bundle is scoped to elements with classname `yext-chat` and its children. This is to prevent Chat component library's styling, which includes tailwind preflight, from affecting user's existing styling outside of Chat components.

### custom styling

Projects that use Tailwind may pass Tailwind classnames into the Chat components using the `customCssClasses` prop:

```tsx
const customCssClasses: ChatPanelCssClasses = {
  container: "bg-blue-300"
}
<ChatPanel customCssClasses={customCssClasses}>
```

Projects that don't use Tailwind may target the default styleless classnames added into the html elements within the Chat components and add their own css styling:

```css
.yext-chat-panel__container {
  background-color: blue;
}
```

Alternatively, user may provide their own classnames using the `customCssClasses` prop and target that instead
