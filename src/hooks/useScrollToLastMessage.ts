import { useChatState } from "@yext/chat-headless-react";
import React, { useCallback, useEffect, useRef } from "react";

/**
 * Scroll the messsages container to the top of the last message whenever there's
 * an update to the messages state.
 * 
 * @public
 * 
 * @returns a ref to set on the messages container element and
 *  a function to set ref on individual message element
 */
export function useScrollToLastMessage(): [
  React.RefObject<HTMLDivElement>,
  (index: number) => ((message: HTMLDivElement) => void) | undefined
] {
  const messagesRef = useRef<Array<HTMLDivElement | null>>([]);
  const messagesContainerRef = useRef<HTMLDivElement>(null);
  const messages = useChatState((state) => state.conversation.messages);

  // Handle scrolling when messages change
  useEffect(() => {
    let scrollTop = 0;
    messagesRef.current = messagesRef.current.slice(0, messages.length);

    // Sums up scroll heights of all messages except the last one
    if (messagesRef?.current.length > 1) {
      scrollTop = messagesRef.current
        .slice(0, -1)
        .map((elem, _) => elem?.scrollHeight ?? 0)
        .reduce((total, height) => total + height);
    }

    // Scroll to the top of the last message
    messagesContainerRef.current?.scroll({
      top: scrollTop,
      behavior: "smooth",
    });
  }, [messages]);

  const setMessageRef = useCallback((index) => {
    if (!messagesRef?.current) return undefined;
    return (message: HTMLDivElement) => (messagesRef.current[index] = message);
  }, []);

  return [messagesContainerRef, setMessageRef]
}