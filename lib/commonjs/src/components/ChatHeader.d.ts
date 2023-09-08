/// <reference types="react" />
/**
 * The CSS class interface for the {@link ChatHeader} component.
 *
 * @public
 */
export interface ChatHeaderCssClasses {
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
export interface ChatHeaderProps {
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
 * A component that renders the header of a chat bot panel,
 * including the title and a button to reset the conversation.
 *
 * @public
 *
 * @param props - {@link ChatHeaderProps}
 */
export declare function ChatHeader({ title, showRestartButton, restartButtonIcon, showCloseButton, closeButtonIcon, onClose, customCssClasses, }: ChatHeaderProps): import("react/jsx-runtime").JSX.Element;
//# sourceMappingURL=ChatHeader.d.ts.map