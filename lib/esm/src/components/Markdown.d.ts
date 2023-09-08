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
export declare function Markdown({ content, responseId, className }: MarkdownProps): import("react/jsx-runtime").JSX.Element;
export {};
//# sourceMappingURL=Markdown.d.ts.map