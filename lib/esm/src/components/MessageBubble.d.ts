import { Message } from "@yext/chat-headless-react";
import { FeedbackButtonsCssClasses } from "./FeedbackButtons";
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
}
/**
 * A component that displays the provided message.
 *
 * @public
 *
 * @param props - {@link MessageBubbleProps}
 */
export declare function MessageBubble({ message, showFeedbackButtons, showTimestamp, customCssClasses, formatTimestamp, }: MessageBubbleProps): import("react/jsx-runtime").JSX.Element;
//# sourceMappingURL=MessageBubble.d.ts.map