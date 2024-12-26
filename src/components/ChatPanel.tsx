import React, {
  ReactNode,
  useCallback,
  useEffect,
  useMemo,
  useRef,
  useState,
  useLayoutEffect,
} from "react";
import { useChatState } from "@yext/chat-headless-react";
import {
  MessageBubble,
  MessageBubbleCssClasses,
  MessageBubbleProps,
} from "./MessageBubble";
import { ChatInput, ChatInputCssClasses, ChatInputProps } from "./ChatInput";
import { LoadingDots } from "./LoadingDots";
import { useComposedCssClasses } from "../hooks";
import { withStylelessCssClasses } from "../utils/withStylelessCssClasses";
import { useReportAnalyticsEvent } from "../hooks/useReportAnalyticsEvent";
import { useFetchInitialMessage } from "../hooks/useFetchInitialMessage";
import {
  MessageSuggestionCssClasses,
  MessageSuggestions,
} from "./MessageSuggestions";
import { Markdown, MarkdownCssClasses } from "./Markdown";

/**
 * The CSS class interface for the {@link ChatPanel} component.
 *
 * @public
 */
export interface ChatPanelCssClasses {
  container?: string;
  messagesContainer?: string;
  messagesScrollContainer?: string;
  inputContainer?: string;
  inputCssClasses?: ChatInputCssClasses;
  messageBubbleCssClasses?: MessageBubbleCssClasses;
  messageSuggestionClasses?: MessageSuggestionCssClasses;
  footer?: string;
}

const builtInCssClasses: ChatPanelCssClasses = withStylelessCssClasses(
  "Panel",
  {
    container: "h-full w-full flex flex-col relative shadow-2xl bg-white",
    messagesScrollContainer: "flex flex-col mt-auto overflow-hidden",
    messagesContainer:
      "flex flex-col gap-y-1 px-4 overflow-auto [&>*:first-child]:mt-3",
    inputContainer: "w-full p-4",
    messageBubbleCssClasses: {
      topContainer: "mt-1",
    },
    footer: "text-center text-slate-400 rounded-b-3xl px-4 pb-4 text-[12px]",
  }
);

/**
 * The props for the {@link ChatPanel} component.
 *
 * @public
 */
export interface ChatPanelProps
  extends Omit<MessageBubbleProps, "customCssClasses" | "message">,
    Omit<ChatInputProps, "customCssClasses"> {
  /** A header to render at the top of the panel. */
  header?: ReactNode;
  /** A footer markdown string to render at the bottom of the panel. */
  footer?: string;
  /**
   * CSS classes for customizing the component styling.
   */
  customCssClasses?: ChatPanelCssClasses;
  /**
   * A set of pre-written initial messages that the user
   * can click on instead of typing their own.
   */
  messageSuggestions?: string[];
  /** Link target open behavior on click.
   *  Defaults to "_blank".
   */
  linkTarget?: string;
  /** A callback which is called when user clicks a link. */
  onLinkClick?: (href?: string) => void;
  /**
   * Text to display when retrying.
   * Defaults to "Error occurred. Retrying".
   */
  retryText?: string;
}

/**
 * A component that renders a full panel for chat bot interactions. This includes
 * the message bubbles for the conversation, input box with send button, and header
 * (if provided).
 *
 * @public
 *
 * @param props - {@link ChatPanelProps}
 */
