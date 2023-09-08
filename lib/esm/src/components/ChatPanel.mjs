import { jsx, jsxs } from 'react/jsx-runtime';
import { useEffect, useRef, createElement } from 'react';
import { useChatActions, useChatState } from '@yext/chat-headless-react';
import { MessageBubble } from './MessageBubble.mjs';
import { ChatInput } from './ChatInput.mjs';
import { LoadingDots } from './LoadingDots.mjs';
import { useComposedCssClasses } from '../hooks/useComposedCssClasses.mjs';
import { useDefaultHandleApiError } from '../hooks/useDefaultHandleApiError.mjs';
import { withStylelessCssClasses } from '../utils/withStylelessCssClasses.mjs';
import { useReportAnalyticsEvent } from '../hooks/useReportAnalyticsEvent.mjs';

const builtInCssClasses = withStylelessCssClasses("Panel", {
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
    const chat = useChatActions();
    const messages = useChatState((state) => state.conversation.messages);
    const loading = useChatState((state) => state.conversation.isLoading);
    const canSendMessage = useChatState((state) => state.conversation.canSendMessage);
    const cssClasses = useComposedCssClasses(builtInCssClasses, customCssClasses);
    const defaultHandleApiError = useDefaultHandleApiError();
    const reportAnalyticsEvent = useReportAnalyticsEvent();
    console.log('ChatPanel!');
    useEffect(() => {
        reportAnalyticsEvent({
            action: "CHAT_IMPRESSION",
        });
    }, [reportAnalyticsEvent]);
    // Fetch the first message on load, if there are no existing messages or a request being processed
    useEffect(() => {
        if (messages.length !== 0 || !canSendMessage) {
            return;
        }
        const { stream = false, handleError } = props;
        const res = stream ? chat.streamNextMessage() : chat.getNextMessage();
        res.catch((e) => (handleError ? handleError(e) : defaultHandleApiError(e)));
    }, [chat, props, messages, defaultHandleApiError, canSendMessage]);
    const messagesRef = useRef(null);
    // Scroll to the bottom of the chat when the messages change
    useEffect(() => {
        messagesRef.current?.scroll({
            top: messagesRef.current?.scrollHeight,
            behavior: "smooth",
        });
    }, [messages]);
    return (jsx("div", { className: "yext-chat", children: jsxs("div", { className: cssClasses.container, children: [header, jsx("div", { className: cssClasses.messagesScrollContainer, children: jsxs("div", { ref: messagesRef, className: cssClasses.messagesContainer, children: [messages.map((message, index) => (createElement(MessageBubble, { ...props, customCssClasses: cssClasses.messageBubbleCssClasses, key: index, message: message }))), loading && jsx(LoadingDots, {})] }) }), jsx("div", { className: cssClasses.inputContainer, children: jsx(ChatInput, { ...props, customCssClasses: cssClasses.inputCssClasses }) })] }) }));
}

export { ChatPanel };
//# sourceMappingURL=ChatPanel.mjs.map
