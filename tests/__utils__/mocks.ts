import { useChatActions, ChatHeadless } from '@yext/chat-headless-react';

export type RecursivePartial<T> = {
  [P in keyof T]?:
  T[P] extends undefined ? undefined :
    T[P] extends ((infer U)[] | undefined) ? RecursivePartial<U>[] :
      T[P] extends (object | undefined) ? RecursivePartial<T[P]> :
        T[P];
};