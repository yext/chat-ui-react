import { ThumbsDownIcon } from "../icons/ThumbsDown";
import { ThumbsUpIcon } from "../icons/ThumbsUp";
import { useCallback, useState } from "react";
import { ThumbsUpFillIcon } from "../icons/ThumbsUpFill";
import { ThumbsDownFillIcon } from "../icons/ThumbsDownFill";
import { withStylelessCssClasses } from "../utils/withStylelessCssClasses";
import { useComposedCssClasses } from "../hooks";
import { useChatActions } from "@yext/chat-headless-react";

/**
 * The CSS class interface for the {@link FeedbackButtons} component.
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
    thumbsUpFillIcon: "text-gray-700 w-[22px] h-[22px] stroke-[0.2]",
    thumbsDownButton:
      "w-6 h-6 bg-gray-700 rounded-md flex justify-center items-center",
    thumbsDownIcon: "text-white w-[22px] h-[22px] stroke-[0.2]",
    thumbsDownFillIcon: "text-gray-700 w-[22px] h-[22px] stroke-[0.2]",
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
  const actions = useChatActions();
  const cssClasses = useComposedCssClasses(builtInCssClasses, customCssClasses);
  const [selectedThumb, setSelectedThumb] = useState<
    "UP" | "DOWN" | undefined
  >();
  const onClickThumbsUp = useCallback(() => {
    setSelectedThumb("UP");
    actions.report({
      action: "THUMBS_UP",
      chat: {
        responseId,
      },
    });
  }, [actions, responseId]);

  const onClickThumbsDown = useCallback(() => {
    setSelectedThumb("DOWN");
    actions.report({
      action: "THUMBS_DOWN",
      chat: {
        responseId,
      },
    });
  }, [actions, responseId]);

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
