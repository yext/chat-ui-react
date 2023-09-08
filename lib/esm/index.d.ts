/// <reference types="react" />

import { JSX as JSX_2 } from 'react/jsx-runtime';
import { Message } from '@yext/chat-headless-react';

/**
 * A component that renders the header of a chat bot panel,
 * including the title and a button to reset the conversation.
 *
 * @public
 *
 * @param props - {@link ChatHeaderProps}
 */
export declare function ChatHeader({ title, showRestartButton, restartButtonIcon, showCloseButton, closeButtonIcon, onClose, customCssClasses, }: ChatHeaderProps): JSX_2.Element;

/**
 * The CSS class interface for the {@link ChatHeader} component.
 *
 * @public
 */
export declare interface ChatHeaderCssClasses {
    container?: string;
    title?: string;
    restartButton?: string;
    restartButtonIcon?: string;
    closeButton?: string;
    closeButtonIcon?: string;
}

/**
 * The props for the {@link ChatHeader} component.
 *
 * @public
 */
export declare interface ChatHeaderProps {
    /**
     * The headers's title text, essentially how the chat window identifies itself to the user.
     */
    title: string;
    /**
     * Displays a restart button which allows the user to restart the conversation.
     * Defaults to false.
     */
    showRestartButton?: boolean;
    /**
     * Displays a close button which will invoke {@link ChatHeaderProps.onClose} on click.
     * Default to false.
     */
    showCloseButton?: boolean;
    /** A function which is called when the close button is clicked.  */
    onClose?: () => void;
    /**  Custom icon for for restart button. */
    restartButtonIcon?: JSX.Element;
    /**  Custom icon for for close button. */
    closeButtonIcon?: JSX.Element;
    /**  CSS classes for customizing the component styling. */
    customCssClasses?: ChatHeaderCssClasses;
}

/**
 * A component that allows user to input message and send to Chat API.
 *
 * @remarks
 * Pressing "Enter" key will send the current message.
 * To add a newline, press "Shift" and "Enter".
 *
 * @public
 *
 * @param props - {@link ChatInputProps}
 */
export declare function ChatInput({ placeholder, stream, inputAutoFocus, handleError, sendButtonIcon, customCssClasses, }: ChatInputProps): JSX_2.Element;

/**
 * The CSS class interface for the {@link ChatInput} component.
 *
 * @public
 */
export declare interface ChatInputCssClasses {
    container?: string;
    textArea?: string;
    sendButton?: string;
}

/**
 * The props for the {@link ChatInput} component.
 *
 * @public
 */
