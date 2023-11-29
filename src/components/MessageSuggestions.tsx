import React, { useCallback } from "react";
import { useChatActions } from "@yext/chat-headless-react";
import { useDefaultHandleApiError } from "../hooks/useDefaultHandleApiError";
import { withStylelessCssClasses } from "../utils/withStylelessCssClasses";
import { useComposedCssClasses } from "../hooks";

/**
 * The CSS class interface for the MessageSuggestion component.
 *
 * @public
 */
export interface MessageSuggestionCssClasses {
  container?: string;
  suggestion?: string;
}

/**
 * The props for the MessageSuggestions component.
 *
 * @public
 */
export interface MessageSuggestionsProps {
  suggestions: string[];
  customCssClasses?: MessageSuggestionCssClasses;
}

const defaultClassnames: MessageSuggestionCssClasses = withStylelessCssClasses(
  "Suggestions",
  {
    container: "flex gap-2 mt-4 w-full overflow-x-auto flex-wrap",
    suggestion:
      "hover:cursor-pointer px-2 py-1 bg-white hover:bg-slate-300 rounded-full text-sm text-blue-700 border border-blue-700 hover:underline",
  }
);

/**
 * A component that displays a list of suggested messages
 * to the user, which they can click to send the message to the bot.
 *
 * @internal
 */
export const MessageSuggestions: React.FC<MessageSuggestionsProps> = ({
  suggestions,
  customCssClasses,
}) => {
  const actions = useChatActions();
  const defaultHandleApiError = useDefaultHandleApiError();
  const sendMsg = useCallback(
    (msg: string) => {
      const res = actions.getNextMessage(msg);
      res.catch(defaultHandleApiError);
    },
    [defaultHandleApiError, actions]
  );

  const classes = useComposedCssClasses(defaultClassnames, customCssClasses);

  return (
    <div className={classes.container}>
      {suggestions.map((suggestion, index) => (
        <button
          key={index}
          className={classes.suggestion}
          onClick={() => sendMsg(suggestion)}
        >
          {suggestion}
        </button>
      ))}
    </div>
  );
};