export function ChatPanel(props: ChatPanelProps) {
  const {
    header,
    footer,
    customCssClasses,
    stream,
    handleError,
    messageSuggestions,
    linkTarget = "_blank",
    onLinkClick,
    onSend: onSendProp,
    onRetry: onRetryProp,
    retryText = "Error occurred. Retrying",
  } = props;
  const messages = useChatState((state) => state.conversation.messages);
  const loading = useChatState((state) => state.conversation.isLoading);
  const suggestedReplies = useChatState(
    (state) => state.conversation.notes?.suggestedReplies
  );
  const conversationId = useChatState(
    (state) => state.conversation.conversationId
  );
  const cssClasses = useComposedCssClasses(builtInCssClasses, customCssClasses);
  const reportAnalyticsEvent = useReportAnalyticsEvent();
  useFetchInitialMessage(handleError, stream);

  const [retry, setRetry] = useState(false);
  const onSend = useCallback(
    (message: string) => {
      onSendProp?.(message);
      setRetry(false);
    },
    [onSendProp]
  );

  const onRetry = useCallback(
    (e: unknown) => {
      onRetryProp?.(e);
      setRetry(true);
    },
    [onRetryProp]
  );

  useEffect(() => {
    reportAnalyticsEvent({
      action: "CHAT_IMPRESSION",
    });
  }, [reportAnalyticsEvent]);

  const suggestions = useMemo(() => {
    if (
      messages.length === 0 ||
      (messages.length === 1 && messages[0].source === "BOT")
    ) {
      return messageSuggestions;
    }
    return suggestedReplies;
  }, [messages, suggestedReplies, messageSuggestions]);

  const messagesRef = useRef<Array<HTMLDivElement | null>>([]);
  const messagesContainer = useRef<HTMLDivElement>(null);

  // State to help detect initial messages rendering
  const [initialMessagesLength] = useState(messages.length);

  const savedPanelState = useMemo(() => {
    if (!conversationId || !messages.length) {
      return {};
    }
    return loadSessionState(
      conversationId,
      messages[messages.length - 1].timestamp
    );
  }, [conversationId, messages]);

  // Handle scrolling when messages change
  useEffect(() => {
    const isInitialRender = messages.length === initialMessagesLength;
    if (isInitialRender && savedPanelState.scrollPosition !== undefined) {
      messagesContainer.current?.scroll({
        top: savedPanelState?.scrollPosition,
        behavior: "auto",
      });
      return;
    }

    let scrollTop = 0;
    messagesRef.current = messagesRef.current.slice(0, messages.length);

    // Sums up scroll heights of all messages except the last one
    if (messagesRef?.current.length > 1) {
      scrollTop = messagesRef.current
        .slice(0, -1)
        .map((elem, _) => elem?.scrollHeight ?? 0)
        .reduce((total, height) => total + height);
    }

    // Scroll to the top of the last message
    messagesContainer.current?.scroll({
      top: scrollTop,
      behavior: "smooth",
    });
  }, [messages, initialMessagesLength, savedPanelState.scrollPosition]);

  const setMessagesRef = useCallback((index) => {
    if (!messagesRef?.current) return null;
    return (message) => (messagesRef.current[index] = message);
  }, []);

  const footerCssClasses: MarkdownCssClasses = useMemo(
    () => ({
      container: cssClasses.footer,
      link: "cursor-pointer hover:underline text-blue-600",
    }),
    [cssClasses]
  );

  useLayoutEffect(() => {
    const curr = messagesContainer.current;
    curr?.addEventListener("scroll", () => {
      if (!conversationId) {
        return;
      }
      saveSessionState(conversationId, {
        scrollPosition: curr.scrollTop,
      });
    });
  }, [messagesContainer, conversationId]);

  return (
    <div className="yext-chat w-full h-full">
      <div className={cssClasses.container}>
        {header}
        <div className={cssClasses.messagesScrollContainer}>
          <div ref={messagesContainer} className={cssClasses.messagesContainer}>
            {messages.map((message, index) => (
              <div key={index} ref={setMessagesRef(index)}>
                <MessageBubble
                  {...props}
                  customCssClasses={cssClasses.messageBubbleCssClasses}
                  message={message}
                  linkTarget={linkTarget}
                  onLinkClick={onLinkClick}
                />
              </div>
            ))}
            {loading && (
              <div className="flex">
                <LoadingDots />
                {retry && (
                  <p className="text-slate-500 text-[13px] font-bold">
                    {retryText}
                  </p>
                )}
              </div>
            )}
          </div>
        </div>
        <div className={cssClasses.inputContainer}>
          {suggestions && (
            <MessageSuggestions
              stream={stream}
              onSend={onSend}
              onRetry={onRetry}
              handleError={handleError}
              suggestions={suggestions}
              customCssClasses={cssClasses.messageSuggestionClasses}
            />
          )}
          <ChatInput
            {...props}
            onSend={onSend}
            onRetry={onRetry}
            customCssClasses={cssClasses.inputCssClasses}
          />
        </div>
        {footer && (
          <Markdown
            content={footer}
            linkClickEvent="WEBSITE"
            linkTarget={linkTarget}
            onLinkClick={onLinkClick}
            customCssClasses={footerCssClasses}
          />
        )}
      </div>
    </div>
  );
}

const BASE_STATE_LOCAL_STORAGE_KEY = "yext_chat_panel_state";

export function getStateLocalStorageKey(
  hostname: string,
  conversationId: string
): string {
  return `${BASE_STATE_LOCAL_STORAGE_KEY}__${hostname}__${conversationId}`;
}

/**
 * Maintains the panel state of the session.
 */
export interface PanelState {
  /** The scroll position of the panel. */
  scrollPosition?: number;
}

/**
 * Loads the {@link PanelState} from local storage.
 */
export const loadSessionState = (
  conversationId: string,
  lastTimestamp?: string
): PanelState => {
  const hostname = window?.location?.hostname;
  if (!localStorage || !hostname) {
    return {};
  }
  const savedState = localStorage.getItem(
    getStateLocalStorageKey(hostname, conversationId)
  );

  if (savedState) {
    try {
      const parsedState: PanelState = JSON.parse(savedState);
      const currentDate = new Date();
      const lastDate = new Date(lastTimestamp || 0);
      const diff = currentDate.getTime() - lastDate.getTime();
      // If the last message was sent within the last day, we consider the session to be active
      if (diff < 24 * 60 * 60 * 1000) {
        return parsedState;
      }
      localStorage.removeItem(
        getStateLocalStorageKey(hostname, conversationId)
      );
    } catch (e) {
      console.warn("Unabled to load saved panel state: error parsing state.");
      localStorage.removeItem(
        getStateLocalStorageKey(hostname, conversationId)
      );
    }
  }

  return {};
};

export const saveSessionState = (conversationId: string, state: PanelState) => {
  const hostname = window?.location?.hostname;
  if (!localStorage || !hostname) {
    return;
  }
  const previousState = localStorage.getItem(
    getStateLocalStorageKey(hostname, conversationId)
  );

  if (previousState) {
    try {
      state = { ...JSON.parse(previousState), ...state };
    } catch (e) {
      console.warn("Unabled to load saved panel state: error parsing state.");
    }
  }
  localStorage.setItem(
    getStateLocalStorageKey(hostname, conversationId),
    JSON.stringify(state)
  );
};
