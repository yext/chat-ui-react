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
import {
  InitialMessagePopUp,
  InitialMessagePopUpCssClasses,
} from "./InitialMessagePopUp";
import { useChatState } from "@yext/chat-headless-react";
import { useFetchInitialMessage } from "../hooks/useFetchInitialMessage";

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
  buttonIcon?: string;
  ctaLabelContainer?: string;
  ctaLabel?: string;
  notification?: string;
  closedPopupContainer?: string;
  closedPopupContainer__display?: string;
  closedPopupContainer__hidden?: string;
  headerCssClasses?: ChatHeaderCssClasses;
  panelCssClasses?: ChatPanelCssClasses;
  initialMessagePopUpCssClasses?: InitialMessagePopUpCssClasses;
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
    closedPopupContainer:
      fixedPosition +
      "flex gap-x-2.5 items-center hover:-translate-y-2 duration-150",
    closedPopupContainer__display: "duration-300 transform translate-y-0",
    closedPopupContainer__hidden:
      "duration-300 transform translate-y-[20%] opacity-0 invisible",
    button:
      "p-2 w-12 h-12 lg:w-16 lg:h-16 flex justify-center items-center text-white shadow-xl rounded-full bg-gradient-to-br from-blue-600 to-blue-700",
    buttonIcon: "text-blue-600 w-[28px] h-[28px] lg:w-[40px] lg:h-[40px]",
    ctaLabelContainer: "max-w-60 -mr-8 line-clamp-1",
    ctaLabel:
      "p-3 pr-8 flex items-center whitespace-nowrap animate-expand-left font-bold rounded-l-full bg-white text-blue-700 h-10 lg:h-14 text-sm lg:text-base",
    notification:
      "fixed animate-fade-in bg-red-700 -right-1 top-0 rounded-full w-5 lg:w-6 h-5 lg:h-6 items-center flex justify-center text-sm lg:text-base text-white",
    headerCssClasses: {
      container: "max-[480px]:rounded-none rounded-t-3xl",
    },
    panelCssClasses: {
      container: "max-[480px]:rounded-none rounded-3xl",
      inputContainer: "max-[480px]:rounded-none rounded-b-3xl",
    },
  }
);
const popupLocalStorageKey = "YEXT_CHAT_OPEN_ON_LOAD";

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
  /** CSS classes for customizing the component styling. */
  customCssClasses?: ChatPopUpCssClasses;
  /** Whether to show the panel on load. Defaults to false. */
  openOnLoad?: boolean;
  /**
   * Whether to show the initial message popup when the panel is hidden on load.
   * Defaults to false.
   */
  showInitialMessagePopUp?: boolean;
  /**
   * Whether to show a heartbeat animation on the popup button when the panel is hidden.
   * Defaults to false.
   */
  showHeartBeatAnimation?: boolean;
  /**
   * Whether to show notification showing number of unread messages.
   * Defaults to false.
   */
  showUnreadNotification?: boolean;
  /**
   * The "Call to Action" label to be displayed next to the popup button.
   * By default, the CTA is not shown.
   * This prop will override the "showInitialMessagePopUp" prop, if specified.
   */
  ctaLabel?: string;
  /**
   * A controlled prop to open or close the panel. If provided, the prop
   * will override the openOnLoad prop and the panel will be controlled
   * by the parent component.
   */
  isOpen?: boolean;
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
    handleError,
    openOnLoad = false,
    showInitialMessagePopUp = false,
    showHeartBeatAnimation = false,
    showUnreadNotification = false,
    ctaLabel,
    title,
    footer,
    isOpen,
  } = props;

  const reportAnalyticsEvent = useReportAnalyticsEvent();
  useEffect(() => {
    reportAnalyticsEvent({
      action: "CHAT_IMPRESSION",
    });
  }, [reportAnalyticsEvent]);

  const messages = useChatState((s) => s.conversation.messages);
  const [numReadMessages, setNumReadMessagesLength] = useState<number>(0);
  const [numUnreadMessages, setNumUnreadMessagesLength] = useState<number>(0);

  // Set the initial value of the local storage flag for opening on load only if it doesn't already exist
  if (window.localStorage.getItem(popupLocalStorageKey) === null) {
    window.localStorage.setItem(
      popupLocalStorageKey,
      openOnLoad ? "true" : "false"
    );
  }
  const openOnLoadLocalStorage =
    window.localStorage.getItem(popupLocalStorageKey);

  /* Open panel on load if: 
  - openOnLoad prop is true or there are messages in state (from browser storage), and local storage flag is true */
  const isOpenOnLoad =
    (messages.length > 1 && openOnLoadLocalStorage === "true") || openOnLoad;

  const {
    renderChat,
    showChat,
    showInitialMessage,
    toggleChat,
    closeChat,
    closeInitialMessage,
  } = usePanelState(isOpen, isOpenOnLoad, !ctaLabel && showInitialMessagePopUp);

  // only fetch initial message when ChatPanel is closed on load (otherwise, it will be fetched in ChatPanel)
  useFetchInitialMessage(
    showInitialMessagePopUp ? console.error : handleError,
    false,
    (showUnreadNotification || showInitialMessagePopUp) &&
      !renderChat &&
      !isOpenOnLoad
  );

  const onClick = useCallback(() => {
    toggleChat();
    window.localStorage.setItem(popupLocalStorageKey, "true");
  }, [toggleChat]);

  const onClose = useCallback(() => {
    closeChat();
    customOnClose?.();
    // consider all the messages are read while the panel was open
    setNumReadMessagesLength(messages.length);
    window.localStorage.setItem(popupLocalStorageKey, "false");
  }, [closeChat, customOnClose, messages.length]);

  useEffect(() => {
    // update number of unread messages if there are new messages added while the panel is closed
    setNumUnreadMessagesLength(messages.length - numReadMessages);
  }, [messages.length, numReadMessages]);

  const cssClasses = useComposedCssClasses(builtInCssClasses, customCssClasses);
  const panelCssClasses = twMerge(
    cssClasses.panel,
    showChat ? cssClasses.panel__display : cssClasses.panel__hidden
  );
  const closedPopupContainerCssClasses = twMerge(
    cssClasses.closedPopupContainer,
    showChat
      ? cssClasses.closedPopupContainer__hidden
      : cssClasses.closedPopupContainer__display
  );

  return (
    <div className="yext-chat w-full h-full">
      <div className={cssClasses.container}>
        <div className={panelCssClasses} aria-label="Chat Popup Panel">
          {renderChat && (
            <ChatPanel
              {...props}
              customCssClasses={cssClasses.panelCssClasses}
              header={
                <ChatHeader
                  title={title}
                  showRestartButton={showRestartButton}
                  showCloseButton={true}
                  onClose={onClose}
                  customCssClasses={cssClasses.headerCssClasses}
                />
              }
              footer={footer}
            />
          )}
        </div>
        <div
          className={closedPopupContainerCssClasses}
          aria-label="Chat Closed Popup Container"
        >
          {showInitialMessage && (
            <InitialMessagePopUp
              onClose={closeInitialMessage}
              customCssClasses={cssClasses.initialMessagePopUpCssClasses}
            />
          )}
          {ctaLabel && (
            // the div container is needed to islate the expand CSS animation
            <div className={cssClasses.ctaLabelContainer}>
              <button
                onClick={onClick}
                aria-label="CTA Label"
                className={cssClasses.ctaLabel}
              >
                {ctaLabel}
              </button>
            </div>
          )}
          <button
            aria-label="Chat Popup Button"
            onClick={onClick}
            className={
              cssClasses.button +
              (showHeartBeatAnimation && !!numUnreadMessages
                ? " animate-heartbeat"
                : "")
            }
          >
            {openPanelButtonIcon ?? (
              <ChatIcon className={cssClasses.buttonIcon} />
            )}
            {showUnreadNotification && !!numUnreadMessages && (
              <div
                aria-label="Unread Messages Notification"
                className={cssClasses.notification}
              >
                {numUnreadMessages}
              </div>
            )}
          </button>
        </div>
      </div>
    </div>
  );
}

