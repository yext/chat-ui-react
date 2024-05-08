import { useEffect } from "react";
import { useChatState, useChatActions } from "@yext/chat-headless-react";
import { useDefaultHandleApiError } from "../hooks/useDefaultHandleApiError";

/**
 * Sends a request to Chat API to fetch the initial message when the
 * conversation first start or when the message history is reset.
 *
 * @internal
 *
 * @param handleError - A function which is called when an error occurs while fetching for initial message.
 *                      By default, the error is logged to the console and an error message is added to state.
 * @param stream      - Enable streaming behavior by making a request to Chat Streaming API. Defaults to false.
 * @param customCondition - additional condition for when to fetch initial message
 */
export function useFetchInitialMessage(
  handleError?: (e: unknown) => void,
  stream = false,
  customCondition = true,
) {
  const chat = useChatActions();
  const defaultHandleApiError = useDefaultHandleApiError();
  const messages = useChatState((state) => state.conversation.messages);
  const canSendMessage = useChatState(
    (state) => state.conversation.canSendMessage
  );
  
  useEffect(() => {
    if (messages.length !== 0 || !canSendMessage || !customCondition) {
      return;
    }
    const res = stream ? chat.streamNextMessage() : chat.getNextMessage();
    res.catch((e) => (handleError ? handleError(e) : defaultHandleApiError(e)));
  }, [chat, stream, handleError, defaultHandleApiError, canSendMessage, customCondition, messages.length]);
}
