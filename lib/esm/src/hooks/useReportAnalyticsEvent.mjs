import { useChatActions } from '@yext/chat-headless-react';
import { version } from '../../package.json.mjs';
import { useCallback } from 'react';

/**
 * Returns a function to send requests to Yext Analytics API.
 * The payload will automatically includes chat-ui-react's
 * package version for "clientSdk" field.
 *
 * @internal
 */
function useReportAnalyticsEvent() {
    const chat = useChatActions();
    chat.addClientSdk({
        CHAT_UI_REACT: version,
    });
    return useCallback((payload) => chat.report(payload), [chat]);
}

export { useReportAnalyticsEvent };
//# sourceMappingURL=useReportAnalyticsEvent.mjs.map