function usePanelState(
  isOpen: boolean | undefined,
  isOpenOnLoad: boolean | undefined,
  initialMessageVisible: boolean | undefined
) {
  // control CSS behavior (fade-in/out animation) on open/close state of the panel.
  const [showChat, setShowChat] = useState(false);
  // control the actual DOM rendering of the panel. Start rendering on first open state
  // to avoid message requests immediately on load while the popup is still "hidden"
  const [renderChat, setRenderChat] = useState(false);
  const [showInitialMessage, setshowInitialMessage] = useState(
    initialMessageVisible
  );

  useEffect(() => {
    if (isOpen !== undefined) {
      setShowChat(isOpen);
      setRenderChat(isOpen);
    }
  }, [isOpen]);

  useEffect(() => {
    if (!renderChat && isOpenOnLoad && isOpen === undefined) {
      setShowChat(true);
      setRenderChat(true);
      setshowInitialMessage(false);
    }
  }, [renderChat, isOpen, isOpenOnLoad]);

  const toggleChat = useCallback(() => {
    if (isOpen !== undefined) {
      return;
    }
    setShowChat((prev) => !prev);
    setRenderChat(true);
    setshowInitialMessage(false);
  }, [isOpen]);

  const closeChat = useCallback(() => {
    if (isOpen !== undefined) {
      return;
    }
    setShowChat(false);
  }, [isOpen]);

  const closeInitialMessage = useCallback(() => {
    setshowInitialMessage(false);
  }, []);

  return {
    showChat,
    renderChat,
    showInitialMessage,
    toggleChat,
    closeChat,
    closeInitialMessage,
  };
}
