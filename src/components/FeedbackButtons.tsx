import { ThumbsDownIcon } from "../icons/ThumbsDown";
import { ThumbsUpIcon } from "../icons/ThumbsUp";
import React, { useCallback, useState } from "react";
import { ThumbsUpFillIcon } from "../icons/ThumbsUpFill";
import { ThumbsDownFillIcon } from "../icons/ThumbsDownFill";
import { withStylelessCssClasses } from "../utils/withStylelessCssClasses";
import { useComposedCssClasses } from "../hooks";
import { useReportAnalyticsEvent } from "../hooks/useReportAnalyticsEvent";

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

const builtInCssClasses: FeedbackButtonsCssClasses =
  withStylelessCssClasses<FeedbackButtonsCssClasses>("FeedbackButtons", {
    container:
      "flex gap-x-1 absolute -right-1 -top-3 opacity-0 group-hover:opacity-100 duration-200",
    thumbsUpButton:
      "w-6 h-6 bg-gray-700 rounded-md flex justify-center items-center",
    thumbsUpIcon: "text-white w-[22px] h-[22px] stroke-[0.2]",
    thumbsUpFillIcon: "text-white w-[22px] h-[22px] stroke-[0.2]",
    thumbsDownButton:
      "w-6 h-6 bg-gray-700 rounded-md flex justify-center items-center",
    thumbsDownIcon: "text-white w-[22px] h-[22px] stroke-[0.2]",
    thumbsDownFillIcon: "text-white w-[22px] h-[22px] stroke-[0.2]",
  });

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
export function FeedbackButtons({
  customCssClasses,
  responseId,
}: FeedbackButtonsProps) {
  const reportAnalyticsEvent = useReportAnalyticsEvent();
  const cssClasses = useComposedCssClasses(builtInCssClasses, customCssClasses);
  const [selectedThumb, setSelectedThumb] = useState<
    "UP" | "DOWN" | undefined
  >();
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

  return (
    <div className={cssClasses.container}>
      <button className={cssClasses.thumbsUpButton} onClick={onClickThumbsUp}>
        {selectedThumb === "UP" ? (
          <ThumbsUpFillIcon className={cssClasses.thumbsUpFillIcon} />
        ) : (
          <ThumbsUpIcon className={cssClasses.thumbsUpIcon} />
        )}
      </button>
      <button
        className={cssClasses.thumbsDownButton}
        onClick={onClickThumbsDown}
      >
        {selectedThumb === "DOWN" ? (
          <ThumbsDownFillIcon className={cssClasses.thumbsDownFillIcon} />
        ) : (
          <ThumbsDownIcon className={cssClasses.thumbsDownIcon} />
        )}
      </button>
    </div>
  );
}
