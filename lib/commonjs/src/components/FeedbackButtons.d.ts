/**
 * The CSS class interface for the FeedbackButtons component.
 *
 * @public
 */
export interface FeedbackButtonsCssClasses {
    container?: string;
    thumbsUpButton?: string;
    thumbsUpIcon?: string;
    thumbsUpFillIcon?: string;
    thumbsDownButton?: string;
    thumbsDownIcon?: string;
    thumbsDownFillIcon?: string;
}
/**
 * The props for the FeedbackButtons component.
 *
 * @internal
 */
interface FeedbackButtonsProps {
    /** The response ID correlates to the current message to give feedback on. */
    responseId?: string;
    /** CSS classes for customizing the component styling. */
    customCssClasses?: FeedbackButtonsCssClasses;
}
/**
 * Displays feedback buttons (e.g. thumbs up and thumbs down) that will
 * report analytic events on click.
 *
 * @internal
 */
export declare function FeedbackButtons({ customCssClasses, responseId, }: FeedbackButtonsProps): import("react/jsx-runtime").JSX.Element;
export {};
//# sourceMappingURL=FeedbackButtons.d.ts.map