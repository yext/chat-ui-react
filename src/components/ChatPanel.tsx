import React, { useEffect } from "react";
import { useChatState } from "@yext/chat-headless-react";
import {
  MessageBubble,
  MessageBubbleCssClasses,
  MessageBubbleProps,
} from "./MessageBubble";
import { ChatInput, ChatInputCssClasses, ChatInputProps } from "./ChatInput";
import { LoadingDots } from "./LoadingDots";
import {
  useComposedCssClasses,
  useReportAnalyticsEvent,
  useFetchInitialMessage,
  useScrollToLastMessage,
  } from "../hooks";
import { withStylelessCssClasses } from "../utils/withStylelessCssClasses";

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
  /** A custom header component to render at the top of the panel. */
  header?: JSX.Element;
  /** A custom input component to render at the bottom of the panel. */
  input?: JSX.Element;
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
  const { header, input, customCssClasses, stream, handleError } = props;
  const messages = useChatState((state) => state.conversation.messages);
  const loading = useChatState((state) => state.conversation.isLoading);
  const cssClasses = useComposedCssClasses(builtInCssClasses, customCssClasses);
  const reportAnalyticsEvent = useReportAnalyticsEvent();
  useFetchInitialMessage(handleError, stream);
  const [messagesContainerRef, setMessageRef] = useScrollToLastMessage();

  useEffect(() => {
    reportAnalyticsEvent({
      action: "CHAT_IMPRESSION",
    });
  }, [reportAnalyticsEvent]);

  return (
    <div className="yext-chat w-full h-full">
      <div className={cssClasses.container}>
        {header}
        <div className={cssClasses.messagesScrollContainer}>
          <div ref={messagesContainerRef} className={cssClasses.messagesContainer}>
            {messages.map((message, index) => (
              <div key={index} ref={setMessageRef(index)}>
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
          {input ?? <ChatInput {...props} customCssClasses={cssClasses.inputCssClasses} />}
        </div>
      </div>
    </div>
  );
}
