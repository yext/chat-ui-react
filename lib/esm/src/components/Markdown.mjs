import { jsx } from 'react/jsx-runtime';
import ReactMarkdown from 'react-markdown';
import remarkGfm from 'remark-gfm';
import rehypeRaw from 'rehype-raw';
import rehypeSanitize from 'rehype-sanitize';
import { useMemo } from 'react';
import { useReportAnalyticsEvent } from '../hooks/useReportAnalyticsEvent.mjs';

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
    const reportAnalyticsEvent = useReportAnalyticsEvent();
    const components = useMemo(() => {
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
                return (jsx("a", { ...props, onClick: createClickHandlerFn(props.href), target: "_blank", rel: "noopener noreferrer", className: "cursor-pointer", children: children }));
            },
        };
    }, [reportAnalyticsEvent, responseId]);
    return (jsx(ReactMarkdown, { className: className, children: content, remarkPlugins: unifiedPlugins.remark, rehypePlugins: unifiedPlugins.rehype, components: components }));
}

export { Markdown };
//# sourceMappingURL=Markdown.mjs.map
