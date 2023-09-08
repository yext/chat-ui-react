'use strict';

var jsxRuntime = require('react/jsx-runtime');
var react = require('react');
var chatHeadlessReact = require('@yext/chat-headless-react');
var MessageBubble = require('./MessageBubble.js');
var LoadingDots = require('./LoadingDots.js');
var useComposedCssClasses = require('../hooks/useComposedCssClasses.js');
var useDefaultHandleApiError = require('../hooks/useDefaultHandleApiError.js');
var withStylelessCssClasses = require('../utils/withStylelessCssClasses.js');
var useReportAnalyticsEvent = require('../hooks/useReportAnalyticsEvent.js');

const builtInCssClasses = withStylelessCssClasses.withStylelessCssClasses("Panel", {
    container: "h-full w-full flex flex-col relative shadow-2xl bg-white",
    messagesScrollContainer: "flex flex-col mt-auto overflow-hidden",
    messagesContainer: "flex flex-col gap-y-1 px-4 overflow-auto",
    inputContainer: "w-full p-4",
    messageBubbleCssClasses: {
        topContainer: "first:mt-4",
    },
});
/**
 * A component that renders a full panel for chat bot interactions. This includes
 * the message bubbles for the conversation, input box with send button, and header
 * (if provided).
 *
 * @public
 *
 * @param props - {@link ChatPanelProps}
 */
function ChatPanel(props) {
    const { header, customCssClasses } = props;
    const chat = chatHeadlessReact.useChatActions();
    const messages = chatHeadlessReact.useChatState((state) => state.conversation.messages);
    const loading = chatHeadlessReact.useChatState((state) => state.conversation.isLoading);
    const canSendMessage = chatHeadlessReact.useChatState((state) => state.conversation.canSendMessage);
    const cssClasses = useComposedCssClasses.useComposedCssClasses(builtInCssClasses, customCssClasses);
    const defaultHandleApiError = useDefaultHandleApiError.useDefaultHandleApiError();
    const reportAnalyticsEvent = useReportAnalyticsEvent.useReportAnalyticsEvent();
    console.log('ChatPanel!');
    react.useEffect(() => {
        reportAnalyticsEvent({
            action: "CHAT_IMPRESSION",
        });
    }, [reportAnalyticsEvent]);
    // Fetch the first message on load, if there are no existing messages or a request being processed
    react.useEffect(() => {
        if (messages.length !== 0 || !canSendMessage) {
            return;
        }
        const { stream = false, handleError } = props;
        const res = stream ? chat.streamNextMessage() : chat.getNextMessage();
        res.catch((e) => (handleError ? handleError(e) : defaultHandleApiError(e)));
    }, [chat, props, messages, defaultHandleApiError, canSendMessage]);
    const messagesRef = react.useRef(null);
    // Scroll to the bottom of the chat when the messages change
    react.useEffect(() => {
        messagesRef.current?.scroll({
            top: messagesRef.current?.scrollHeight,
            behavior: "smooth",
        });
    }, [messages]);
    return (jsxRuntime.jsx("div", { className: "yext-chat", children: jsxRuntime.jsxs("div", { className: cssClasses.container, children: [header, jsxRuntime.jsx("div", { className: cssClasses.messagesScrollContainer, children: jsxRuntime.jsxs("div", { ref: messagesRef, className: cssClasses.messagesContainer, children: [messages.map((message, index) => (react.createElement(MessageBubble.MessageBubble, { ...props, customCssClasses: cssClasses.messageBubbleCssClasses, key: index, message: message }))), loading && jsxRuntime.jsx(LoadingDots.LoadingDots, {})] }) })] }) }));
}

exports.ChatPanel = ChatPanel;
//# sourceMappingURL=ChatPanel.js.map
