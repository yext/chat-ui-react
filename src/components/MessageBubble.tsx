import { Message, MessageSource } from "@yext/chat-headless-react";
import { useComposedCssClasses } from "../hooks";
import { twMerge } from "tailwind-merge";
import { Markdown } from "./Markdown";
import { withStylelessCssClasses } from "../utils/withStylelessCssClasses";

/**
 * The CSS class interface for the {@link MessageBubble} component.
 *
 * @public
 */
export interface MessageBubbleCssClasses {
  topContainer?: string;
  subContainer?: string;
  subContainer__bot?: string;
  subContainer__user?: string;
  message?: string;
  message__bot?: string;
  message__user?: string;
  timestamp?: string;
  timestamp__bot?: string;
  timestamp__user?: string;
}

const builtInCssClasses: MessageBubbleCssClasses = withStylelessCssClasses(
  "MessageBubble",
  {
    topContainer: "w-full animate-fade-in @container",
    subContainer:
      "flex flex-col @lg:flex-row @lg:items-center @lg:gap-x-2 @lg:m-1",
    subContainer__bot: "",
    subContainer__user: "@lg:flex-row-reverse",
    message:
      "peer rounded-2xl text-[13px] @[480px]:text-base p-4 w-fit max-w-[80%] prose overflow-x-auto",
    message__bot: "text-slate-900 bg-gradient-to-tr from-slate-50 to-slate-100",
    message__user:
      "ml-auto @lg:ml-0 text-white bg-gradient-to-tr from-blue-600 to-blue-700",
    timestamp:
      "w-fit my-0.5 text-slate-400 text-[13px] opacity-0 peer-hover:opacity-100 duration-200 whitespace-pre-wrap",
    timestamp__bot: "",
    timestamp__user: "ml-auto",
  }
);

/**
 * The props for the {@link MessageBubble} component.
 *
 * @public
 */
export interface MessageBubbleProps {
  /** The message to display. */
  message: Message;
  /**
   * Whether to show the timestamp of the message with the message bubble.
   * Defaults to true.
   */
  showTimestamp?: boolean;
  /**
   * A function which is called to format the message's timestamp given in
   * ISO format (e.g. "2023-05-18T19:33:34.553Z").
   * Defaults to "HH:MM:SS A" (e.g. "7:33:34 PM").
   */
  formatTimestamp?: (timestamp: string) => string;
  /** CSS classes for customizing the component styling. */
  customCssClasses?: MessageBubbleCssClasses;
}

/**
 * A component that displays the provided message.
 *
 * @public
 *
 * @param props - {@link MessageBubbleProps}
 */
export function MessageBubble({
  message,
  showTimestamp = true,
  customCssClasses,
  formatTimestamp = defaultFormatTimestamp,
}: MessageBubbleProps) {
  const cssClasses = useComposedCssClasses(builtInCssClasses, customCssClasses);
  const messageCssClasses = twMerge(
    cssClasses.message,
    message.source === MessageSource.USER
      ? cssClasses.message__user
      : cssClasses.message__bot
  );
  const subContainerCssClasses = twMerge(
    cssClasses.subContainer,
    message.source === MessageSource.USER
      ? cssClasses.subContainer__user
      : cssClasses.subContainer__bot
  );
  const timestampCssClasses = twMerge(
    cssClasses.timestamp,
    message.source === MessageSource.USER
      ? cssClasses.timestamp__user
      : cssClasses.timestamp__bot
  );

  return (
    <div className={cssClasses.topContainer}>
      <div className={subContainerCssClasses}>
        <div className={messageCssClasses}>
          <Markdown content={message.text} />
        </div>
        {/* fallback on empty space here to perserve the height for timestamp div */}
        {showTimestamp && (
          <div className={timestampCssClasses}>
            {message.timestamp ? formatTimestamp(message.timestamp) : " "}
          </div>
        )}
      </div>
    </div>
  );
}

/**
 * Formats message's timestamp from "2023-05-18T19:33:34.553Z" to "7:33:34 PM"
 *
 * @param timestamp - the timestamp to convert from
 * @returns formatted timestamp
 */
function defaultFormatTimestamp(timestamp: string): string {
  return new Date(timestamp).toLocaleString(undefined, {
    hour: "numeric",
    minute: "numeric",
    second: "numeric",
    hour12: true,
  });
}
