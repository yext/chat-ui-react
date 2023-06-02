import { useChatActions } from "@yext/chat-headless-react";
import { HiArrowPath } from "react-icons/hi2";
import { useComposedCssClasses } from "../hooks/useComposedCssClasses";
import { useCallback, useRef, useState } from "react";
import { twMerge } from "tailwind-merge";

/**
 * The CSS class interface for the {@link ChatHeader} component.
 *
 * @public
 */
export interface ChatHeaderCssClasses {
  header?: string;
  title?: string;
  refreshButton?: string;
}

const builtInCssClasses: Readonly<ChatHeaderCssClasses> = {
  header:
    "w-full px-4 py-3 flex justify-between bg-gradient-to-tr from-blue-600 to-blue-800 border-b border-white/30",
  title: "text-white text-xl font-medium",
  refreshButton: "text-2xl text-white",
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
   * CSS classes for customizing the component styling.
   */
  customCssClasses?: ChatHeaderCssClasses;
}

/**
 * A component that renders the header of a chat bot panel,
 * including the title and a button to reset the conversation.
 *
 * @public
 *
 * @param props - {@link ChatHeaderProps}
 */
export function ChatHeader({
  title,
  showRefreshButton,
  customCssClasses,
}: ChatHeaderProps) {
  const chat = useChatActions();

  const cssClasses = useComposedCssClasses(builtInCssClasses, customCssClasses);

  const [isSpinning, setIsSpinning] = useState(false);
  const refreshButtonCssClasses = twMerge(
    cssClasses.refreshButton,
    isSpinning ? "animate-[spin_0.3s_linear_infinite]" : "hover:scale-110"
  );

  const clearTimerRef = useRef<ReturnType<typeof setTimeout>>();
  const onRefresh = useCallback(async () => {
    clearTimeout(clearTimerRef.current);
    setIsSpinning(true);
    clearTimerRef.current = setTimeout(() => {
      setIsSpinning(false);
    }, 1000);
    chat.restartConversation();
  }, [chat]);

  return (
    <div className={cssClasses.header}>
      <h1 className={cssClasses.title}>{title}</h1>
      {showRefreshButton && (
        <button
          aria-label="Restart Conversation"
          onClick={onRefresh}
          className={refreshButtonCssClasses}
        >
          <HiArrowPath />
        </button>
      )}
    </div>
  );
}
