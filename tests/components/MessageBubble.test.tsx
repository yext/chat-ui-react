import { render, screen } from "@testing-library/react";
import { MessageBubble } from "../../src";
import {
  ChatHeadlessProvider,
  HeadlessConfig,
  Message,
  MessageSource,
} from "@yext/chat-headless-react";

jest.mock("@yext/analytics");

const dummyConfig: HeadlessConfig = {
  apiKey: "",
  botId: "",
};

const dummyMessage: Message = {
  text: "What is Yext Chat?",
  timestamp: "2023-06-01T15:26:55.362Z",
  source: MessageSource.USER,
};

const timestampRegex = /\d{1,2}:\d\d (AM|PM)/;
it("displays message as expected", () => {
  render(
    <ChatHeadlessProvider config={dummyConfig}>
      <MessageBubble message={dummyMessage} />
    </ChatHeadlessProvider>
  );
  expect(screen.getByText(dummyMessage.text)).toBeInTheDocument();
});

it("displays converted timestamp when showTimestamp field is true", () => {
  render(
    <ChatHeadlessProvider config={dummyConfig}>
      <MessageBubble message={dummyMessage} showTimestamp={true} />
    </ChatHeadlessProvider>
  );
  expect(screen.getByText(timestampRegex)).toBeInTheDocument();
});

it("invokes custom formatTimestamp function when provided", () => {
  const customFormatTimestamp = jest.fn(() => "my special timestamp");
  render(
    <ChatHeadlessProvider config={dummyConfig}>
      <MessageBubble
        message={dummyMessage}
        showTimestamp={true}
        formatTimestamp={customFormatTimestamp}
      />
    </ChatHeadlessProvider>
  );
  expect(customFormatTimestamp).toBeCalledTimes(1);
  expect(customFormatTimestamp).toBeCalledWith(dummyMessage.timestamp);
  expect(screen.getByText("my special timestamp")).toBeInTheDocument();
});

it("omits timestamp when showTimestamp field is false", () => {
  render(
    <ChatHeadlessProvider config={dummyConfig}>
      <MessageBubble message={dummyMessage} showTimestamp={false} />
    </ChatHeadlessProvider>
  );
  expect(screen.queryByText(timestampRegex)).not.toBeInTheDocument();
});
