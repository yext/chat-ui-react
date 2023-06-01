import { render, screen } from "@testing-library/react";
import { MessageBubble } from "../../src";
import { Message, MessageSource } from "@yext/chat-headless-react";

const dummyMessage: Message = {
  text: "What is Yext Chat?",
  timestamp: "2023-06-01T15:26:55.362Z", //11:26:55 AM
  source: MessageSource.USER,
};

it("displays message as expected", () => {
  render(<MessageBubble message={dummyMessage} />);
  expect(screen.getByText(dummyMessage.text)).toBeInTheDocument();
});

it("displays converted timestamp when showTimestamp field is true", () => {
  render(<MessageBubble message={dummyMessage} showTimestamp={true} />);
  expect(screen.getByText("11:26:55 AM")).toBeInTheDocument();
});

it("omits timestamp when showTimestamp field is false", () => {
  render(<MessageBubble message={dummyMessage} showTimestamp={false} />);
  expect(screen.queryByText("11:26:55 AM")).not.toBeInTheDocument();
});