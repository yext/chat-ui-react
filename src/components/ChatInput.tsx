import { useCallback, useState } from "react";
import { useChatActions, useChatState } from "@yext/chat-headless-react";
import { FaArrowUp } from "react-icons/fa";
import { useComposedCssClasses } from "../hooks";
import { clsx } from "clsx";
import Textarea from "react-expanding-textarea";
/**
 * The CSS class interface for the {@link ChatInput} component.
 *
 * @public
 */
export interface ChatInputCssClasses {
  container?: string;
  textArea?: string;
  sendButton?: string;
}

const builtInCssClass: ChatInputCssClasses = {
  container: "w-full h-fit max-w-5xl px-4 flex flex-row relative",
  textArea:
    "w-full p-4 pr-10 border border-slate-300 disabled:bg-slate-50 rounded-3xl resize-none",
  sendButton:
    "rounded-full p-1.5 text-white bg-blue-600 disabled:bg-slate-100 hover:bg-blue-800 active:scale-90 transition-all absolute right-7 bottom-4",
};

/**
 * The props for the {@link ChatInput} component.
 *
 * @public
 */
export interface ChatInputProps {
  /**
   * The input's placeholder text when no text has been entered by the user.
   * Defaults to "Type a message...".
   */
  placeholder?: string;
  /**
   * Enable streaming behavior by making a request to Chat Streaming API.
   * Defaults to true.
   */
  stream?: boolean;
  /**
   * A function which is called when an error occurs from
   * Chat API processing user's message.
   */
  handleError?: (e: unknown) => void;
  /** CSS classes for customizing the component styling. */
  customCssClasses?: ChatInputCssClasses;
}

/**
 * A component that allows user to input message and send to Chat APi.
 * @public
 *
 * @param props - {@link ChatInputProps}
 */
export function ChatInput({
  placeholder = "Type a message...",
  stream = true,
  handleError,
  customCssClasses,
}: ChatInputProps) {
  const chat = useChatActions();
  const [input, setInput] = useState("");
  const canSendMessage = useChatState(
    (state) => state.conversation.canSendMessage
  );

  const cssClasses = useComposedCssClasses(builtInCssClass, customCssClasses);
  const sendButtonClassNames = clsx(cssClasses.sendButton, {
    "opacity-0": input.length === 0,
  });

  const sendMessage = useCallback(async () => {
    const res = stream
      ? chat.streamNextMessage(input)
      : chat.getNextMessage(input);
    setInput("");

    const defaultHandleError = (e: unknown) => {
      console.error(e);
    };
    res.catch((e) => (handleError ? handleError(e) : defaultHandleError(e)));
  }, [chat, input, handleError, stream]);

  const handleKeyDown = useCallback(
    (e: React.KeyboardEvent<HTMLTextAreaElement>) => {
      if (e.key === "Enter") {
        sendMessage();
      }
    },
    [sendMessage]
  );

  const onInputChange = useCallback(
    (e: React.ChangeEvent<HTMLTextAreaElement>) => {
      setInput(e.target.value);
    },
    []
  );

  return (
    <div className={cssClasses.container}>
      <Textarea
        autoFocus
        disabled={!canSendMessage}
        onKeyDown={handleKeyDown}
        value={input}
        onChange={onInputChange}
        className={cssClasses.textArea}
        placeholder={placeholder}
      />
      <button
        aria-label="Send Message"
        disabled={!canSendMessage}
        onClick={sendMessage}
        className={sendButtonClassNames}
      >
        <FaArrowUp />
      </button>
    </div>
  );
}
