import { render, screen, act } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { ChatHeader } from "../../src/components";
import { mockChatHooks, spyOnActions, mockChatActions } from "../__utils__/mocks";

beforeEach(() => {
  mockChatHooks({
    mockedActions: {
      restartConversation: jest.fn(() => Promise.resolve()),
      getNextMessage: jest.fn(() => Promise.resolve()),
    },
  });
});

it("calls restartConversation and getNextMessage when refresh button is clicked", async () => {
  render(<ChatHeader title="Clippy's Chatbot" showRefreshButton={true} />);
    
  const buttonElement = screen.getByRole("button");
  await userEvent.click(buttonElement);

  const actions = spyOnActions();
  expect(actions.restartConversation).toHaveBeenCalledTimes(1);
  expect(actions.getNextMessage).toHaveBeenCalledTimes(1);
});

it("does not display refresh button by default", () => {
  render(<ChatHeader title="Clippy's Chatbot" />);
  expect(screen.queryByRole("button")).toBeNull();
});

it("should log request error by default", async () => {
  mockChatActions({
    restartConversation: jest.fn(() => Promise.resolve()),
    getNextMessage: jest.fn(() => Promise.reject("API Error")),
  });
  const consoleErrorSpy = jest.spyOn(console, "error").mockImplementation();
  render(<ChatHeader title="Clippy's Chatbot" showRefreshButton={true} />);
  const refreshButton = screen.getByRole("button");
  await userEvent.click(refreshButton);
  expect(consoleErrorSpy).toBeCalledTimes(1);
  expect(consoleErrorSpy).toBeCalledWith("API Error");
});

it("should execute custom handleError if provided", async () => {
  mockChatActions({
    restartConversation: jest.fn(() => Promise.resolve()),
    getNextMessage: jest.fn(() => Promise.reject("API Error")),
  });
  const customHandleError = jest.fn();
  render(<ChatHeader title="Clippy's Chatbot" handleError={customHandleError} showRefreshButton={true} />);
  const refreshButton = screen.getByRole("button");
  await userEvent.click(refreshButton);
  expect(customHandleError).toBeCalledTimes(1);
  expect(customHandleError).toBeCalledWith("API Error");
});
