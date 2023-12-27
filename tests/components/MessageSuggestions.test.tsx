// issue with testing library + React 18: https://github.com/testing-library/react-testing-library/issues/1216
/* eslint-disable testing-library/no-unnecessary-act */

import { act, render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { mockChatHooks, spyOnActions } from "../__utils__/mocks";
import { MessageSuggestions } from "../../src/components/MessageSuggestions";

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
      setMessageNotes: jest.fn(),
    },
  });
});

it("sends message when pill is clicked", async () => {
  render(<MessageSuggestions suggestions={["test msg"]} />);
  const actions = spyOnActions();
  const button = screen.getByRole("button");
  expect(button).toHaveTextContent("test msg");
  await act(() => userEvent.click(button));
  expect(actions.getNextMessage).toHaveBeenCalledTimes(1);
});

it("clears note replies when pill is clicked", async () => {
  render(<MessageSuggestions suggestions={["test msg"]} />);
  const actions = spyOnActions();
  const button = screen.getByRole("button");
  expect(button).toHaveTextContent("test msg");
  await act(() => userEvent.click(button));
  expect(actions.setMessageNotes).toHaveBeenCalledTimes(1);
  expect(actions.setMessageNotes).toHaveBeenCalledWith({
    suggestedReplies: undefined,
  });
});
