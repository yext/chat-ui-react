import React, { useCallback, useState } from "react";
import { useChatActions, useChatState } from "@yext/chat-headless-react";
import { ArrowIcon } from "../icons/Arrow";
import { useComposedCssClasses } from "../hooks";
import TextareaAutosize from "react-textarea-autosize";
import { useDefaultHandleApiError } from "../hooks/useDefaultHandleApiError";
import { withStylelessCssClasses } from "../utils/withStylelessCssClasses";

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

const builtInCssClasses: ChatInputCssClasses = withStylelessCssClasses(
  "Input",
  {
    container: "w-full h-fit flex flex-row relative @container",
    textArea:
      "w-full p-4 pr-12 border border-slate-300 rounded-3xl resize-none text-[13px] @[480px]:text-base placeholder:text-[13px] placeholder:@[480px]:text-base text-slate-900",
    sendButton:
      "rounded-full p-1.5 w-8 h-8 stroke-2 text-white bg-blue-600 disabled:bg-slate-200 hover:bg-blue-800 active:scale-90 transition-all absolute right-4 bottom-2.5 @[480px]:bottom-3.5",
  }
);

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
   * This feature is experimental, and is subject to change.
   * Defaults to false.
   */
  stream?: boolean;
  /** Enable auto focus for the input box. Defaults to false. */
  inputAutoFocus?: boolean;
  /**
   * A function which is called when an error occurs from Chat API while processing the user's message.
   * By default, the error is logged to the console and an error message is added to state.
   */
  handleError?: (e: unknown) => void;
  /** Custom icon for the send button. */
  sendButtonIcon?: JSX.Element;
  /** CSS classes for customizing the component styling. */
  customCssClasses?: ChatInputCssClasses;
}

/**
 * A component that allows user to input message and send to Chat API.
 *
 * @remarks
 * Pressing "Enter" key will send the current message.
 * To add a newline, press "Shift" and "Enter".
 *
 * @public
 *
 * @param props - {@link ChatInputProps}
 */
export function ChatInput({
  placeholder = "Type a message...",
  stream = false,
  inputAutoFocus = false,
  handleError,
  sendButtonIcon = <ArrowIcon />,
  customCssClasses,
}: ChatInputProps) {
  const chat = useChatActions();
  const [input, setInput] = useState("");
  const canSendMessage = useChatState(
    (state) => state.conversation.canSendMessage
  );
  const defaultHandleApiError = useDefaultHandleApiError();

  const cssClasses = useComposedCssClasses(builtInCssClasses, customCssClasses);

  const sendMessage = useCallback(async () => {
    const res = stream
      ? chat.streamNextMessage(input)
      : chat.getNextMessage(input);
    setInput("");
    res.catch((e) => (handleError ? handleError(e) : defaultHandleApiError(e)));
  }, [chat, input, handleError, defaultHandleApiError, stream]);

  const handleKeyDown = useCallback(
    (e: React.KeyboardEvent<HTMLTextAreaElement>) => {
      if (!e.shiftKey && e.key === "Enter") {
        e.preventDefault();
        if (canSendMessage && input.trim().length !== 0) {
          sendMessage();
        }
      }
    },
    [sendMessage, canSendMessage, input]
  );

  const onInputChange = useCallback(
    (e: React.ChangeEvent<HTMLTextAreaElement>) => {
      setInput(e.target.value);
    },
    []
  );

  return (
    <div className={cssClasses.container}>
      <TextareaAutosize
        autoFocus={inputAutoFocus}
        onKeyDown={handleKeyDown}
        value={input}
        onChange={onInputChange}
        className={cssClasses.textArea}
        placeholder={placeholder}
      />
      <button
        aria-label="Send Message"
        disabled={!canSendMessage || input.trim().length === 0}
        onClick={sendMessage}
        className={cssClasses.sendButton}
      >
        {sendButtonIcon}
      </button>
    </div>
  );
}
