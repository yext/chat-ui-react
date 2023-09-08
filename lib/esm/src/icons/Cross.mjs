import { jsxs, jsx } from 'react/jsx-runtime';

function CrossIcon({ className }) {
    return (jsxs("svg", { width: "100%", height: "100%", viewBox: "0 0 20 20", stroke: "currentColor", className: className, xmlns: "http://www.w3.org/2000/svg", children: [jsx("path", { d: "M14 14L6 6", strokeLinecap: "square", strokeLinejoin: "round" }), jsx("path", { d: "M14 6L6 14", strokeLinecap: "square", strokeLinejoin: "round" })] }));
}

export { CrossIcon };
//# sourceMappingURL=Cross.mjs.map
