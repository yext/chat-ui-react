import { useChatActions } from "@yext/chat-headless-react";
import { DualSyncIcon } from "../icons/DualSync";
import { useComposedCssClasses } from "../hooks/useComposedCssClasses";
import React, { useCallback, useRef, useState } from "react";
import { twMerge } from "tailwind-merge";
import { CrossIcon } from "../icons/Cross";
import { withStylelessCssClasses } from "../utils/withStylelessCssClasses";

/**
 * The CSS class interface for the {@link ChatHeader} component.
 *
 * @public
 */
export interface ChatHeaderCssClasses {
  container?: string;
  title?: string;
  restartButton?: string;
  restartButtonIcon?: string;
  closeButton?: string;
  closeButtonIcon?: string;
}

const builtInCssClasses: Readonly<ChatHeaderCssClasses> =
  withStylelessCssClasses("Header", {
    container:
      "w-full pl-4 pr-3 py-3 flex justify-between bg-gradient-to-tr from-blue-600 to-blue-800",
    title: "text-white text-xl font-medium truncate pr-1",
    restartButton: "w-8 h-8 ml-auto shrink-0 flex justify-center items-center",
    restartButtonIcon: "text-white stroke-[0.2] w-[26px] h-[26px]",
    closeButton:
      "w-8 h-8 hover:scale-110 shrink-0 flex justify-center items-center",
    closeButtonIcon: "text-white w-[26px] h-[26px]",
  });

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
   * Displays a restart button which allows the user to restart the conversation.
   * Defaults to false.
   */
  showRestartButton?: boolean;
  /**
   * Displays a close button which will invoke {@link ChatHeaderProps.onClose} on click.
   * Default to false.
   */
  showCloseButton?: boolean;
  /** A function which is called when the close button is clicked.  */
  onClose?: () => void;
  /**  Custom icon for for restart button. */
  restartButtonIcon?: JSX.Element;
  /**  Custom icon for for close button. */
  closeButtonIcon?: JSX.Element;
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
  restartButtonIcon,
  showCloseButton,
  closeButtonIcon,
  onClose,
  customCssClasses,
}: ChatHeaderProps) {
  const chat = useChatActions();

  const cssClasses = useComposedCssClasses(builtInCssClasses, customCssClasses);

  const [isSpinning, setIsSpinning] = useState(false);
  const restartButtonCssClasses = twMerge(
    cssClasses.restartButton,
    isSpinning ? "animate-[spin_0.3s_linear]" : "hover:scale-110"
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
    <div className={cssClasses.container}>
      <h1 className={cssClasses.title}>{title}</h1>
      {showRestartButton && (
        <button
          aria-label="Restart Conversation"
          onClick={onRestart}
          className={restartButtonCssClasses}
        >
          {restartButtonIcon ?? (
            <DualSyncIcon className={cssClasses.restartButtonIcon} />
          )}
        </button>
      )}
      {showCloseButton && (
        <button
          aria-label="Close Chat"
          onClick={onClose}
          className={cssClasses.closeButton}
        >
          {closeButtonIcon ?? (
            <CrossIcon className={cssClasses.closeButtonIcon} />
          )}
        </button>
      )}
    </div>
  );
}
