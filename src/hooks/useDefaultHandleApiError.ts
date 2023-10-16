import { MessageSource, useChatActions} from "@yext/chat-headless-react";
import { useCallback } from "react";

/**
 * The default error message
 */
const defaultErrorMessage = {
  text: "Sorry, I'm unable to respond at the moment. Please try again later!",
  source: MessageSource.BOT,
  timestamp: new Date().toISOString(),
}

/**
 * Returns a default handler function for API errors. It will log the error and
 * add a default error message to state.
 *
 * @internal
 */
export function useDefaultHandleApiError() {
  const chat = useChatActions();

  return useCallback(
    (e: unknown) => {
      console.error(e);
      chat.addMessage(defaultErrorMessage);
    },
    [chat]
  );
}


/**
 * Returns a default handler function for errors with the initial message. It will log the error and
 * set the headless messages state to a default error message.
 *
 * @internal
 */
export function useDefaultInitialMessageError() {
  const chat = useChatActions();

  return useCallback(
    (e: unknown) => {
      console.error(e);
      chat.setMessages([defaultErrorMessage]);
    },
    [chat]
  );
}
