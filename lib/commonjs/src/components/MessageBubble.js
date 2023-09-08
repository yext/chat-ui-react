'use strict';

var jsxRuntime = require('react/jsx-runtime');
var chatHeadlessReact = require('@yext/chat-headless-react');
var useComposedCssClasses = require('../hooks/useComposedCssClasses.js');
var tailwindMerge = require('tailwind-merge');
var Markdown = require('./Markdown.js');
var withStylelessCssClasses = require('../utils/withStylelessCssClasses.js');
var FeedbackButtons = require('./FeedbackButtons.js');

const builtInCssClasses = withStylelessCssClasses.withStylelessCssClasses("MessageBubble", {
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
    const cssClasses = useComposedCssClasses.useComposedCssClasses(builtInCssClasses, customCssClasses);
    const bubbleCssClasses = tailwindMerge.twMerge(cssClasses.bubble, message.source === chatHeadlessReact.MessageSource.USER
        ? cssClasses.bubble__user
        : cssClasses.bubble__bot);
    const textCssClasses = tailwindMerge.twMerge(cssClasses.text, message.source === chatHeadlessReact.MessageSource.USER
        ? cssClasses.text__user
        : cssClasses.text__bot);
    const subContainerCssClasses = tailwindMerge.twMerge(cssClasses.subContainer, message.source === chatHeadlessReact.MessageSource.USER
        ? cssClasses.subContainer__user
        : cssClasses.subContainer__bot);
    const timestampCssClasses = tailwindMerge.twMerge(cssClasses.timestamp, message.source === chatHeadlessReact.MessageSource.USER
        ? cssClasses.timestamp__user
        : cssClasses.timestamp__bot);
    return (jsxRuntime.jsx("div", { className: cssClasses.topContainer, children: jsxRuntime.jsxs("div", { className: subContainerCssClasses, children: [jsxRuntime.jsxs("div", { className: bubbleCssClasses, children: [showFeedbackButtons && message.source === chatHeadlessReact.MessageSource.BOT && (jsxRuntime.jsx(FeedbackButtons.FeedbackButtons, { customCssClasses: cssClasses.feedbackButtonsCssClasses, responseId: message.responseId })), jsxRuntime.jsx(Markdown.Markdown, { content: message.text, responseId: message.responseId, className: textCssClasses })] }), showTimestamp && (jsxRuntime.jsx("div", { className: timestampCssClasses, children: message.timestamp ? formatTimestamp(message.timestamp) : " " }))] }) }));
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

exports.MessageBubble = MessageBubble;
//# sourceMappingURL=MessageBubble.js.map
