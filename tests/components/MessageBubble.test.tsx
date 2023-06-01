import { render, screen } from "@testing-library/react";
import { MessageBubble } from "../../src";
import { Message, MessageSource } from "@yext/chat-headless-react";

const dummyMessage: Message = {
  text: "What is Yext Chat?",
  timestamp: "2023-06-01T15:26:55.362Z",
  source: MessageSource.USER,
};

const timestampRegex = /\d\d:\d\d:\d\d (AM|PM)/
it("displays message as expected", () => {
  render(<MessageBubble message={dummyMessage} />);
  expect(screen.getByText(dummyMessage.text)).toBeInTheDocument();
});

it("displays converted timestamp when showTimestamp field is true", () => {
  render(<MessageBubble message={dummyMessage} showTimestamp={true} />);
  expect(screen.getByText(timestampRegex)).toBeInTheDocument();
});

it("invokes custom formatTimestamp function when provided", () => {
  const customFormatTimestamp = jest.fn(() => "my special timestamp");
  render(
    <MessageBubble
      message={dummyMessage}
      showTimestamp={true}
      formatTimestamp={customFormatTimestamp}
    />
  );
  expect(customFormatTimestamp).toBeCalledTimes(1);
  expect(customFormatTimestamp).toBeCalledWith(dummyMessage.timestamp);
  expect(screen.getByText("my special timestamp")).toBeInTheDocument();
});

it("omits timestamp when showTimestamp field is false", () => {
  render(<MessageBubble message={dummyMessage} showTimestamp={false} />);
  expect(screen.queryByText(timestampRegex)).not.toBeInTheDocument();
});
