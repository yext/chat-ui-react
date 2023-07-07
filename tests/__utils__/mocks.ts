/* eslint-disable @typescript-eslint/no-var-requires */
import {
  ChatHeadless,
  State,
  StateSelector,
  useChatActions,
  useChatState,
} from "@yext/chat-headless-react";

export type RecursivePartial<T> = {
  [P in keyof T]?: T[P] extends undefined
    ? undefined
    : T[P] extends (infer U)[] | undefined
    ? RecursivePartial<U>[]
    : T[P] extends object | undefined
    ? RecursivePartial<T[P]>
    : T[P];
};

export function spyOnActions(): jest.Mocked<ChatHeadless> {
  const spy = jest.spyOn(
    require("@yext/chat-headless-react"),
    "useChatActions"
  );
  const proxyHandler = {
    get: (_, prop) => spy.mock.results[0].value[prop],
  };
  return new Proxy(spy, proxyHandler);
}

export function mockChatActions(
  customActions: RecursivePartial<ChatHeadless>
): jest.SpyInstance<typeof useChatActions, unknown[]> {
  return jest
    .spyOn(require("@yext/chat-headless-react"), "useChatActions")
    .mockImplementation(
      () =>
        ({
          addClientSdk: jest.fn(), //auto-mock internal function
          ...customActions,
        } as ChatHeadless)
    );
}

export function mockChatState(
  customState: RecursivePartial<State>
): jest.SpyInstance<typeof useChatState, unknown[]> {
  function mockImpl<T>(stateAccessor: StateSelector<T>) {
    return stateAccessor({
      ...customState,
    } as State);
  }
  return jest
    .spyOn(require("@yext/chat-headless-react"), "useChatState")
    .mockImplementation(mockImpl as (...args: unknown[]) => unknown);
}

export function mockChatHooks({
  mockedState,
  mockedActions,
}: {
  mockedState?: RecursivePartial<State>;
  mockedActions?: RecursivePartial<ChatHeadless>;
}) {
  mockedState && mockChatState(mockedState);
  mockedActions && mockChatActions(mockedActions);
}
