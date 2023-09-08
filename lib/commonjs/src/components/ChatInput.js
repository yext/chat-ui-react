'use strict';

var jsxRuntime = require('react/jsx-runtime');
var react = require('react');
var chatHeadlessReact = require('@yext/chat-headless-react');
var Arrow = require('../icons/Arrow.js');
var useComposedCssClasses = require('../hooks/useComposedCssClasses.js');
var TextareaAutosize = require('react-textarea-autosize');
var useDefaultHandleApiError = require('../hooks/useDefaultHandleApiError.js');
var withStylelessCssClasses = require('../utils/withStylelessCssClasses.js');

const builtInCssClasses = withStylelessCssClasses.withStylelessCssClasses("Input", {
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
function ChatInput({ placeholder = "Type a message...", stream = false, inputAutoFocus = false, handleError, sendButtonIcon = jsxRuntime.jsx(Arrow.ArrowIcon, {}), customCssClasses, }) {
    const chat = chatHeadlessReact.useChatActions();
    const [input, setInput] = react.useState("");
    const canSendMessage = chatHeadlessReact.useChatState((state) => state.conversation.canSendMessage);
    const defaultHandleApiError = useDefaultHandleApiError.useDefaultHandleApiError();
    const cssClasses = useComposedCssClasses.useComposedCssClasses(builtInCssClasses, customCssClasses);
    const sendMessage = react.useCallback(async () => {
        const res = stream
            ? chat.streamNextMessage(input)
            : chat.getNextMessage(input);
        setInput("");
        res.catch((e) => (handleError ? handleError(e) : defaultHandleApiError(e)));
    }, [chat, input, handleError, defaultHandleApiError, stream]);
    const handleKeyDown = react.useCallback((e) => {
        if (!e.shiftKey && e.key === "Enter") {
            e.preventDefault();
            if (canSendMessage && input.trim().length !== 0) {
                sendMessage();
            }
        }
    }, [sendMessage, canSendMessage, input]);
    const onInputChange = react.useCallback((e) => {
        setInput(e.target.value);
    }, []);
    return (jsxRuntime.jsxs("div", { className: cssClasses.container, children: [jsxRuntime.jsx(TextareaAutosize, { autoFocus: inputAutoFocus, onKeyDown: handleKeyDown, value: input, onChange: onInputChange, className: cssClasses.textArea, placeholder: placeholder }), jsxRuntime.jsx("button", { "aria-label": "Send Message", disabled: !canSendMessage || input.trim().length === 0, onClick: sendMessage, className: cssClasses.sendButton, children: sendButtonIcon })] }));
}

exports.ChatInput = ChatInput;
//# sourceMappingURL=ChatInput.js.map
