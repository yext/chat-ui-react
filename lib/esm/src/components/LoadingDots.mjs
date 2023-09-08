import { jsxs, jsx } from 'react/jsx-runtime';
import { twMerge } from 'tailwind-merge';

/**
 * A component that signifies loading status.
 *
 * @internal
 */
function LoadingDots({ className }) {
    return (jsxs("div", { "aria-label": "Loading Indicator", className: twMerge("flex gap-1 p-2 animate-fade-in", className), children: [jsx("div", { className: "w-2 h-2 bg-slate-500 rounded-full animate-[bounce_1s_infinite]" }), jsx("div", { className: "w-2 h-2 bg-slate-500 rounded-full animate-[bounce_1s_infinite_0.3s]" }), jsx("div", { className: "w-2 h-2 bg-slate-500 rounded-full animate-[bounce_1s_infinite_0.6s]" })] }));
}

export { LoadingDots };
//# sourceMappingURL=LoadingDots.mjs.map
