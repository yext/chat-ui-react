import { jsx, jsxs } from 'react/jsx-runtime';
import { MessageSource } from '@yext/chat-headless-react';
import { useComposedCssClasses } from '../hooks/useComposedCssClasses.mjs';
import { twMerge } from 'tailwind-merge';
import { Markdown } from './Markdown.mjs';
import { withStylelessCssClasses } from '../utils/withStylelessCssClasses.mjs';
import { FeedbackButtons } from './FeedbackButtons.mjs';

const builtInCssClasses = withStylelessCssClasses("MessageBubble", {
    topContainer: "w-full animate-fade-in @container",
    subContainer: "flex flex-col @lg:flex-row @lg:items-center @lg:gap-x-2 @lg:m-1",
    subContainer__bot: "",
    subContainer__user: "@lg:flex-row-reverse",
    bubble: "relative group peer w-fit max-w-[80%] rounded-2xl p-4",
    bubble__bot: "bg-gradient-to-tr from-slate-50 to-slate-100",
    bubble__user: "ml-auto @lg:ml-0 bg-gradient-to-tr from-blue-600 to-blue-700 text-white",
    text: "text-[13px] @[480px]:text-base prose overflow-x-auto",
    text__bot: "text-slate-900",
    text__user: "text-white break-words",
    timestamp: "w-fit my-0.5 ml-4 @lg:ml-0 text-slate-400 text-[10px] @[480px]:text-[13px] opacity-0 peer-hover:opacity-100 duration-200 whitespace-pre-wrap",
    timestamp__bot: "",
    timestamp__user: "ml-auto",
    feedbackButtonsCssClasses: {},
});
/**
 * A component that displays the provided message.
 *
 * @public
 *
 * @param props - {@link MessageBubbleProps}
 */
function MessageBubble({ message, showFeedbackButtons = true, showTimestamp = true, customCssClasses, formatTimestamp = defaultFormatTimestamp, }) {
    console.log('MessageBubble!');
    const cssClasses = useComposedCssClasses(builtInCssClasses, customCssClasses);
    const bubbleCssClasses = twMerge(cssClasses.bubble, message.source === MessageSource.USER
        ? cssClasses.bubble__user
        : cssClasses.bubble__bot);
    const textCssClasses = twMerge(cssClasses.text, message.source === MessageSource.USER
        ? cssClasses.text__user
        : cssClasses.text__bot);
    const subContainerCssClasses = twMerge(cssClasses.subContainer, message.source === MessageSource.USER
        ? cssClasses.subContainer__user
        : cssClasses.subContainer__bot);
    const timestampCssClasses = twMerge(cssClasses.timestamp, message.source === MessageSource.USER
        ? cssClasses.timestamp__user
        : cssClasses.timestamp__bot);
    return (jsx("div", { className: cssClasses.topContainer, children: jsxs("div", { className: subContainerCssClasses, children: [jsxs("div", { className: bubbleCssClasses, children: [showFeedbackButtons && message.source === MessageSource.BOT && (jsx(FeedbackButtons, { customCssClasses: cssClasses.feedbackButtonsCssClasses, responseId: message.responseId })), jsx(Markdown, { content: message.text, responseId: message.responseId, className: textCssClasses })] }), showTimestamp && (jsx("div", { className: timestampCssClasses, children: message.timestamp ? formatTimestamp(message.timestamp) : " " }))] }) }));
}
/**
 * Formats message's timestamp from "2023-05-18T19:33:34.553Z" to "7:33 PM"
 *
 * @param timestamp - the timestamp to convert from
 * @returns formatted timestamp
 */
function defaultFormatTimestamp(timestamp) {
    return new Date(timestamp).toLocaleString(undefined, {
        hour: "numeric",
        minute: "numeric",
        hour12: true,
    });
}

export { MessageBubble };
//# sourceMappingURL=MessageBubble.mjs.map
