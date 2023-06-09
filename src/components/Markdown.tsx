import ReactMarkdown, { PluggableList } from "react-markdown";
import remarkGfm from "remark-gfm";
import rehypeRaw from "rehype-raw";
import rehypeSanitize from "rehype-sanitize";

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
}

/**
 * Renders Github-Flavored Markdown from the Knowledge Graph. This Markdown can include
 * arbitrary HTML. Any HTML will be sanitized according to Rehype's default Schema.
 *
 * @public
 */
export function Markdown({ content }: MarkdownProps) {
  return (
    <ReactMarkdown
      children={content}
      remarkPlugins={unifiedPlugins.remark}
      rehypePlugins={unifiedPlugins.rehype}
    />
  );
}
