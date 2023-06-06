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

beforeEach(() => {
  mockChatHooks({
    mockedState: {
      conversation: {
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

it("does not focus on input box by default", async () => {
  render(<ChatInput />);
  const textbox = screen.getByRole("textbox");
  expect(textbox).not.toHaveFocus();
});

it("maintains focus on input box when inputAutoFocus field is set to true", async () => {
  render(<ChatInput inputAutoFocus={true} />);
  const textbox = screen.getByRole("textbox");
  expect(textbox).toHaveFocus();
});

it("sends request and reset input when click on send button", async () => {
  render(<ChatInput />);
  const actions = spyOnActions();

  const textbox = screen.getByRole("textbox");
  await act(() => userEvent.type(textbox, "test"));
  expect(textbox).toHaveDisplayValue("test");

  const sendButton = screen.getByRole("button");
  await act(() => userEvent.click(sendButton));

  expect(actions.streamNextMessage).toBeCalledTimes(1);
  expect(textbox).toHaveDisplayValue("");
});

it("sends request when hit enter in textarea", async () => {
  render(<ChatInput />);
  const actions = spyOnActions();

  const textbox = screen.getByRole("textbox");
  await act(() => userEvent.type(textbox, "test"));
  await act(() => userEvent.keyboard("{Enter}"));
  expect(actions.streamNextMessage).toBeCalledTimes(1);
});

it("disables textarea and send button when canSendMessage is false", () => {
  mockChatState({
    conversation: {
      canSendMessage: false,
    },
  });
  render(<ChatInput />);
  expect(screen.getByRole("button")).toBeDisabled();
  expect(screen.getByRole("textbox")).toBeDisabled();
});

it("enables stream behavior by default", async () => {
  render(<ChatInput />);
  const actions = spyOnActions();

  const sendButton = screen.getByRole("button");
  await act(() => userEvent.click(sendButton));
  expect(actions.streamNextMessage).toBeCalledTimes(1);
  expect(actions.getNextMessage).toBeCalledTimes(0);
});

it("disables stream behavior when stream prop is false", async () => {
  render(<ChatInput stream={false} />);
  const actions = spyOnActions();

  const sendButton = screen.getByRole("button");
  await act(() => userEvent.click(sendButton));
  expect(actions.streamNextMessage).toBeCalledTimes(0);
  expect(actions.getNextMessage).toBeCalledTimes(1);
});

it("logs request error by default", async () => {
  mockChatActions({
    streamNextMessage: jest.fn(() => Promise.reject("API Error")),
  });
  const consoleErrorSpy = jest.spyOn(console, "error").mockImplementation();
  render(<ChatInput />);
  const sendButton = screen.getByRole("button");
  await act(() => userEvent.click(sendButton));
  expect(consoleErrorSpy).toBeCalledTimes(1);
  expect(consoleErrorSpy).toBeCalledWith("API Error");
});

it("executes custom handleError if provided", async () => {
  mockChatActions({
    streamNextMessage: jest.fn(() => Promise.reject("API Error")),
  });
  const customHandleError = jest.fn();
  render(<ChatInput handleError={customHandleError} />);
  const sendButton = screen.getByRole("button");
  await act(() => userEvent.click(sendButton));
  expect(customHandleError).toBeCalledTimes(1);
  expect(customHandleError).toBeCalledWith("API Error");
});
