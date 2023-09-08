/// <reference types="react" />
/**
 * The CSS class interface for the {@link ChatInput} component.
 *
 * @public
 */
export interface ChatInputCssClasses {
    container?: string;
    textArea?: string;
    sendButton?: string;
}
/**
 * The props for the {@link ChatInput} component.
 *
 * @public
 */
export interface ChatInputProps {
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
export declare function ChatInput({ placeholder, stream, inputAutoFocus, handleError, sendButtonIcon, customCssClasses, }: ChatInputProps): import("react/jsx-runtime").JSX.Element;
//# sourceMappingURL=ChatInput.d.ts.map