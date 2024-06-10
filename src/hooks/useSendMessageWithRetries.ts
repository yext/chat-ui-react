import { ApiError, useChatActions } from "@yext/chat-headless-react";
import { useCallback } from "react";

/**
 * Returns a function that sends a message to the chat API with retries
 * if the API returns a 5xx status code.
 *
 * @remarks
 * The function will throw the error if the maximum number of retries is reached
 * or if the error is not a 5xx status code.
 *
 * @internal
 *
 * @param stream - If true, use streaming API
 * @param maxRetries - Maximum number of retries
 * @param onRetry - Callback to handle error on each retry
 *
 */
export function useSendMessageWithRetries(
  stream = false,
  maxRetries = 0,
  onRetry?: (e: unknown) => void
): (input: string) => Promise<void> {
  const chat = useChatActions();
  return useCallback(
    async (input: string) => {
      let err: unknown;
      let text = input;
      for (let numRetries = 0; numRetries <= maxRetries; numRetries++) {
        if (numRetries > 0 && !!err) {
          if (
            err instanceof ApiError &&
            !!err.statusCode &&
            err.statusCode >= 500
          ) {
            onRetry?.(err);
            // avoid re-adding user message to conversation history on retry
            text = "";
          } else {
            throw err;
          }
        }
        try {
          await (stream
            ? chat.streamNextMessage(text)
            : chat.getNextMessage(text));
          return;
        } catch (e) {
          err = e;
        }
      }
      throw err;
    },
    [chat, maxRetries, onRetry, stream]
  );
}
