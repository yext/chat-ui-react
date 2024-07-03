import React, { useMemo } from "react";
import { Message, MessageSource } from "@yext/chat-headless-react";
import { useComposedCssClasses } from "../hooks";
import { twMerge } from "tailwind-merge";
import { Markdown, MarkdownCssClasses } from "./Markdown";
import { withStylelessCssClasses } from "../utils/withStylelessCssClasses";
import { FeedbackButtons, FeedbackButtonsCssClasses } from "./FeedbackButtons";

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
  bubble?: string;
  bubble__bot?: string;
  bubble__user?: string;
  text?: string;
  text__bot?: string;
  text__user?: string;
  timestamp?: string;
  timestamp__bot?: string;
  timestamp__user?: string;
  feedbackButtonsCssClasses?: FeedbackButtonsCssClasses;
}

const builtInCssClasses: MessageBubbleCssClasses =
  withStylelessCssClasses<MessageBubbleCssClasses>("MessageBubble", {
    topContainer: "w-full animate-fade-in @container",
    subContainer:
      "flex flex-col @lg:flex-row @lg:items-center @lg:gap-x-2 @lg:m-1",
    subContainer__bot: "",
    subContainer__user: "@lg:flex-row-reverse",
    bubble: "relative group peer w-fit max-w-[80%] rounded-2xl p-4",
    bubble__bot: "bg-gradient-to-tr from-slate-50 to-slate-100",
    bubble__user:
      "ml-auto @lg:ml-0 bg-gradient-to-tr from-blue-600 to-blue-700 text-white",
    text: "text-[13px] @[480px]:text-base prose overflow-x-auto",
    text__bot: "text-slate-900",
    text__user: "text-white break-words",
    timestamp:
      "w-fit ml-4 @lg:ml-0 text-slate-400 text-[10px] @[480px]:text-[13px] opacity-0 peer-hover:opacity-100 duration-200 whitespace-pre-wrap",
    timestamp__bot: "",
    timestamp__user: "ml-auto",
    feedbackButtonsCssClasses: {},
  });

/**
 * The props for the {@link MessageBubble} component.
 *
 * @public
 */
export interface MessageBubbleProps {
  /** The message to display. */
  message: Message;
  /**
   * Whether to show the feedback buttons on the message bubble.
   * Defaults to true.
   */
  showFeedbackButtons?: boolean;
  /**
   * Whether to show the timestamp of the message with the message bubble.
   * Defaults to true.
   */
  showTimestamp?: boolean;
  /**
   * A function which is called to format the message's timestamp given in
   * ISO format (e.g. "2023-05-18T19:33:34.553Z").
   * Defaults to "HH:MM A" (e.g. "7:33 PM").
   */
  formatTimestamp?: (timestamp: string) => string;
  /** CSS classes for customizing the component styling. */
  customCssClasses?: MessageBubbleCssClasses;
  /** Link target open behavior on click. */
  linkTarget?: string;
  /** A callback which is called when user clicks a link. */
  onLinkClick?: (href?: string) => void;
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
  showFeedbackButtons = true,
  showTimestamp = true,
  customCssClasses,
  formatTimestamp = defaultFormatTimestamp,
  linkTarget,
  onLinkClick,
}: MessageBubbleProps) {
  const cssClasses = useComposedCssClasses(builtInCssClasses, customCssClasses);
  const bubbleCssClasses = twMerge(
    cssClasses.bubble,
    message.source === MessageSource.USER
      ? cssClasses.bubble__user
      : cssClasses.bubble__bot
  );
  const textCssClasses = twMerge(
    cssClasses.text,
    message.source === MessageSource.USER
      ? cssClasses.text__user
      : cssClasses.text__bot
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

  const markdownCssClasses: MarkdownCssClasses = useMemo(
    () => ({
      container: textCssClasses,
    }),
    [textCssClasses]
  );

  return (
    <div className={cssClasses.topContainer}>
      <div className={subContainerCssClasses}>
        <div className={bubbleCssClasses}>
          {showFeedbackButtons && message.source === MessageSource.BOT && (
            <FeedbackButtons
              customCssClasses={cssClasses.feedbackButtonsCssClasses}
              responseId={message.responseId}
            />
          )}
          <Markdown
            content={message.text}
            responseId={message.responseId}
            customCssClasses={markdownCssClasses}
            linkTarget={linkTarget}
            onLinkClick={onLinkClick}
          />
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
 * Formats message's timestamp from "2023-05-18T19:33:34.553Z" to "7:33 PM"
 *
 * @param timestamp - the timestamp to convert from
 * @returns formatted timestamp
 */
function defaultFormatTimestamp(timestamp: string): string {
  return new Date(timestamp).toLocaleString(undefined, {
    hour: "numeric",
    minute: "numeric",
    hour12: true,
  });
}
