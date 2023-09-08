import { jsxs, jsx } from 'react/jsx-runtime';
import { useChatActions } from '@yext/chat-headless-react';
import { DualSyncIcon } from '../icons/DualSync.mjs';
import { useComposedCssClasses } from '../hooks/useComposedCssClasses.mjs';
import { useState, useRef, useCallback } from 'react';
import { twMerge } from 'tailwind-merge';
import { CrossIcon } from '../icons/Cross.mjs';
import { withStylelessCssClasses } from '../utils/withStylelessCssClasses.mjs';

const builtInCssClasses = withStylelessCssClasses("Header", {
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
    const chat = useChatActions();
    const cssClasses = useComposedCssClasses(builtInCssClasses, customCssClasses);
    const [isSpinning, setIsSpinning] = useState(false);
    const restartButtonCssClasses = twMerge(cssClasses.restartButton, isSpinning ? "animate-[spin_0.3s_linear]" : "hover:scale-110");
    const clearTimerRef = useRef();
    const onRestart = useCallback(async () => {
        clearTimeout(clearTimerRef.current);
        setIsSpinning(true);
        clearTimerRef.current = setTimeout(() => {
            setIsSpinning(false);
        }, 1000);
        chat.restartConversation();
    }, [chat]);
    return (jsxs("div", { className: cssClasses.container, children: [jsx("h1", { className: cssClasses.title, children: title }), showRestartButton && (jsx("button", { "aria-label": "Restart Conversation", onClick: onRestart, className: restartButtonCssClasses, children: restartButtonIcon ?? (jsx(DualSyncIcon, { className: cssClasses.restartButtonIcon })) })), showCloseButton && (jsx("button", { "aria-label": "Close Chat", onClick: onClose, className: cssClasses.closeButton, children: closeButtonIcon ?? (jsx(CrossIcon, { className: cssClasses.closeButtonIcon })) }))] }));
}

export { ChatHeader };
//# sourceMappingURL=ChatHeader.mjs.map
