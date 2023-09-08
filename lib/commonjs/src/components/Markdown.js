'use strict';

var jsxRuntime = require('react/jsx-runtime');
var ReactMarkdown = require('react-markdown');
var remarkGfm = require('remark-gfm');
var rehypeRaw = require('rehype-raw');
var rehypeSanitize = require('rehype-sanitize');
var react = require('react');
var useReportAnalyticsEvent = require('../hooks/useReportAnalyticsEvent.js');

function _interopDefault (e) { return e && e.__esModule ? e : { default: e }; }

var ReactMarkdown__default = /*#__PURE__*/_interopDefault(ReactMarkdown);
var remarkGfm__default = /*#__PURE__*/_interopDefault(remarkGfm);
var rehypeRaw__default = /*#__PURE__*/_interopDefault(rehypeRaw);
var rehypeSanitize__default = /*#__PURE__*/_interopDefault(rehypeSanitize);

// The Remark and Rehype plugins to use in conjunction with ReactMarkdown.
const unifiedPlugins = {
    remark: [
        remarkGfm__default.default, //renders Github-Flavored Markdown
    ],
    rehype: [
        rehypeRaw__default.default,
        rehypeSanitize__default.default, //to sanitize HTML content
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
    return (jsxRuntime.jsx(ReactMarkdown__default.default, { className: className, children: content, remarkPlugins: unifiedPlugins.remark, rehypePlugins: unifiedPlugins.rehype, components: components }));
}

exports.Markdown = Markdown;
//# sourceMappingURL=Markdown.js.map