export declare interface ChatInputProps {
    /**
     * The input's placeholder text when no text has been entered by the user.
     * Defaults to "Type a message...".
     */
    placeholder?: string;
    /**
     * Enable streaming behavior by making a request to Chat Streaming API.
     * This feature is experimental, and is subject to change.
     * Defaults to false.
     */
    stream?: boolean;
    /** Enable auto focus for the input box. Defaults to false. */
    inputAutoFocus?: boolean;
    /**
     * A function which is called when an error occurs from Chat API while processing the user's message.
     * By default, the error is logged to the console and an error message is added to state.
     */
    handleError?: (e: unknown) => void;
    /** Custom icon for the send button. */
    sendButtonIcon?: JSX.Element;
    /** CSS classes for customizing the component styling. */
    customCssClasses?: ChatInputCssClasses;
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
export declare function ChatPanel(props: ChatPanelProps): JSX_2.Element;

/**
 * The CSS class interface for the {@link ChatPanel} component.
 *
 * @public
 */
export declare interface ChatPanelCssClasses {
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
export declare interface ChatPanelProps extends Omit<MessageBubbleProps, "customCssClasses" | "message">, Omit<ChatInputProps, "customCssClasses"> {
    /** A header to render at the top of the panel. */
    header?: JSX.Element;
    /**
     * CSS classes for customizing the component styling.
     */
    customCssClasses?: ChatPanelCssClasses;
}

/**
 * A component that renders a popup button that displays and hides
 * a panel for chat bot interactions.
 *
 * @public
 *
 * @param props - {@link ChatPanelProps}
 */
export declare function ChatPopUp(props: ChatPopUpProps): JSX_2.Element;

/**
 * The CSS class interface for the {@link ChatPopUp} component.
 *
 * @public
 */
export declare interface ChatPopUpCssClasses {
    container?: string;
    panel?: string;
    panel__display?: string;
    panel__hidden?: string;
    button?: string;
    button__display?: string;
    button__hidden?: string;
    buttonIcon?: string;
    headerCssClasses?: ChatHeaderCssClasses;
    panelCssClasses?: ChatPanelCssClasses;
}

/**
 * The props for the {@link ChatPopUp} component.
 *
 * @public
 */
export declare interface ChatPopUpProps extends Omit<ChatHeaderProps, "showCloseButton" | "customCssClasses">, Omit<ChatPanelProps, "header" | "customCssClasses"> {
    /** Custom icon for the popup button to open the panel. */
    openPanelButtonIcon?: JSX.Element;
    /**
     * CSS classes for customizing the component styling.
     */
    customCssClasses?: ChatPopUpCssClasses;
}

/**
 * The CSS class interface for the FeedbackButtons component.
 *
 * @public
 */
export declare interface FeedbackButtonsCssClasses {
    container?: string;
    thumbsUpButton?: string;
    thumbsUpIcon?: string;
    thumbsUpFillIcon?: string;
    thumbsDownButton?: string;
    thumbsDownIcon?: string;
    thumbsDownFillIcon?: string;
}

/**
 * A component that displays the provided message.
 *
 * @public
 *
 * @param props - {@link MessageBubbleProps}
 */
export declare function MessageBubble({ message, showFeedbackButtons, showTimestamp, customCssClasses, formatTimestamp, }: MessageBubbleProps): JSX_2.Element;

/**
 * The CSS class interface for the {@link MessageBubble} component.
 *
 * @public
 */
export declare interface MessageBubbleCssClasses {
    topContainer?: string;
    subContainer?: string;
    subContainer__bot?: string;
    subContainer__user?: string;
    bubble?: string;
    bubble__bot?: string;
    bubble__user?: string;
    text?: string;
    text__bot?: string;
    text__user?: string;
    timestamp?: string;
    timestamp__bot?: string;
    timestamp__user?: string;
    feedbackButtonsCssClasses?: FeedbackButtonsCssClasses;
}

/**
 * The props for the {@link MessageBubble} component.
 *
 * @public
 */
export declare interface MessageBubbleProps {
    /** The message to display. */
    message: Message;
    /**
     * Whether to show the feedback buttons on the message bubble.
     * Defaults to true.
     */
    showFeedbackButtons?: boolean;
    /**
     * Whether to show the timestamp of the message with the message bubble.
     * Defaults to true.
     */
    showTimestamp?: boolean;
    /**
     * A function which is called to format the message's timestamp given in
     * ISO format (e.g. "2023-05-18T19:33:34.553Z").
     * Defaults to "HH:MM A" (e.g. "7:33 PM").
     */
    formatTimestamp?: (timestamp: string) => string;
    /** CSS classes for customizing the component styling. */
    customCssClasses?: MessageBubbleCssClasses;
}

/**
 * useComposedCssClasses merges a component's built-in tailwind classes with custom tailwind classes.
 *
 * @remarks
 * Tailwind classes will be merged without conflict, with custom classes having higher priority
 * than built-in ones.
 *
 * @example
 * Suppose a component has built-in classes of `{ container: 'px-4 text-slate-700' }`.
 *
 * Passing in the custom classes:
 *
 * ```ts
 * { container: 'text-red-200 mb-3' }
 * ```
 *
 * results in the merged classes of:
 *
 * ```ts
 * { container: 'px-4 text-red-200 mb-3' }
 * ```
 *
 * @public
 *
 * @param builtInClasses - The component's built-in tailwind classes
 * @param customClasses - The custom tailwind classes to merge with the built-in ones
 * @returns The composed CSS classes
 */
export declare function useComposedCssClasses<ClassInterface extends Partial<Record<keyof ClassInterface, string | object>>>(builtInClasses: Readonly<ClassInterface>, customClasses?: Partial<ClassInterface>): ClassInterface;

export { }
