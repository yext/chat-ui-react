'use strict';

var chatHeadlessReact = require('@yext/chat-headless-react');
var _package = require('../../package.json.js');
var react = require('react');

/**
 * Returns a function to send requests to Yext Analytics API.
 * The payload will automatically includes chat-ui-react's
 * package version for "clientSdk" field.
 *
 * @internal
 */
function useReportAnalyticsEvent() {
    const chat = chatHeadlessReact.useChatActions();
    chat.addClientSdk({
        CHAT_UI_REACT: _package.version,
    });
    return react.useCallback((payload) => chat.report(payload), [chat]);
}

exports.useReportAnalyticsEvent = useReportAnalyticsEvent;
//# sourceMappingURL=useReportAnalyticsEvent.js.map
