// issue with testing library + React 18: https://github.com/testing-library/react-testing-library/issues/1216
/* eslint-disable testing-library/no-unnecessary-act */
import { render, screen, waitFor } from "@testing-library/react";
import { ChatPanel } from "../../src";
import {
  mockChatActions,
  mockChatHooks,
  mockChatState,
  spyOnActions,
} from "../__utils__/mocks";
import { Message, MessageSource } from "@yext/chat-headless-react";
import React from "react";

const dummyMessage: Message = {
  timestamp: "2023-05-31T14:22:19.376Z",
  source: "BOT",
  text: "Hello! This is Yext Chat!",
};

jest.mock("@yext/analytics");

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
      report: jest.fn(),
    },
  });
});

it("send request to get initial message on load (stream)", () => {
  const actions = spyOnActions();
  render(<ChatPanel stream={true} />);
  expect(actions.streamNextMessage).toBeCalledTimes(1);
  expect(actions.streamNextMessage).toBeCalledWith();
});

it("send request to get initial message on load (non-stream)", () => {
  const actions = spyOnActions();
  render(<ChatPanel />);
  expect(actions.getNextMessage).toBeCalledTimes(1);
  expect(actions.getNextMessage).toBeCalledWith();
});

it("logs request error and add an error message to state by default", async () => {
  mockChatActions({
    getNextMessage: jest.fn(() => Promise.reject("API Error")),
    addMessage: jest.fn(),
    report: jest.fn(),
  });
  const chatActionsSpy = spyOnActions();
  const consoleErrorSpy = jest.spyOn(console, "error").mockImplementation();
  render(<ChatPanel />);
  await waitFor(() => expect(consoleErrorSpy).toBeCalledTimes(1));
  expect(consoleErrorSpy).toBeCalledWith("API Error");
  expect(chatActionsSpy.addMessage).toBeCalledWith({
    text: "Sorry, I'm unable to respond at the moment. Please try again later!",
    source: MessageSource.BOT,
    timestamp: expect.any(String),
  });
});

it("executes custom handleError if provided", async () => {
  mockChatActions({
    getNextMessage: jest.fn(() => Promise.reject("API Error")),
    report: jest.fn(),
  });
  const customHandleError = jest.fn();
  render(<ChatPanel handleError={customHandleError} />);
  await waitFor(() => expect(customHandleError).toBeCalledTimes(1));
  expect(customHandleError).toBeCalledWith("API Error");
});

it("doesn't send request to get initial message when there are existing messages on load", () => {
  mockChatState({
    conversation: {
      messages: [dummyMessage],
      canSendMessage: true,
    },
  });
  const actions = spyOnActions();
  render(<ChatPanel />);
  expect(actions.getNextMessage).toBeCalledTimes(0);
});

it("renders loading dots when loading status is true", () => {
  mockChatState({
    conversation: {
      messages: [dummyMessage],
      isLoading: true,
      canSendMessage: false,
    },
  });
  render(<ChatPanel />);
  expect(screen.getByLabelText("Loading Indicator")).toBeInTheDocument();
});

it("does not render loading dots when loading status is false", () => {
  mockChatState({
    conversation: {
      messages: [dummyMessage],
      isLoading: false,
      canSendMessage: true,
    },
  });
  render(<ChatPanel />);
  expect(screen.queryByLabelText("Loading Indicator")).not.toBeInTheDocument();
});

it("display message bubbles based on messages in state", () => {
  mockChatState({
    conversation: {
      messages: [dummyMessage],
      isLoading: false,
      canSendMessage: true,
    },
  });
  render(<ChatPanel />);
  expect(screen.getByText(dummyMessage.text)).toBeInTheDocument();
});
