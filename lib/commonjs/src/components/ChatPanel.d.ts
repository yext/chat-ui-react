/// <reference types="react" />
import { MessageBubbleCssClasses, MessageBubbleProps } from "./MessageBubble";
import { ChatInputCssClasses, ChatInputProps } from "./ChatInput";
/**
 * The CSS class interface for the {@link ChatPanel} component.
 *
 * @public
 */
export interface ChatPanelCssClasses {
    container?: string;
    messagesContainer?: string;
    messagesScrollContainer?: string;
    inputContainer?: string;
    inputCssClasses?: ChatInputCssClasses;
    messageBubbleCssClasses?: MessageBubbleCssClasses;
}
/**
 * The props for the {@link ChatPanel} component.
 *
 * @public
 */
export interface ChatPanelProps extends Omit<MessageBubbleProps, "customCssClasses" | "message">, Omit<ChatInputProps, "customCssClasses"> {
    /** A header to render at the top of the panel. */
    header?: JSX.Element;
    /**
     * CSS classes for customizing the component styling.
     */
    customCssClasses?: ChatPanelCssClasses;
}
/**
 * A component that renders a full panel for chat bot interactions. This includes
 * the message bubbles for the conversation, input box with send button, and header
 * (if provided).
 *
 * @public
 *
 * @param props - {@link ChatPanelProps}
 */
export declare function ChatPanel(props: ChatPanelProps): import("react/jsx-runtime").JSX.Element;
//# sourceMappingURL=ChatPanel.d.ts.map