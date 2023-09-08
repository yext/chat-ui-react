import { useEffect, useRef } from "react";
import { useChatState, useChatActions } from "@yext/chat-headless-react";
import {
  MessageBubble,
  MessageBubbleCssClasses,
  MessageBubbleProps,
} from "./MessageBubble";
import { ChatInputCssClasses, ChatInputProps } from "./ChatInput";
import { LoadingDots } from "./LoadingDots";
import { useComposedCssClasses } from "../hooks";
import { useDefaultHandleApiError } from "../hooks/useDefaultHandleApiError";
import { withStylelessCssClasses } from "../utils/withStylelessCssClasses";
import { useReportAnalyticsEvent } from "../hooks/useReportAnalyticsEvent";

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
  header?: JSX.Element;
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
  const { header, customCssClasses } = props;
  const chat = useChatActions();
  const messages = useChatState((state) => state.conversation.messages);
  const loading = useChatState((state) => state.conversation.isLoading);
  const canSendMessage = useChatState(
    (state) => state.conversation.canSendMessage
  );
  const cssClasses = useComposedCssClasses(builtInCssClasses, customCssClasses);
  const defaultHandleApiError = useDefaultHandleApiError();
  const reportAnalyticsEvent = useReportAnalyticsEvent();

  console.log('ChatPanel!')

  useEffect(() => {
    reportAnalyticsEvent({
      action: "CHAT_IMPRESSION",
    });
  }, [reportAnalyticsEvent]);

  // Fetch the first message on load, if there are no existing messages or a request being processed
  useEffect(() => {
    if (messages.length !== 0 || !canSendMessage) {
      return;
    }
    const { stream = false, handleError } = props;
    const res = stream ? chat.streamNextMessage() : chat.getNextMessage();
    res.catch((e) => (handleError ? handleError(e) : defaultHandleApiError(e)));
  }, [chat, props, messages, defaultHandleApiError, canSendMessage]);

  const messagesRef = useRef<HTMLDivElement>(null);

  // Scroll to the bottom of the chat when the messages change
  useEffect(() => {
    messagesRef.current?.scroll({
      top: messagesRef.current?.scrollHeight,
      behavior: "smooth",
    });
  }, [messages]);

  return (
    <div className="yext-chat">
      <div className={cssClasses.container}>
        {header}
        <div className={cssClasses.messagesScrollContainer}>
          <div ref={messagesRef} className={cssClasses.messagesContainer}>
            {messages.map((message, index) => (
              <MessageBubble
                {...props}
                customCssClasses={cssClasses.messageBubbleCssClasses}
                key={index}
                message={message}
              />
            ))}
            {loading && <LoadingDots />}
          </div>
        </div>
        {/* <div className={cssClasses.inputContainer}>
          <ChatInput {...props} customCssClasses={cssClasses.inputCssClasses} />
        </div> */}
      </div>
    </div>
  );
}
