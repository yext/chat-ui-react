import ReactMarkdown, {
  PluggableList,
  ReactMarkdownOptions,
} from "react-markdown";
import remarkGfm from "remark-gfm";
import rehypeRaw from "rehype-raw";
import rehypeSanitize from "rehype-sanitize";
import { useMemo } from "react";
import { useChatActions } from "@yext/chat-headless-react";

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

interface MarkdownProps {
  /** Stringified markdown. */
  content: string;
  /** The response ID correlates to the current message. */
  responseId?: string;
  /** Classnames for the container. */
  className?: string;
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
export function Markdown({ content, responseId, className }: MarkdownProps) {
  const action = useChatActions();
  const components: ReactMarkdownOptions["components"] = useMemo(() => {
    const createClickHandlerFn = (href?: string) => () => {
      action.report({
        action: "CHAT_LINK_CLICK",
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
            className="cursor-pointer"
          >
            {children}
          </a>
        );
      },
    };
  }, [action, responseId]);

  return (
    <ReactMarkdown
      className={className}
      children={content}
      remarkPlugins={unifiedPlugins.remark}
      rehypePlugins={unifiedPlugins.rehype}
      components={components}
    />
  );
}
