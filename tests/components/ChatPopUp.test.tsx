// issue with testing library + React 18: https://github.com/testing-library/react-testing-library/issues/1216
/* eslint-disable testing-library/no-unnecessary-act */

import { act, render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { ChatPopUp, ChatPopUpProps } from "../../src";
import {
  ChatHeadlessProvider,
  HeadlessConfig,
  MessageSource,
} from "@yext/chat-headless-react";
import { mockChatActions, mockChatState } from "../__utils__/mocks";

jest.mock("@yext/analytics");

beforeEach(() => {
  mockChatActions({
    getNextMessage: jest.fn(() => Promise.resolve()),
    streamNextMessage: jest.fn(() => Promise.resolve()),
    report: jest.fn(),
  });
});

const dummyConfig: HeadlessConfig = {
  apiKey: "",
  botId: "",
};

it("toggles display and hide css classes when click on popup button", async () => {
  renderPopUp({
    customCssClasses: {
      panel__display: "panel-display-css",
      panel__hidden: "panel-hidden-css",
      closedPopupContainer__display: "closed-popup-elements-display-css",
      closedPopupContainer__hidden: "closed-popup-elements-hidden-css",
    },
  });
  expect(screen.getByLabelText("Chat Popup Panel")).toHaveClass(
    "panel-hidden-css"
  );
  expect(screen.getByLabelText("Chat Closed Popup Container")).toHaveClass(
    "closed-popup-elements-display-css"
  );

  const popupButton = screen.getByLabelText("Chat Popup Button");
  await act(() => userEvent.click(popupButton));
  expect(screen.getByLabelText("Chat Popup Panel")).toHaveClass(
    "panel-display-css"
  );
  expect(screen.getByLabelText("Chat Closed Popup Container")).toHaveClass(
    "closed-popup-elements-hidden-css"
  );
});

it("does not render panel until pop up is opened", async () => {
  renderPopUp();
  expect(screen.queryByLabelText("Send Message")).toBeNull();

  const popupButton = screen.getByLabelText("Chat Popup Button");
  await act(() => userEvent.click(popupButton));

  expect(screen.getByLabelText("Send Message")).toBeTruthy();
});

describe("openOnLoad", () => {
  it("renders panel on load when openOnLoad is true", async () => {
    renderPopUp({ openOnLoad: true });
    expect(screen.getByLabelText("Send Message")).toBeTruthy();
  });

  it("does not render panel on load when openOnLoad is false", async () => {
    renderPopUp({ openOnLoad: false });
    expect(screen.queryByLabelText("Send Message")).toBeNull();
  });
});

describe("ctaLabel", () => {
  it("renders CTA label when a label is provided", async () => {
    renderPopUp({ ctaLabel: "ChatPopUp Test" });
    expect(screen.getByText("ChatPopUp Test")).toBeTruthy();
  });

  it("open panel when CTA label is clicked", async () => {
    renderPopUp({
      ctaLabel: "ChatPopUp Test",
      customCssClasses: {
        panel__display: "panel-display-css",
        panel__hidden: "panel-hidden-css",
        closedPopupContainer__display: "closed-popup-elements-display-css",
        closedPopupContainer__hidden: "closed-popup-elements-hidden-css",
      },
    });

    expect(screen.getByText("ChatPopUp Test")).toBeTruthy();
    expect(screen.getByLabelText("Chat Closed Popup Container")).toHaveClass(
      "closed-popup-elements-display-css"
    );
    expect(screen.getByLabelText("Chat Popup Panel")).toHaveClass(
      "panel-hidden-css"
    );

    const ctaButton = screen.getByText("ChatPopUp Test");
    await act(() => userEvent.click(ctaButton));
    expect(screen.getByLabelText("Chat Closed Popup Container")).toHaveClass(
      "closed-popup-elements-hidden-css"
    );
    expect(screen.getByLabelText("Chat Popup Panel")).toHaveClass(
      "panel-display-css"
    );
  });

  it("does not render CTA label by default", async () => {
    renderPopUp();
    expect(screen.queryByText("ChatPopUp Test")).toBeNull();
  });
});

describe("showInitialMessagePopUp", () => {
  beforeEach(() => {
    mockChatState({
      conversation: {
        messages: [
          {
            text: "initial message",
            source: MessageSource.BOT,
            timestamp: "2023-06-01T15:26:55.362Z",
          },
        ],
      },
    });
  });

  it("does not initial message popup on load when showInitialMessagePopUp is false", async () => {
    renderPopUp({ showInitialMessagePopUp: false });
    expect(screen.queryByText("initial message")).toBeNull();
    expect(screen.queryByLabelText("Close Initial Message")).toBeNull();
  });

  it("renders initial message popup on load when showInitialMessagePopUp is true", async () => {
    renderPopUp({ showInitialMessagePopUp: true });
    expect(screen.getByText("initial message")).toBeTruthy();
    expect(screen.getByLabelText("Close Initial Message")).toBeTruthy();
  });

  it("does not render initial message popup when close button is clicked", async () => {
    renderPopUp({ showInitialMessagePopUp: true });
    expect(screen.getByText("initial message")).toBeTruthy();

    const closeButton = screen.getByLabelText("Close Initial Message");
    await act(() => userEvent.click(closeButton));

    expect(screen.queryByText("initial message")).toBeNull();
  });
});

function renderPopUp(props?: Partial<ChatPopUpProps>) {
  render(
    <ChatHeadlessProvider config={dummyConfig}>
      <ChatPopUp {...props} title="Test Popup" />
    </ChatHeadlessProvider>
  );
}
