/**
 * Append styleless css classnames that user can target to add custom styling to components.
 * The classes follows a format of "yext-chat-component-name__css-interface-field-name".
 *
 * @example
 * the styleless css class name for {@link MessageBubble}'s "message__bot" field defined
 * in its {@link MessageBubbleCssClasses} interface is "yext-chat-message-bubble__message__bot"
 *
 * @internal
 *
 * @param componentName - the component name
 * @param builtInClasses - built in css classnames of the component
 *
 * @returns builtInClasses with styleless css classnames
 */
function withStylelessCssClasses(componentName, builtInClasses) {
    const formatString = (str) => str.replace(/[A-Z]/g, (match) => `-${match.toLowerCase()}`);
    const classes = { ...builtInClasses };
    Object.keys(builtInClasses).forEach((key) => {
        if (typeof classes[key] === "string") {
            classes[key] = `${classes[key]} yext-chat${formatString(componentName)}__${formatString(key)}`;
        }
    });
    return classes;
}

export { withStylelessCssClasses };
//# sourceMappingURL=withStylelessCssClasses.mjs.map
