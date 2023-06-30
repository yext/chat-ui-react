import { PropsWithChildren } from "react";
import "@yext/chat-ui-react/bundle.css";

/**
 * Adds Chat styling scoped to this component and its children.
 * 
 * @remarks
 * Internaly, this will import "\@yext/chat-ui-react/bundle.css".
 * This is for use cases where the application doesn't use tailwind.
 * 
 * @public
 */
export function ChatStyleProvider({ children }: PropsWithChildren) {
  return <div className="yext-chat">{children}</div>
}