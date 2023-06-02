// issue with testing library + React 18: https://github.com/testing-library/react-testing-library/issues/1216
/* eslint-disable testing-library/no-unnecessary-act */

import { render, screen, act } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { ChatHeader } from "../../src/components";
import {
  mockChatHooks,
  spyOnActions,
} from "../__utils__/mocks";

beforeEach(() => {
  mockChatHooks({
    mockedActions: {
      restartConversation: jest.fn(() => Promise.resolve()),
    },
  });
});

it("calls restartConversation when refresh button is clicked", async () => {
  render(<ChatHeader title="Clippy's Chatbot" showRefreshButton={true} />);

  const refreshButton = screen.getByRole("button");
  await act(() => userEvent.click(refreshButton));

  const actions = spyOnActions();
  expect(actions.restartConversation).toHaveBeenCalledTimes(1);
});

it("does not display refresh button by default", () => {
  render(<ChatHeader title="Clippy's Chatbot" />);
  expect(screen.queryByRole("button")).toBeNull();
});

