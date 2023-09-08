'use strict';

var jsxRuntime = require('react/jsx-runtime');
var ReactMarkdown = require('react-markdown');
var remarkGfm = require('remark-gfm');
var rehypeRaw = require('rehype-raw');
var rehypeSanitize = require('rehype-sanitize');
var react = require('react');
var useReportAnalyticsEvent = require('../hooks/useReportAnalyticsEvent.js');

// The Remark and Rehype plugins to use in conjunction with ReactMarkdown.
const unifiedPlugins = {
    remark: [
        remarkGfm, //renders Github-Flavored Markdown
    ],
    rehype: [
        rehypeRaw,
        rehypeSanitize, //to sanitize HTML content
    ],
};
/**
 * Renders Github-Flavored Markdown from the Knowledge Graph. This Markdown can include
 * arbitrary HTML. Any HTML will be sanitized according to Rehype's default Schema.
 *
 * @remarks
 * A link click will send a CHAT_LINK_CLICK analytics event
 *
 * @internal
 */
function Markdown({ content, responseId, className }) {
    const reportAnalyticsEvent = useReportAnalyticsEvent.useReportAnalyticsEvent();
    const components = react.useMemo(() => {
        const createClickHandlerFn = (href) => () => {
            reportAnalyticsEvent({
                action: "CHAT_LINK_CLICK",
                destinationUrl: href,
                chat: {
                    responseId,
                },
            });
        };
        return {
            a: ({ node: _, children, ...props }) => {
                return (jsxRuntime.jsx("a", { ...props, onClick: createClickHandlerFn(props.href), target: "_blank", rel: "noopener noreferrer", className: "cursor-pointer", children: children }));
            },
        };
    }, [reportAnalyticsEvent, responseId]);
    return (jsxRuntime.jsx(ReactMarkdown, { className: className, children: content, remarkPlugins: unifiedPlugins.remark, rehypePlugins: unifiedPlugins.rehype, components: components }));
}

exports.Markdown = Markdown;
//# sourceMappingURL=Markdown.js.map
