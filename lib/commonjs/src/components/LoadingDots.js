'use strict';

var jsxRuntime = require('react/jsx-runtime');
var tailwindMerge = require('tailwind-merge');

/**
 * A component that signifies loading status.
 *
 * @internal
 */
function LoadingDots({ className }) {
    return (jsxRuntime.jsxs("div", { "aria-label": "Loading Indicator", className: tailwindMerge.twMerge("flex gap-1 p-2 animate-fade-in", className), children: [jsxRuntime.jsx("div", { className: "w-2 h-2 bg-slate-500 rounded-full animate-[bounce_1s_infinite]" }), jsxRuntime.jsx("div", { className: "w-2 h-2 bg-slate-500 rounded-full animate-[bounce_1s_infinite_0.3s]" }), jsxRuntime.jsx("div", { className: "w-2 h-2 bg-slate-500 rounded-full animate-[bounce_1s_infinite_0.6s]" })] }));
}

exports.LoadingDots = LoadingDots;
//# sourceMappingURL=LoadingDots.js.map
