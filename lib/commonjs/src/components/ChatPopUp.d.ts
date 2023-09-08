/// <reference types="react" />
import { ChatPanelCssClasses, ChatPanelProps } from "./ChatPanel";
import { ChatHeaderCssClasses, ChatHeaderProps } from "./ChatHeader";
/**
 * The CSS class interface for the {@link ChatPopUp} component.
 *
 * @public
 */
export interface ChatPopUpCssClasses {
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
export interface ChatPopUpProps extends Omit<ChatHeaderProps, "showCloseButton" | "customCssClasses">, Omit<ChatPanelProps, "header" | "customCssClasses"> {
    /** Custom icon for the popup button to open the panel. */
    openPanelButtonIcon?: JSX.Element;
    /**
     * CSS classes for customizing the component styling.
     */
    customCssClasses?: ChatPopUpCssClasses;
}
/**
 * A component that renders a popup button that displays and hides
 * a panel for chat bot interactions.
 *
 * @public
 *
 * @param props - {@link ChatPanelProps}
 */
export declare function ChatPopUp(props: ChatPopUpProps): import("react/jsx-runtime").JSX.Element;
//# sourceMappingURL=ChatPopUp.d.ts.map