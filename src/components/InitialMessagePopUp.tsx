import React, { useMemo } from "react";
import { CrossIcon } from "../icons/Cross";
import { useComposedCssClasses } from "../hooks";
import { withStylelessCssClasses } from "../utils/withStylelessCssClasses";
import { MessageSource, useChatState } from "@yext/chat-headless-react";
import { useFetchInitialMessage } from "../hooks/useFetchInitialMessage";

/**
 * The CSS class interface for the {@link InitialMessagePopUp} component.
 *
 * @public
 */
export interface InitialMessagePopUpCssClasses {
  container?: string;
  closeButton?: string;
  closeButtonIcon?: string;
  message?: string;
}

/**
 * The props for the {@link InitialMessagePopUp} component.
 *
 * @internal
 */
interface InitialMessagePopUpProps {
  /** CSS classes for customizing the component styling. */
  customCssClasses?: InitialMessagePopUpCssClasses;
  /** Function to call when user click on the close button */
  onClose: () => void;
}

const builtInCssClasses: InitialMessagePopUpCssClasses =
  withStylelessCssClasses("InitialMessagePopUp", {
    container: "flex gap-x-1 animate-fade-in",
    closeButton: "bg-white w-4 h-4 rounded-full border border-slate-300",
    closeButtonIcon: "",
    message:
      "line-clamp-2 w-60 h-12 lg:h-16 p-2.5 bg-white rounded-xl shadow-xl text-sm",
  });

/**
 * A component that renders a popup bubble displaying the initial message from chat bot.
 *
 * @internal
 *
 * @param props - {@link InitialMessagePopUpProps}
 */
export function InitialMessagePopUp({
  onClose,
  customCssClasses,
}: InitialMessagePopUpProps) {
  const messages = useChatState((s) => s.conversation.messages);
  const cssClasses = useComposedCssClasses(builtInCssClasses, customCssClasses);

  useFetchInitialMessage((e: unknown) => console.error(e));
  const firstBotMessage: string = useMemo(() => {
    return messages.length !== 0 && messages[0].source === MessageSource.BOT
      ? messages[0].text
      : "";
  }, [messages]);

  if (firstBotMessage.length === 0) {
    return <></>;
  }

  return (
    <div className={cssClasses.container}>
      <button
        aria-label="Close Initial Message"
        onClick={onClose}
        className={cssClasses.closeButton}
      >
        <CrossIcon className={cssClasses.closeButtonIcon} />
      </button>
      <div className={cssClasses.message}>{firstBotMessage}</div>
    </div>
  );
}
