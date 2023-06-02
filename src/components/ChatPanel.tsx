import { useEffect, useRef } from "react";
import { useChatState, useChatActions } from "@yext/chat-headless-react";
import {
  MessageBubble,
  MessageBubbleCssClasses,
  MessageBubbleProps,
} from "./MessageBubble";
import { ChatInput, ChatInputCssClasses, ChatInputProps } from "./ChatInput";
import { LoadingDots } from "./LoadingDots";
import { useComposedCssClasses } from "../hooks";
import { defaultHandleApiError } from "../utils/defaultHandleError";

/**
 * The CSS class interface for the {@link ChatPanel} component.
 *
 * @public
 */
export interface ChatPanelCssClasses {
  container?: string;
  messagesContainer?: string;
  inputContainer?: string;
  inputCssClasses?: ChatInputCssClasses;
  messageBubbleCssClasses?: MessageBubbleCssClasses;
}

const builtInCssClasses: ChatPanelCssClasses = {
  container:
    "h-full w-full flex flex-col relative rounded-3xl shadow-2xl bg-white",
  messagesContainer:
    "flex flex-col gap-y-1 mt-auto px-4 pb-[85px] overflow-auto",
  inputContainer: "w-full absolute bottom-0 p-4 rounded-b-3xl backdrop-blur-lg",
};

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

  // Fetch the first message on load, if there are no existing messages or a request being processed
  useEffect(() => {
    if (messages.length !== 0 || !canSendMessage) {
      return;
    }
    const { stream = true, handleError } = props;
    const res = stream ? chat.streamNextMessage() : chat.getNextMessage();
    res.catch((e) => (handleError ? handleError(e) : defaultHandleApiError(e)));
  }, [chat, props, messages, canSendMessage]);

  const bottomDivRef = useRef<HTMLDivElement>(null);

  // Scroll to the bottom of the chat when the messages change
  useEffect(() => {
    bottomDivRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  return (
    <div className={cssClasses.container}>
      {header}
      <div className={cssClasses.messagesContainer}>
        {messages.map((message, index) => (
          <MessageBubble
            {...props}
            customCssClasses={cssClasses.messageBubbleCssClasses}
            key={index}
            message={message}
          />
        ))}
        {loading && <LoadingDots />}
        <div ref={bottomDivRef} />
      </div>
      <div className={cssClasses.inputContainer}>
        <ChatInput {...props} customCssClasses={cssClasses.inputCssClasses} />
      </div>
    </div>
  );
}
