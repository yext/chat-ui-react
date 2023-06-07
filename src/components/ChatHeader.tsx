import { useChatActions } from "@yext/chat-headless-react";
import { DualSyncIcon } from "../icons/DualSync"
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
  restartButton?: string;
}

const builtInCssClasses: Readonly<ChatHeaderCssClasses> = {
  header:
    "w-full px-4 py-3 flex justify-between bg-gradient-to-tr from-blue-600 to-blue-800 rounded-t-3xl",
  title: "text-white text-xl font-medium",
  restartButton: "w-8 text-white stroke-[0.2]",
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
   * Enable a restart button allowing the user to restart the conversation.
   * Defaults to false.
   */
  showRestartButton?: boolean;
  /**  Custom icon for for restart button. */
  restartButtonIcon?: JSX.Element;
  /**  CSS classes for customizing the component styling. */
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
  showRestartButton,
  restartButtonIcon = <DualSyncIcon />,
  customCssClasses,
}: ChatHeaderProps) {
  const chat = useChatActions();

  const cssClasses = useComposedCssClasses(builtInCssClasses, customCssClasses);

  const [isSpinning, setIsSpinning] = useState(false);
  const restartButtonCssClasses = twMerge(
    cssClasses.restartButton,
    isSpinning ? "animate-[spin_0.3s_linear_infinite]" : "hover:scale-110"
  );

  const clearTimerRef = useRef<ReturnType<typeof setTimeout>>();
  const onRestart = useCallback(async () => {
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
      {showRestartButton && (
        <button
          aria-label="Restart Conversation"
          onClick={onRestart}
          className={restartButtonCssClasses}
        >
          {restartButtonIcon}
        </button>
      )}
    </div>
  );
}
