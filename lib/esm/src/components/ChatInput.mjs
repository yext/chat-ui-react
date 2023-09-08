import { jsx } from 'react/jsx-runtime';
import { useState, useCallback } from 'react';
import { useChatActions, useChatState } from '@yext/chat-headless-react';
import { ArrowIcon } from '../icons/Arrow.mjs';
import { useComposedCssClasses } from '../hooks/useComposedCssClasses.mjs';
import { useDefaultHandleApiError } from '../hooks/useDefaultHandleApiError.mjs';
import { withStylelessCssClasses } from '../utils/withStylelessCssClasses.mjs';

const builtInCssClasses = withStylelessCssClasses("Input", {
    container: "w-full h-fit flex flex-row relative @container",
    textArea: "w-full p-4 pr-12 border border-slate-300 rounded-3xl resize-none text-[13px] @[480px]:text-base placeholder:text-[13px] placeholder:@[480px]:text-base text-slate-900",
    sendButton: "rounded-full p-1.5 w-8 h-8 stroke-2 text-white bg-blue-600 disabled:bg-slate-200 hover:bg-blue-800 active:scale-90 transition-all absolute right-4 bottom-2.5 @[480px]:bottom-3.5",
});
/**
 * A component that allows user to input message and send to Chat API.
 *
 * @remarks
 * Pressing "Enter" key will send the current message.
 * To add a newline, press "Shift" and "Enter".
 *
 * @public
 *
 * @param props - {@link ChatInputProps}
 */
function ChatInput({ placeholder = "Type a message...", stream = false, inputAutoFocus = false, handleError, sendButtonIcon = jsx(ArrowIcon, {}), customCssClasses, }) {
    const chat = useChatActions();
    const [input, setInput] = useState("");
    const canSendMessage = useChatState((state) => state.conversation.canSendMessage);
    const defaultHandleApiError = useDefaultHandleApiError();
    const cssClasses = useComposedCssClasses(builtInCssClasses, customCssClasses);
    const sendMessage = useCallback(async () => {
        const res = stream
            ? chat.streamNextMessage(input)
            : chat.getNextMessage(input);
        setInput("");
        res.catch((e) => (handleError ? handleError(e) : defaultHandleApiError(e)));
    }, [chat, input, handleError, defaultHandleApiError, stream]);
    useCallback((e) => {
        if (!e.shiftKey && e.key === "Enter") {
            e.preventDefault();
            if (canSendMessage && input.trim().length !== 0) {
                sendMessage();
            }
        }
    }, [sendMessage, canSendMessage, input]);
    useCallback((e) => {
        setInput(e.target.value);
    }, []);
    return (jsx("div", { className: cssClasses.container, children: jsx("button", { "aria-label": "Send Message", disabled: !canSendMessage || input.trim().length === 0, onClick: sendMessage, className: cssClasses.sendButton, children: sendButtonIcon }) }));
}

export { ChatInput };
//# sourceMappingURL=ChatInput.mjs.map
