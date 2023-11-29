import React, { ReactNode, useCallback, useEffect, useRef } from "react";
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
}

const builtInCssClasses: ChatPanelCssClasses = withStylelessCssClasses(
  "Panel",
  {
    container: "h-full w-full flex flex-col relative shadow-2xl bg-white",
    messagesScrollContainer: "flex flex-col mt-auto overflow-hidden",
    messagesContainer: "flex flex-col gap-y-1 px-4 overflow-auto",
    inputContainer: "w-full p-4",
    messageBubbleCssClasses: {
      topContainer: "first:mt-4",
    },
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
  /**
   * CSS classes for customizing the component styling.
   */
  customCssClasses?: ChatPanelCssClasses;
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
  const { header, customCssClasses, stream, handleError } = props;
  const messages = useChatState((state) => state.conversation.messages);
  const loading = useChatState((state) => state.conversation.isLoading);
  const cssClasses = useComposedCssClasses(builtInCssClasses, customCssClasses);
  const reportAnalyticsEvent = useReportAnalyticsEvent();
  useFetchInitialMessage(handleError, stream);

  useEffect(() => {
    reportAnalyticsEvent({
      action: "CHAT_IMPRESSION",
    });
  }, [reportAnalyticsEvent]);

  const messagesRef = useRef<Array<HTMLDivElement | null>>([]);
  const messagesContainer = useRef<HTMLDivElement>(null);

  // Handle scrolling when messages change
  useEffect(() => {
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
  }, [messages]);

  const setMessagesRef = useCallback((index) => {
    if (!messagesRef?.current) return null;
    return (message) => (messagesRef.current[index] = message);
  }, []);

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
                />
              </div>
            ))}
            {loading && <LoadingDots />}
          </div>
        </div>
        <div className={cssClasses.inputContainer}>
          <ChatInput {...props} customCssClasses={cssClasses.inputCssClasses} />
        </div>
      </div>
    </div>
  );
}
