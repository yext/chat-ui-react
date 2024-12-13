/* eslint-disable testing-library/no-unnecessary-act */
/* eslint-disable testing-library/no-node-access */
import {
  act,
  render,
  screen,
  waitFor,
  fireEvent,
} from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { ChatPanel } from "../../src";
import {
  mockChatActions,
  mockChatHooks,
  mockChatState,
  spyOnActions,
} from "../__utils__/mocks";
import { Message, MessageSource } from "@yext/chat-headless-react";
import {
  PanelState,
  getStateLocalStorageKey,
} from "../../src/components/ChatPanel";

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

it("displays message bubbles based on messages in state", () => {
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

it("executes onLinkClick if provided", async () => {
  const onLinkClickCb = jest.fn();
  mockChatState({
    conversation: {
      messages: [{ text: "Test [msg link](msglink)" }],
      isLoading: false,
      canSendMessage: true,
    },
  });
  render(
    <ChatPanel
      footer="Test [footer link](footerlink)"
      onLinkClick={(href) => onLinkClickCb(href)}
    />
  );
  await act(() =>
    userEvent.click(screen.getByRole("link", { name: "footer link" }))
  );
  expect(onLinkClickCb).toBeCalledWith("footerlink");
  await act(() =>
    userEvent.click(screen.getByRole("link", { name: "msg link" }))
  );
  expect(onLinkClickCb).toBeCalledWith("msglink");
});

it("applies link target setting (parent)", async () => {
  mockChatState({
    conversation: {
      messages: [{ text: "Test [msg link](msglink)" }],
      isLoading: false,
      canSendMessage: true,
    },
  });

  render(<ChatPanel linkTarget="_parent" />);
  expect(screen.getByText("msg link")).toHaveAttribute("target", "_parent");
});

it("applies link target setting (blank)", async () => {
  mockChatState({
    conversation: {
      messages: [{ text: "Test [msg link](msglink)" }],
      isLoading: false,
      canSendMessage: true,
    },
  });

  render(<ChatPanel linkTarget="_blank" />);
  expect(screen.getByText("msg link")).toHaveAttribute("target", "_blank");
});

it("applies link target setting (default blank)", async () => {
  mockChatState({
    conversation: {
      messages: [{ text: "Test [msg link](msglink)" }],
      isLoading: false,
      canSendMessage: true,
    },
  });

  render(<ChatPanel />);
  expect(screen.getByText("msg link")).toHaveAttribute("target", "_blank");
});

describe("loadSessionState works as expected", () => {
  const jestHostname = "localhost";
  window.location.hostname = jestHostname;
  const mockConvoId = "dummy-id";
  const mockKey = getStateLocalStorageKey(jestHostname, mockConvoId);
  const mockPanelState: PanelState = {
    scrollPosition: 23,
  };
  const mockConvoState = {
    conversation: {
      conversationId: mockConvoId,
      messages: [{ ...dummyMessage, timestamp: new Date().toISOString() }],
    },
  };
  const mockOldConvoState = {
    conversation: {
      conversationId: mockConvoId,
      messages: [dummyMessage],
    },
  };

  it("saves panel state to local storage", () => {
    mockChatState(mockConvoState);
    const storageSetSpy = jest.spyOn(Storage.prototype, "setItem");

    const { container } = render(<ChatPanel />);
    const scrollDiv = getChatPanelScrollDiv(container);

    fireEvent.scroll(scrollDiv, {
      target: { scrollTop: mockPanelState.scrollPosition },
    });

    expect(storageSetSpy).toHaveBeenCalledWith(
      mockKey,
      JSON.stringify(mockPanelState)
    );
    expect(localStorage.getItem(mockKey)).toEqual(
      JSON.stringify(mockPanelState)
    );
  });

  it("loads panel from local storage", () => {
    mockChatState(mockConvoState);
    localStorage.setItem(mockKey, JSON.stringify(mockPanelState));
    const storageGetSpy = jest.spyOn(Storage.prototype, "getItem");

    render(<ChatPanel />);
    expect(storageGetSpy).toHaveBeenCalledWith(mockKey);
    expect(localStorage.getItem(mockKey)).toEqual(
      JSON.stringify(mockPanelState)
    );
  });

  it("handles invalid state in local storage when saving new state", () => {
    mockChatState(mockConvoState);
    localStorage.setItem(mockKey, "hello world");
    const storageSetSpy = jest.spyOn(Storage.prototype, "setItem");
    const consoleWarnSpy = jest.spyOn(console, "warn").mockImplementation();
    const { container } = render(<ChatPanel />);
    const scrollDiv = getChatPanelScrollDiv(container);

    fireEvent.scroll(scrollDiv, {
      target: { scrollTop: mockPanelState.scrollPosition },
    });

    expect(storageSetSpy).toHaveBeenCalledWith(
      mockKey,
      JSON.stringify(mockPanelState)
    );
    expect(localStorage.getItem(mockKey)).toEqual(
      JSON.stringify(mockPanelState)
    );

    expect(consoleWarnSpy).toBeCalledTimes(1);
    expect(consoleWarnSpy).toBeCalledWith(
      "Unabled to load saved panel state: error parsing state."
    );
  });

  it("handles invalid state in local storage when loading saved state", () => {
    mockChatState(mockConvoState);
    localStorage.setItem(mockKey, "hello world");
    const storageGetSpy = jest.spyOn(Storage.prototype, "getItem");
    const storageRemoveSpy = jest.spyOn(Storage.prototype, "removeItem");
    const consoleWarnSpy = jest.spyOn(console, "warn").mockImplementation();
    render(<ChatPanel />);

    expect(storageGetSpy).toHaveBeenCalledWith(mockKey);
    expect(storageRemoveSpy).toHaveBeenCalledWith(mockKey);
    expect(localStorage.getItem(mockKey)).toBeNull();

    expect(consoleWarnSpy).toBeCalledTimes(1);
    expect(consoleWarnSpy).toBeCalledWith(
      "Unabled to load saved panel state: error parsing state."
    );
  });

  it("ignores and removes state when loading saved state older than 24 hours", () => {
    mockChatState(mockOldConvoState);
    localStorage.setItem(mockKey, JSON.stringify(mockPanelState));
    const storageGetSpy = jest.spyOn(Storage.prototype, "getItem");
    const storageRemoveSpy = jest.spyOn(Storage.prototype, "removeItem");

    render(<ChatPanel />);
    expect(storageGetSpy).toHaveBeenCalledWith(mockKey);
    expect(storageRemoveSpy).toHaveBeenCalledWith(mockKey);
    expect(localStorage.getItem(mockKey)).toBeNull();
  });
});

const getChatPanelScrollDiv = (chatPanelContainer: HTMLElement) => {
  return chatPanelContainer.getElementsByClassName(
    "yext-chat-panel__messages-container"
  )[0];
};
