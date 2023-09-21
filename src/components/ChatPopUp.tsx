import React, { useCallback, useEffect, useState } from "react";
import { ChatIcon } from "../icons/Chat";
import { ChatPanel, ChatPanelCssClasses, ChatPanelProps } from "./ChatPanel";
import {
  ChatHeader,
  ChatHeaderCssClasses,
  ChatHeaderProps,
} from "./ChatHeader";
import { twMerge } from "tailwind-merge";
import { useComposedCssClasses } from "../hooks";
import { withStylelessCssClasses } from "../utils/withStylelessCssClasses";
import { useReportAnalyticsEvent } from "../hooks/useReportAnalyticsEvent";

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
  button__display?: string;
  button__hidden?: string;
  buttonIcon?: string;
  headerCssClasses?: ChatHeaderCssClasses;
  panelCssClasses?: ChatPanelCssClasses;
}

const fixedPosition = "fixed bottom-6 right-4 lg:bottom-14 lg:right-10 z-50 ";
const builtInCssClasses: ChatPopUpCssClasses = withStylelessCssClasses(
  "PopUp",
  {
    container: "transition-all",
    panel:
      fixedPosition +
      "w-80 max-[480px]:right-0 max-[480px]:bottom-0 max-[480px]:w-full max-[480px]:h-full lg:w-96 h-[75vh]",
    panel__display: "duration-300 translate-y-0",
    panel__hidden: "duration-300 translate-y-[20%] opacity-0 invisible",
    button:
      fixedPosition +
      "p-2 w-12 h-12 lg:w-16 lg:h-16 flex justify-center items-center text-white shadow-xl rounded-full bg-gradient-to-br from-blue-600 to-blue-700 hover:-translate-y-2 duration-150",
    button__display: "duration-300 transform translate-y-0",
    button__hidden:
      "duration-300 transform translate-y-[20%] opacity-0 invisible",
    buttonIcon: "text-blue-600 w-[28px] h-[28px] lg:w-[40px] lg:h-[40px]",
    headerCssClasses: {
      container: "max-[480px]:rounded-none rounded-t-3xl",
    },
    panelCssClasses: {
      container: "max-[480px]:rounded-none rounded-3xl",
      inputContainer: "max-[480px]:rounded-none rounded-b-3xl",
      messagesScrollContainer: "rounded-b-3xl",
    },
  }
);

/**
 * The props for the {@link ChatPopUp} component.
 *
 * @public
 */
export interface ChatPopUpProps
  extends Omit<ChatHeaderProps, "showCloseButton" | "customCssClasses">,
    Omit<ChatPanelProps, "header" | "customCssClasses"> {
  /** Custom icon for the popup button to open the panel. */
  openPanelButtonIcon?: JSX.Element;
  /**
   * CSS classes for customizing the component styling.
   */
  customCssClasses?: ChatPopUpCssClasses;
  /**
   * A footer component to render at the bottom of the panel
   */
  footer?: React.ReactNode;
  customHeader?: React.ReactNode;
}

/**
 * A component that renders a popup button that displays and hides
 * a panel for chat bot interactions.
 *
 * @public
 *
 * @param props - {@link ChatPanelProps}
 */
export function ChatPopUp(props: ChatPopUpProps) {
  const {
    openPanelButtonIcon,
    customCssClasses,
    showRestartButton = true,
    onClose: customOnClose,
    title,
    footer,
    customHeader,
  } = props;
  const reportAnalyticsEvent = useReportAnalyticsEvent();

  useEffect(() => {
    reportAnalyticsEvent({
      action: "CHAT_IMPRESSION",
    });
  }, [reportAnalyticsEvent]);

  const [showChat, setShowChat] = useState(false);
  const onClick = useCallback(() => {
    setShowChat(!showChat);
  }, [showChat]);

  const onClose = useCallback(() => {
    setShowChat(false);
    customOnClose?.();
  }, [customOnClose]);

  const cssClasses = useComposedCssClasses(builtInCssClasses, customCssClasses);
  const panelCssClasses = twMerge(
    cssClasses.panel,
    showChat ? cssClasses.panel__display : cssClasses.panel__hidden
  );
  const buttonCssClasses = twMerge(
    cssClasses.button,
    showChat ? cssClasses.button__hidden : cssClasses.button__display
  );

  return (
    <div className="yext-chat w-full h-full">
      <div className={cssClasses.container}>
        <div className={panelCssClasses} aria-label="Chat Popup Panel">
          <ChatPanel
            {...props}
            customCssClasses={cssClasses.panelCssClasses}
            header={
              customHeader ? (
                customHeader
              ) : (
                <ChatHeader
                  title={title}
                  showRestartButton={showRestartButton}
                  showCloseButton={true}
                  onClose={onClose}
                  customCssClasses={cssClasses.headerCssClasses}
                />
              )
            }
            footer={footer}
          />
        </div>
        <button
          aria-label="Chat Popup Button"
          onClick={onClick}
          className={buttonCssClasses}
        >
          {openPanelButtonIcon ?? (
            <ChatIcon className={cssClasses.buttonIcon} />
          )}
        </button>
      </div>
    </div>
  );
}
