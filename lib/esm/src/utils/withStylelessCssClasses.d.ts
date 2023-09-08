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
export declare function withStylelessCssClasses<ClassInterface extends Partial<Record<keyof ClassInterface, string | object>>>(componentName: string, builtInClasses: Readonly<Required<ClassInterface>>): ClassInterface;
//# sourceMappingURL=withStylelessCssClasses.d.ts.map