import { useChatActions } from "@yext/chat-headless-react";
import { ArrowPathIcon } from "@heroicons/react/24/outline";
import { useComposedCssClasses } from "../hooks/useComposedCssClasses";
import { useState } from 'react';
import { is } from "immer/dist/internal";


/**
 * The CSS class interface for the {@link ChatHeader}.
 *
 * @public
 */
export interface ChatHeaderCssClasses {
  header?: string,
  title?: string,
  arrowPathIcon?: string,
}

export interface ChatHeaderProps {
  title: string,
  showRefreshButton?: boolean,
  className?: string,
  customCssClasses?: ChatHeaderCssClasses,
}

const builtInCssClasses: Readonly<ChatHeaderCssClasses> = {
  header: "absolute top-0 bg-gradient-to-tr from-blue-600 to-blue-800 w-full px-4 py-3 @lg:px-5 @lg:py-4 flex flex-row z-20 border-b border-white/30 justify-between",
  title: "text-white text-xl font-medium",
  arrowPathIcon: "text-base text-white h-5 w-5",
};

export function ChatHeader({
  title,
  showRefreshButton,
  customCssClasses }: ChatHeaderProps) {
  const chat = useChatActions();

  const cssClasses = useComposedCssClasses(builtInCssClasses, customCssClasses);

  const [isSpinning, setIsSpinning] = useState(false);

  const handleClick = () => {
    setIsSpinning(true);
    setTimeout(() => {
      setIsSpinning(false);
    }, 500); // Stop spinning after .5 seconds
  };

  return (
    <div className={cssClasses.header}>
      <h1 className={cssClasses.title}>
        {title}
      </h1>
      {showRefreshButton &&
      <button 
        id="refresh-button"
        onClick={() => {
          handleClick()
          chat.restartConversation()
          chat.getNextMessage()
        }}
        className={isSpinning ? "animate-spin" : ""}
      >
        <ArrowPathIcon className={cssClasses.arrowPathIcon} />
      </button>
      }
    </div>
  )
}