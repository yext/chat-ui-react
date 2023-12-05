import { ChatHeadless, useChatActions } from "@yext/chat-headless-react";
import { version } from "../../package.json";
import { useCallback } from "react";

/**
 * Returns a function to send requests to Yext Analytics API.
 *
 * @public
 */
export function useReportAnalyticsEvent(): ChatHeadless["report"] {
  const chat = useChatActions();
  chat.addClientSdk({
    CHAT_UI_REACT: version,
  });
  return useCallback((payload) => chat.report(payload), [chat]);
}
