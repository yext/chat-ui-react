import { MessageSource, useChatActions } from "@yext/chat-headless-react";
import { useCallback } from "react";

/**
 * Returns a default handler function for API errors. It will log the error and
 * add a default error message to state.
 *
 * @public
 */
export function useDefaultHandleApiError() {
  const chat = useChatActions();

  return useCallback(
    (e: unknown) => {
      console.error(e);
      chat.addMessage({
        text: "Sorry, I'm unable to respond at the moment. Please try again later!",
        source: MessageSource.BOT,
        timestamp: new Date().toISOString(),
      });
    },
    [chat]
  );
}
