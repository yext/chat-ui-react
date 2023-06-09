import {
  MessageSource,
  useChatActions,
  useChatState,
} from "@yext/chat-headless-react";
import { useCallback } from "react";

/**
 * Returns a default handler function for API errors. It will log the error and
 * add a default error message to state.
 *
 * @internal
 */
export function useDefaultHandleApiError() {
  const chat = useChatActions();
  const messages = useChatState((s) => s.conversation.messages);

  return useCallback(
    (e: unknown) => {
      console.error(e);
      chat.setMessages([
        ...messages,
        {
          text: "Sorry, I'm unable to respond at the moment. Please try again later!",
          source: MessageSource.BOT,
          timestamp: new Date().toISOString(),
        },
      ]);
    },
    [chat, messages]
  );
}
