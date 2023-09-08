'use strict';

var chatHeadlessReact = require('@yext/chat-headless-react');
var react = require('react');

/**
 * Returns a default handler function for API errors. It will log the error and
 * add a default error message to state.
 *
 * @internal
 */
function useDefaultHandleApiError() {
    const chat = chatHeadlessReact.useChatActions();
    return react.useCallback((e) => {
        console.error(e);
        chat.addMessage({
            text: "Sorry, I'm unable to respond at the moment. Please try again later!",
            source: chatHeadlessReact.MessageSource.BOT,
            timestamp: new Date().toISOString(),
        });
    }, [chat]);
}

exports.useDefaultHandleApiError = useDefaultHandleApiError;
//# sourceMappingURL=useDefaultHandleApiError.js.map
