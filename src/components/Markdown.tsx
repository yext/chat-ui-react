import ReactMarkdown, {
  PluggableList,
  ReactMarkdownOptions,
} from "react-markdown";
import remarkGfm from "remark-gfm";
import rehypeRaw from "rehype-raw";
import rehypeSanitize from "rehype-sanitize";
import React, { useMemo } from "react";
import { useReportAnalyticsEvent } from "../hooks/useReportAnalyticsEvent";
import { useComposedCssClasses } from "../hooks/useComposedCssClasses";

// The Remark and Rehype plugins to use in conjunction with ReactMarkdown.
const unifiedPlugins: { remark?: PluggableList; rehype: PluggableList } = {
  remark: [
    remarkGfm, //renders Github-Flavored Markdown
  ],
  rehype: [
    rehypeRaw, //to support HTML embedded in markdown
    rehypeSanitize, //to sanitize HTML content
  ],
};

/**
 * The CSS class interface for the Markdown component.
 *
 * @internal
 */
export interface MarkdownCssClasses {
  container?: string;
  link?: string;
}

const builtInCssClasses: MarkdownCssClasses = {
  link: "cursor-pointer",
};

interface MarkdownProps {
  /** Stringified markdown. */
  content: string;
  /** The response ID correlates to the current message. */
  responseId?: string;
  /** CSS classes for customizing the component styling. */
  customCssClasses?: MarkdownCssClasses;
  /**
   * Action to report for analytics event when a link is clicked.
   * Defaults to 'CHAT_LINK_CLICK'.
   */
  linkClickEvent?: "WEBSITE" | "CHAT_LINK_CLICK";
}

/**
 * Renders Github-Flavored Markdown from the Knowledge Graph. This Markdown can include
 * arbitrary HTML. Any HTML will be sanitized according to Rehype's default Schema.
 *
 * @remarks
 * A link click will send a CHAT_LINK_CLICK analytics event
 *
 * @internal
 */
export function Markdown({
  content,
  responseId,
  customCssClasses,
  linkClickEvent = "CHAT_LINK_CLICK",
}: MarkdownProps) {
  const reportAnalyticsEvent = useReportAnalyticsEvent();
  const cssClasses = useComposedCssClasses(builtInCssClasses, customCssClasses);

  const components: ReactMarkdownOptions["components"] = useMemo(() => {
    const createClickHandlerFn = (href?: string) => () => {
      reportAnalyticsEvent({
        action: linkClickEvent,
        destinationUrl: href,
        chat: {
          responseId,
        },
      });
    };
    return {
      a: ({ node: _, children, ...props }) => {
        return (
          <a
            {...props}
            onClick={createClickHandlerFn(props.href)}
            target="_blank"
            rel="noopener noreferrer"
            className={cssClasses.link}
          >
            {children}
          </a>
        );
      },
    };
  }, [reportAnalyticsEvent, linkClickEvent, responseId, cssClasses]);

  return (
    <ReactMarkdown
      className={cssClasses.container}
      children={content}
      remarkPlugins={unifiedPlugins.remark}
      rehypePlugins={unifiedPlugins.rehype}
      components={components}
    />
  );
}
