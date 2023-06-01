import { useChatActions } from "@yext/chat-headless-react";
import { HiArrowPath } from "react-icons/hi2";
import { useComposedCssClasses } from "../hooks/useComposedCssClasses";
import { useCallback, useState } from "react";

/**
 * The CSS class interface for the {@link ChatHeader}.
 *
 * @public
 */
export interface ChatHeaderCssClasses {
  header?: string;
  title?: string;
  refreshButtonIcon?: string;
}

const builtInCssClasses: Readonly<ChatHeaderCssClasses> = {
  header:
    "bg-gradient-to-tr from-blue-600 to-blue-800 w-full px-4 py-3 @lg:px-5 @lg:py-4 flex flex-row z-20 border-b border-white/30 justify-between",
  title: "text-white text-xl font-medium",
  refreshButtonIcon: "text-2xl text-white h-5 w-5",
};

/**
 * The props for the {@link ChatHeader} component.
 *
 * @public
 */
export interface ChatHeaderProps {
  /**
   * The headers's title text, essentially how the chat window identifies itself to the user.
   */
  title: string;
  /**
   * Enable a refresh button allowing the user to restart the conversation.
   * Defaults to false.
   */
  showRefreshButton?: boolean;
  /**
   * A function which is called when an error occurs from
   * Chat API while getting the next message.
   * By default, the error is logged to the console.
   */
  handleError?: (e: unknown) => void;
  /**
   * CSS classes for customizing the component styling.
   */
  customCssClasses?: ChatHeaderCssClasses;
}

export function ChatHeader({
  title,
  showRefreshButton,
  customCssClasses,
  handleError,
}: ChatHeaderProps) {
  const chat = useChatActions();

  const cssClasses = useComposedCssClasses(builtInCssClasses, customCssClasses);

  const [isSpinning, setIsSpinning] = useState(false);

  const onRefresh = useCallback(async () => {
    const defaultHandleError = (e: unknown) => {
      console.error(e);
    };

    setIsSpinning(true);
    chat.restartConversation();
    chat
      .getNextMessage()
      .catch((e) => (handleError ? handleError(e) : defaultHandleError(e)))
      .finally(() => setIsSpinning(false));
  }, [chat, handleError]);

  return (
    <div className={cssClasses.header}>
      <h1 className={cssClasses.title}>{title}</h1>
      {showRefreshButton && (
        <button
          aria-label="Restart Conversation"
          onClick={onRefresh}
          className={
            (cssClasses.refreshButtonIcon ? cssClasses.refreshButtonIcon : "") +
            (isSpinning ? " animate-spin" : " hover:scale-110")
          }
        >
          <HiArrowPath />
        </button>
      )}
    </div>
  );
}
