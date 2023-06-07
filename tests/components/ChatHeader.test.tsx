// issue with testing library + React 18: https://github.com/testing-library/react-testing-library/issues/1216
/* eslint-disable testing-library/no-unnecessary-act */

import { render, screen, act } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { ChatHeader } from "../../src/components";
import { mockChatHooks, spyOnActions } from "../__utils__/mocks";

beforeEach(() => {
  mockChatHooks({
    mockedActions: {
      restartConversation: jest.fn(() => Promise.resolve()),
    },
  });
});

it("calls restartConversation when restart button is clicked", async () => {
  render(<ChatHeader title="Clippy's Chatbot" showRestartButton={true} />);

  const restartButton = screen.getByLabelText("Restart Conversation");
  await act(() => userEvent.click(restartButton));

  const actions = spyOnActions();
  expect(actions.restartConversation).toHaveBeenCalledTimes(1);
});

it("does not display restart button by default", () => {
  render(<ChatHeader title="Clippy's Chatbot" />);
  expect(screen.queryByLabelText("Restart Conversation")).toBeNull();
});

it("calls onClose when close button is clicked", async () => {
  const onClose = jest.fn();
  render(<ChatHeader title="Clippy's Chatbot" showCloseButton={true} onClose={onClose} />);

  const closeButton = screen.getByLabelText("Close Chat");
  await act(() => userEvent.click(closeButton));

  expect(onClose).toHaveBeenCalledTimes(1);
});

it("does not display close button by default", () => {
  render(<ChatHeader title="Clippy's Chatbot" />);
  expect(screen.queryByLabelText("Close Chat")).toBeNull();
});
