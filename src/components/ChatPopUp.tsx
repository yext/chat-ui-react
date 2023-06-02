import { useCallback, useState } from "react";
import { IoCaretDownOutline, IoChatbubblesSharp } from "react-icons/io5";
import { ChatPanel } from "./ChatPanel";
import { ChatHeader } from "./ChatHeader";
import { twMerge } from "tailwind-merge";
import { useComposedCssClasses } from "../hooks";

/**
 * The CSS class interface for the {@link ChatPopUp} component.
 *
 * @public
 */
export interface ChatPopUpCssClasses {
  container?: string;
  panel?: string;
  panel__display?: string;
  panel__hidden?: string;
  button?: string;
}

const builtInCssClasses: ChatPopUpCssClasses = {
  container:
    "fixed bottom-6 right-4 lg:bottom-14 lg:right-10 flex flex-col gap-y-4 items-end",
  panel: "w-80 lg:w-96 h-[75vh]",
  panel__display: "transition-all duration-300",
  panel__hidden: "transition-all duration-300 opacity-0 invisible",
  button:
    "w-12 h-12 lg:w-16 lg:h-16 flex justify-center items-center text-xl text-white shadow-xl rounded-full bg-gradient-to-br from-blue-600 to-blue-700 hover:-translate-y-2 duration-150",
};

/**
 * The props for the {@link ChatPopUp} component.
 *
 * @public
 */
export interface ChatPopUpProps {
  /**
   * The panel to display and hide when click on the pop up button.
   * By default, the panel will be a {@link ChatPanel} component with {@link ChatHeader}.
   */
  panel?: JSX.Element;
  /**
   * CSS classes for customizing the component styling.
   */
  customCssClasses?: ChatPopUpCssClasses;
}

/**
 * A component that renders a popup button that displays and hides
 * a panel for chat bot interactions.
 * 
 * @public
 *
 * @param props - {@link ChatPanelProps}
 */
export function ChatPopUp({ panel, customCssClasses }: ChatPopUpProps) {
  const [showChat, setShowChat] = useState(false);
  const onClick = useCallback(() => {
    setShowChat(!showChat);
  }, [showChat]);
  const cssClasses = useComposedCssClasses(builtInCssClasses, customCssClasses);
  const panelCssClasses = twMerge(
    cssClasses.panel,
    showChat ? cssClasses.panel__display : cssClasses.panel__hidden
  );

  return (
    <div className={cssClasses.container}>
      <div className={panelCssClasses} aria-label="Popup Panel">
        {panel ?? (
          <ChatPanel
            header={<ChatHeader title="Chat" showRefreshButton={true} />}
          />
        )}
      </div>
      <button
        aria-label="Chat Popup Button"
        onClick={onClick}
        className={cssClasses.button}
      >
        {showChat ? <IoCaretDownOutline /> : <IoChatbubblesSharp />}
      </button>
    </div>
  );
}
