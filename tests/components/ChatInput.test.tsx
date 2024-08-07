// issue with testing library + React 18: https://github.com/testing-library/react-testing-library/issues/1216
/* eslint-disable testing-library/no-unnecessary-act */

import { act, render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { ChatInput } from "../../src";
import {
  mockChatActions,
  mockChatHooks,
  mockChatState,
  spyOnActions,
} from "../__utils__/mocks";
import { MessageSource } from "@yext/chat-headless-react";

beforeEach(() => {
  mockChatHooks({
    mockedState: {
      conversation: {
        messages: [],
        canSendMessage: true,
      },
    },
    mockedActions: {
      streamNextMessage: jest.fn(() => Promise.resolve()),
      getNextMessage: jest.fn(() => Promise.resolve()),
    },
  });
});

it("updates text when type in textarea", async () => {
  render(<ChatInput />);
  const textbox = screen.getByRole("textbox");
  expect(textbox).toHaveDisplayValue("");
  await act(() => userEvent.type(textbox, "test"));
  expect(textbox).toHaveDisplayValue("test");
});

it("maintains focus on input box by default", async () => {
  render(<ChatInput />);
  const textbox = screen.getByRole("textbox");
  expect(textbox).toHaveFocus();
});

it("does not focus on input box when inputAutoFocus field is set to false", async () => {
  render(<ChatInput inputAutoFocus={false} />);
  const textbox = screen.getByRole("textbox");
  expect(textbox).not.toHaveFocus();
});

it("sends request and reset input when click on send button", async () => {
  render(<ChatInput />);
  const actions = spyOnActions();

  const textbox = screen.getByRole("textbox");
  await act(() => userEvent.type(textbox, "test"));
  expect(textbox).toHaveDisplayValue("test");

  const sendButton = screen.getByRole("button");
  await act(() => userEvent.click(sendButton));

  expect(actions.getNextMessage).toBeCalledTimes(1);
  expect(textbox).toHaveDisplayValue("");
});

it("sends request when hit enter in textarea", async () => {
  render(<ChatInput />);
  const actions = spyOnActions();

  const textbox = screen.getByRole("textbox");
  await act(() => userEvent.type(textbox, "test"));
  await act(() => userEvent.keyboard("{Enter}"));
  expect(actions.getNextMessage).toBeCalledTimes(1);
  expect(textbox).toHaveDisplayValue("");
});

it("does not send request when hit enter in textarea while canSendMessage is false", async () => {
  mockChatState({
    conversation: {
      canSendMessage: false,
    },
  });
  render(<ChatInput />);
  const actions = spyOnActions();

  const textbox = screen.getByRole("textbox");
  await act(() => userEvent.type(textbox, "test"));
  await act(() => userEvent.keyboard("{Enter}"));
  expect(actions.getNextMessage).toBeCalledTimes(0);
  expect(textbox).toHaveDisplayValue("test");
});

it("does not send request when hit enter in textarea while input is whitespace", async () => {
  mockChatState({
    conversation: {
      canSendMessage: true,
    },
  });
  render(<ChatInput />);
  const actions = spyOnActions();
  const textbox = screen.getByRole("textbox");
  await act(() => userEvent.type(textbox, "   "));
  await act(() => userEvent.keyboard("{Enter}"));
  expect(actions.getNextMessage).toBeCalledTimes(0);
  expect(textbox).toHaveDisplayValue("   ");
});

it("does not send request when hit enter in textarea while input is empty", async () => {
  mockChatState({
    conversation: {
      canSendMessage: true,
    },
  });
  render(<ChatInput />);
  const actions = spyOnActions();

  const textbox = screen.getByRole("textbox");
  await act(() => userEvent.keyboard("{Enter}"));
  expect(actions.getNextMessage).toBeCalledTimes(0);
  expect(textbox).toHaveDisplayValue("");
});

it("adds new line hit shift + enter in textarea", async () => {
  render(<ChatInput />);
  const actions = spyOnActions();

  const textbox = screen.getByRole("textbox");
  await act(() => userEvent.type(textbox, "test"));
  await act(() => userEvent.keyboard("{Shift>}{Enter}{/Shift}"));
  expect(actions.getNextMessage).toBeCalledTimes(0);
  expect(textbox).toHaveDisplayValue("test\n");
});

it("disables send button when canSendMessage is false", () => {
  mockChatState({
    conversation: {
      canSendMessage: false,
    },
  });
  render(<ChatInput />);
  expect(screen.getByRole("button")).toBeDisabled();
});

it("disables send button when input is empty", () => {
  mockChatState({
    conversation: {
      canSendMessage: true,
    },
  });
  render(<ChatInput />);
  expect(screen.getByRole("button")).toBeDisabled();
});

it("enables stream behavior when stream prop is true", async () => {
  render(<ChatInput stream={true} />);
  const actions = spyOnActions();

  await act(() => userEvent.type(screen.getByRole("textbox"), "test"));
  const sendButton = screen.getByRole("button");
  await act(() => userEvent.click(sendButton));
  expect(actions.streamNextMessage).toBeCalledTimes(1);
  expect(actions.getNextMessage).toBeCalledTimes(0);
});

it("disables stream behavior by default", async () => {
  render(<ChatInput />);
  const actions = spyOnActions();

  await act(() => userEvent.type(screen.getByRole("textbox"), "test"));
  const sendButton = screen.getByRole("button");
  await act(() => userEvent.click(sendButton));
  expect(actions.streamNextMessage).toBeCalledTimes(0);
  expect(actions.getNextMessage).toBeCalledTimes(1);
});

it("logs request error and add an error message to state by default", async () => {
  mockChatActions({
    streamNextMessage: jest.fn(() => Promise.reject("API Error")),
    addMessage: jest.fn(),
  });
  const chatActionsSpy = spyOnActions();
  const consoleErrorSpy = jest.spyOn(console, "error").mockImplementation();
  render(<ChatInput stream={true} />);
  await act(() => userEvent.type(screen.getByRole("textbox"), "test"));
  const sendButton = screen.getByRole("button");
  await act(() => userEvent.click(sendButton));
  expect(consoleErrorSpy).toBeCalledTimes(1);
  expect(consoleErrorSpy).toBeCalledWith("API Error");
  expect(chatActionsSpy.addMessage).toBeCalledTimes(1);
  expect(chatActionsSpy.addMessage).toBeCalledWith({
    text: "Sorry, I'm unable to respond at the moment. Please try again later!",
    source: MessageSource.BOT,
    timestamp: expect.any(String),
  });
});

it("executes custom handleError if provided", async () => {
  mockChatActions({
    getNextMessage: jest.fn(() => Promise.reject("API Error")),
  });
  const customHandleError = jest.fn();
  render(<ChatInput handleError={customHandleError} />);
  await act(() => userEvent.type(screen.getByRole("textbox"), "test"));
  const sendButton = screen.getByRole("button");
  await act(() => userEvent.click(sendButton));
  expect(customHandleError).toBeCalledTimes(1);
  expect(customHandleError).toBeCalledWith("API Error");
});

it("executes onSend if provided", async () => {
  const onSendCb = jest.fn();
  render(<ChatInput onSend={(message) => onSendCb(message)} />);
  await act(() => userEvent.type(screen.getByRole("textbox"), "test"));
  const sendButton = screen.getByRole("button");
  await act(() => userEvent.click(sendButton));
  expect(onSendCb).toBeCalledWith("test");
});
