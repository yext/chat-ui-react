'use strict';

var jsxRuntime = require('react/jsx-runtime');
var ThumbsDown = require('../icons/ThumbsDown.js');
var ThumbsUp = require('../icons/ThumbsUp.js');
var react = require('react');
var ThumbsUpFill = require('../icons/ThumbsUpFill.js');
var ThumbsDownFill = require('../icons/ThumbsDownFill.js');
var withStylelessCssClasses = require('../utils/withStylelessCssClasses.js');
var useComposedCssClasses = require('../hooks/useComposedCssClasses.js');
var useReportAnalyticsEvent = require('../hooks/useReportAnalyticsEvent.js');

const builtInCssClasses = withStylelessCssClasses.withStylelessCssClasses("FeedbackButtons", {
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
    const reportAnalyticsEvent = useReportAnalyticsEvent.useReportAnalyticsEvent();
    const cssClasses = useComposedCssClasses.useComposedCssClasses(builtInCssClasses, customCssClasses);
    const [selectedThumb, setSelectedThumb] = react.useState();
    const onClickThumbsUp = react.useCallback(() => {
        setSelectedThumb("UP");
        reportAnalyticsEvent({
            action: "THUMBS_UP",
            chat: {
                responseId,
            },
        });
    }, [reportAnalyticsEvent, responseId]);
    const onClickThumbsDown = react.useCallback(() => {
        setSelectedThumb("DOWN");
        reportAnalyticsEvent({
            action: "THUMBS_DOWN",
            chat: {
                responseId,
            },
        });
    }, [reportAnalyticsEvent, responseId]);
    return (jsxRuntime.jsxs("div", { className: cssClasses.container, children: [jsxRuntime.jsx("button", { className: cssClasses.thumbsUpButton, onClick: onClickThumbsUp, children: selectedThumb === "UP" ? (jsxRuntime.jsx(ThumbsUpFill.ThumbsUpFillIcon, { className: cssClasses.thumbsUpFillIcon })) : (jsxRuntime.jsx(ThumbsUp.ThumbsUpIcon, { className: cssClasses.thumbsUpIcon })) }), jsxRuntime.jsx("button", { className: cssClasses.thumbsDownButton, onClick: onClickThumbsDown, children: selectedThumb === "DOWN" ? (jsxRuntime.jsx(ThumbsDownFill.ThumbsDownFillIcon, { className: cssClasses.thumbsDownFillIcon })) : (jsxRuntime.jsx(ThumbsDown.ThumbsDownIcon, { className: cssClasses.thumbsDownIcon })) })] }));
}

exports.FeedbackButtons = FeedbackButtons;
//# sourceMappingURL=FeedbackButtons.js.map
