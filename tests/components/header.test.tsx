import { render, fireEvent} from '@testing-library/react';
import { ChatHeader } from "../../src/components";
<<<<<<< HEAD
<<<<<<< HEAD
import { useChatActions, ChatHeadless } from '@yext/chat-headless-react';
import {RecursivePartial} from '../__utils__/mocks'

export function mockChatActions(
  customHeadless: RecursivePartial<ChatHeadless>
): jest.SpyInstance<typeof useChatActions, unknown[]> {
  return jest
    .spyOn(require('@yext/chat-headless-react'), 'useChatActions')
    .mockImplementation(() => customHeadless as ChatHeadless);
}


// Mock the headless object
const mockedHeadless = {
  restartConversation: jest.fn(),
  getNextMessage: jest.fn(),
};

describe('refresh button', () => {

  beforeEach(()=>mockChatActions(mockedHeadless));
=======
import { useChatActions } from '@yext/chat-headless-react';
=======
import { useChatActions, ChatHeadless } from '@yext/chat-headless-react';
import {RecursivePartial} from '../__utils__/mocks'
>>>>>>> 455b72f (improve tests, use add utils)

export function mockChatActions(
  customHeadless: RecursivePartial<ChatHeadless>
): jest.SpyInstance<typeof useChatActions, unknown[]> {
  return jest
    .spyOn(require('@yext/chat-headless-react'), 'useChatActions')
    .mockImplementation(() => customHeadless as ChatHeadless);
}


// Mock the headless object
const mockedHeadless = {
  restartConversation: jest.fn(),
  getNextMessage: jest.fn(),
};

describe('refresh button', () => {
<<<<<<< HEAD
>>>>>>> c9c1689 (Add Header component)
=======

  beforeEach(()=>mockChatActions(mockedHeadless));
>>>>>>> 455b72f (improve tests, use add utils)
  it('should call chat headless functions', () => {

    const { container } = render(
      <ChatHeader
        title="Clippy's Chatbot" 
        showRefreshButton={true}
      />
    )
<<<<<<< HEAD
<<<<<<< HEAD
    expect(useChatActions).toHaveBeenCalledTimes(1);
=======
>>>>>>> c9c1689 (Add Header component)
=======
    expect(useChatActions).toHaveBeenCalledTimes(1);
>>>>>>> 455b72f (improve tests, use add utils)

    const buttonElement = container.querySelector('button');
    expect(buttonElement).not.toBeNull()
    if (buttonElement !== null) {
      fireEvent.click(buttonElement);
    }

    const headless = useChatActions();
    expect(headless.restartConversation).toHaveBeenCalledTimes(1);
    expect(headless.getNextMessage).toHaveBeenCalledTimes(1);
  });

  it('should not exist', () => {
    const { container } = render(<ChatHeader
      title="Clippy's Chatbot" 
    />)
<<<<<<< HEAD
<<<<<<< HEAD
    
    expect(useChatActions).toHaveBeenCalledTimes(1);
=======
>>>>>>> c9c1689 (Add Header component)
=======
    
    expect(useChatActions).toHaveBeenCalledTimes(1);
>>>>>>> 455b72f (improve tests, use add utils)

    const buttonElement = container.querySelector('button');
    expect(buttonElement).toBeNull()
  });
});