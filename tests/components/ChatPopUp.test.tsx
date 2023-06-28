// issue with testing library + React 18: https://github.com/testing-library/react-testing-library/issues/1216
/* eslint-disable testing-library/no-unnecessary-act */

import { act, render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { ChatPopUp } from "../../src";
import { ChatHeadlessProvider } from "@yext/chat-headless-react";
import { mockChatActions } from "../__utils__/mocks";

jest.mock("@yext/analytics")

beforeEach(() => {
  mockChatActions({
    getNextMessage: jest.fn(() => Promise.resolve()),
    streamNextMessage: jest.fn(() => Promise.resolve()),
    report: jest.fn()
  })
})

it("toggles display and hide css classes when click on popup button", async () => {
  render(
    <ChatHeadlessProvider
      config={{
        apiKey: "",
        botId: "",
      }}
    >
      <ChatPopUp
        title="Test Popup"
        stream={false}
        customCssClasses={{
          panel__display: "panel-display-css",
          panel__hidden: "panel-hidden-css",
          button__display: "button-display-css",
          button__hidden: "button-hidden-css",
        }}
      />
    </ChatHeadlessProvider>
  );
  expect(screen.getByLabelText("Chat Popup Panel")).toHaveClass(
    "panel-hidden-css"
  );
  expect(screen.getByLabelText("Chat Popup Button")).toHaveClass(
    "button-display-css"
  );

  const popupButton = screen.getByLabelText("Chat Popup Button");
  await act(() => userEvent.click(popupButton));
  expect(screen.getByLabelText("Chat Popup Panel")).toHaveClass(
    "panel-display-css"
  );
  expect(screen.getByLabelText("Chat Popup Button")).toHaveClass(
    "button-hidden-css"
  );
});
