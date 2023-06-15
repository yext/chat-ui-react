import { useCallback, useState } from "react";
import { useChatActions, useChatState } from "@yext/chat-headless-react";
import { ArrowIcon } from "../icons/Arrow";
import { useComposedCssClasses } from "../hooks";
import Textarea from "react-expanding-textarea";
import { twMerge } from "tailwind-merge";
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
      "w-full p-4 pr-10 border border-slate-300 disabled:bg-slate-50 rounded-3xl resize-none text-[13px] @[480px]:text-base",
    sendButton:
      "rounded-full p-1.5 w-8 h-8 stroke-2 text-white bg-blue-600 disabled:bg-slate-100 hover:bg-blue-800 active:scale-90 transition-all absolute right-7 bottom-2.5 @[480px]:bottom-3.5",
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
   * Defaults to true.
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
 * @public
 *
 * @param props - {@link ChatInputProps}
 */
export function ChatInput({
  placeholder = "Type a message...",
  stream = true,
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
  const sendButtonClassNames = twMerge(
    cssClasses.sendButton,
    input.length === 0 && "opacity-0 invisible"
  );

  const sendMessage = useCallback(async () => {
    const res = stream
      ? chat.streamNextMessage(input)
      : chat.getNextMessage(input);
    setInput("");
    res.catch((e) => (handleError ? handleError(e) : defaultHandleApiError(e)));
  }, [chat, input, handleError, defaultHandleApiError, stream]);

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
        autoFocus={inputAutoFocus}
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
        {sendButtonIcon}
      </button>
    </div>
  );
}
