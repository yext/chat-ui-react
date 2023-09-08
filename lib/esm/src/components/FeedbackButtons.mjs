import { jsxs, jsx } from 'react/jsx-runtime';
import { ThumbsDownIcon } from '../icons/ThumbsDown.mjs';
import { ThumbsUpIcon } from '../icons/ThumbsUp.mjs';
import { useState, useCallback } from 'react';
import { ThumbsUpFillIcon } from '../icons/ThumbsUpFill.mjs';
import { ThumbsDownFillIcon } from '../icons/ThumbsDownFill.mjs';
import { withStylelessCssClasses } from '../utils/withStylelessCssClasses.mjs';
import { useComposedCssClasses } from '../hooks/useComposedCssClasses.mjs';
import { useReportAnalyticsEvent } from '../hooks/useReportAnalyticsEvent.mjs';

const builtInCssClasses = withStylelessCssClasses("FeedbackButtons", {
    container: "flex gap-x-1 absolute -right-1 -top-3 opacity-0 group-hover:opacity-100 duration-200",
    thumbsUpButton: "w-6 h-6 bg-gray-700 rounded-md flex justify-center items-center",
    thumbsUpIcon: "text-white w-[22px] h-[22px] stroke-[0.2]",
    thumbsUpFillIcon: "text-white w-[22px] h-[22px] stroke-[0.2]",
    thumbsDownButton: "w-6 h-6 bg-gray-700 rounded-md flex justify-center items-center",
    thumbsDownIcon: "text-white w-[22px] h-[22px] stroke-[0.2]",
    thumbsDownFillIcon: "text-white w-[22px] h-[22px] stroke-[0.2]",
});
/**
 * Displays feedback buttons (e.g. thumbs up and thumbs down) that will
 * report analytic events on click.
 *
 * @internal
 */
function FeedbackButtons({ customCssClasses, responseId, }) {
    const reportAnalyticsEvent = useReportAnalyticsEvent();
    const cssClasses = useComposedCssClasses(builtInCssClasses, customCssClasses);
    const [selectedThumb, setSelectedThumb] = useState();
    const onClickThumbsUp = useCallback(() => {
        setSelectedThumb("UP");
        reportAnalyticsEvent({
            action: "THUMBS_UP",
            chat: {
                responseId,
            },
        });
    }, [reportAnalyticsEvent, responseId]);
    const onClickThumbsDown = useCallback(() => {
        setSelectedThumb("DOWN");
        reportAnalyticsEvent({
            action: "THUMBS_DOWN",
            chat: {
                responseId,
            },
        });
    }, [reportAnalyticsEvent, responseId]);
    return (jsxs("div", { className: cssClasses.container, children: [jsx("button", { className: cssClasses.thumbsUpButton, onClick: onClickThumbsUp, children: selectedThumb === "UP" ? (jsx(ThumbsUpFillIcon, { className: cssClasses.thumbsUpFillIcon })) : (jsx(ThumbsUpIcon, { className: cssClasses.thumbsUpIcon })) }), jsx("button", { className: cssClasses.thumbsDownButton, onClick: onClickThumbsDown, children: selectedThumb === "DOWN" ? (jsx(ThumbsDownFillIcon, { className: cssClasses.thumbsDownFillIcon })) : (jsx(ThumbsDownIcon, { className: cssClasses.thumbsDownIcon })) })] }));
}

export { FeedbackButtons };
//# sourceMappingURL=FeedbackButtons.mjs.map
