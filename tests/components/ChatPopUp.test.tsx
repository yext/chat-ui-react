// issue with testing library + React 18: https://github.com/testing-library/react-testing-library/issues/1216
/* eslint-disable testing-library/no-unnecessary-act */

import { act, render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { ChatPopUp, ChatPopUpProps } from "../../src";
import {
  ChatHeadlessProvider,
  HeadlessConfig,
  MessageSource,
  useChatActions,
} from "@yext/chat-headless-react";
import {
  mockChatActions,
  mockChatAnalytics,
  mockChatState,
} from "../__utils__/mocks";

beforeEach(() => {
  mockChatAnalytics();
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

  it("does not render initial message popup on load when showInitialMessagePopUp is false", async () => {
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

describe("showUnreadNotification", () => {
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

  it("does not render number of unread messages notification when it is false", async () => {
    renderPopUp({ showUnreadNotification: false });
    expect(screen.queryByLabelText("Unread Messages Notification")).toBeNull();
  });

  it("renders number of unread messages notification it is true", async () => {
    renderPopUp({ showUnreadNotification: true });
    expect(screen.getByLabelText("Unread Messages Notification")).toBeTruthy();
    expect(screen.getByText("1")).toBeTruthy();
  });

  it("clears the number of unread messages and stops animation when panel is opened and then closed", async () => {
    renderPopUp({ showHeartBeatAnimation: true, showUnreadNotification: true });
    expect(screen.getByLabelText("Unread Messages Notification")).toBeTruthy();
    expect(screen.getByText("1")).toBeTruthy();
    expect(screen.getByLabelText("Chat Popup Button")).toHaveClass(
      "animate-heartbeat"
    );

    const openButton = screen.getByLabelText("Chat Popup Button");
    await act(() => userEvent.click(openButton));

    const closeButton = screen.getByLabelText("Close Chat");
    await act(() => userEvent.click(closeButton));

    expect(screen.queryByLabelText("Unread Messages Notification")).toBeNull();
    expect(screen.queryByText("1")).toBeNull();
    expect(screen.queryByLabelText("Chat Popup Button")).not.toHaveClass(
      "animate-heartbeat"
    );
  });

  it("updates the number of unread messages when new messages are added while panel is closed", async () => {
    jest.resetAllMocks(); // remove mocks to trigger state update
    mockChatAnalytics();
    const TestTrigger = () => {
      const actions = useChatActions();
      return (
        <button
          onClick={() =>
            actions.addMessage({
              text: "test",
              source: MessageSource.BOT,
            })
          }
        >
          Add Test Message
        </button>
      );
    };
    renderPopUp({ showUnreadNotification: true }, <TestTrigger />);
    expect(await screen.findByText("1")).toBeTruthy(); // initial message fetch on load

    const addMessageButton = screen.getByText("Add Test Message");
    await act(() => userEvent.click(addMessageButton));

    expect(await screen.findByText("2")).toBeTruthy();
  });
});

function renderPopUp(props?: Partial<ChatPopUpProps>, children?: JSX.Element) {
  render(
    <ChatHeadlessProvider config={dummyConfig}>
      <ChatPopUp {...props} title="Test Popup" />
      {children}
    </ChatHeadlessProvider>
  );
}
