'use strict';

var jsxRuntime = require('react/jsx-runtime');
var chatHeadlessReact = require('@yext/chat-headless-react');
var DualSync = require('../icons/DualSync.js');
var useComposedCssClasses = require('../hooks/useComposedCssClasses.js');
var react = require('react');
var tailwindMerge = require('tailwind-merge');
var Cross = require('../icons/Cross.js');
var withStylelessCssClasses = require('../utils/withStylelessCssClasses.js');

const builtInCssClasses = withStylelessCssClasses.withStylelessCssClasses("Header", {
    container: "w-full pl-4 pr-3 py-3 flex justify-between bg-gradient-to-tr from-blue-600 to-blue-800",
    title: "text-white text-xl font-medium truncate pr-1",
    restartButton: "w-8 h-8 ml-auto shrink-0 flex justify-center items-center",
    restartButtonIcon: "text-white stroke-[0.2] w-[26px] h-[26px]",
    closeButton: "w-8 h-8 hover:scale-110 shrink-0 flex justify-center items-center",
    closeButtonIcon: "text-white w-[26px] h-[26px]",
});
/**
 * A component that renders the header of a chat bot panel,
 * including the title and a button to reset the conversation.
 *
 * @public
 *
 * @param props - {@link ChatHeaderProps}
 */
function ChatHeader({ title, showRestartButton, restartButtonIcon, showCloseButton, closeButtonIcon, onClose, customCssClasses, }) {
    const chat = chatHeadlessReact.useChatActions();
    const cssClasses = useComposedCssClasses.useComposedCssClasses(builtInCssClasses, customCssClasses);
    const [isSpinning, setIsSpinning] = react.useState(false);
    const restartButtonCssClasses = tailwindMerge.twMerge(cssClasses.restartButton, isSpinning ? "animate-[spin_0.3s_linear]" : "hover:scale-110");
    const clearTimerRef = react.useRef();
    const onRestart = react.useCallback(async () => {
        clearTimeout(clearTimerRef.current);
        setIsSpinning(true);
        clearTimerRef.current = setTimeout(() => {
            setIsSpinning(false);
        }, 1000);
        chat.restartConversation();
    }, [chat]);
    return (jsxRuntime.jsxs("div", { className: cssClasses.container, children: [jsxRuntime.jsx("h1", { className: cssClasses.title, children: title }), showRestartButton && (jsxRuntime.jsx("button", { "aria-label": "Restart Conversation", onClick: onRestart, className: restartButtonCssClasses, children: restartButtonIcon ?? (jsxRuntime.jsx(DualSync.DualSyncIcon, { className: cssClasses.restartButtonIcon })) })), showCloseButton && (jsxRuntime.jsx("button", { "aria-label": "Close Chat", onClick: onClose, className: cssClasses.closeButton, children: closeButtonIcon ?? (jsxRuntime.jsx(Cross.CrossIcon, { className: cssClasses.closeButtonIcon })) }))] }));
}

exports.ChatHeader = ChatHeader;
//# sourceMappingURL=ChatHeader.js.map
