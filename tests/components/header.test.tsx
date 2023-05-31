import { render, fireEvent} from '@testing-library/react';
import { ChatHeader } from "../../src/components";
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
  it('should call chat headless functions', () => {

    const { container } = render(
      <ChatHeader
        title="Clippy's Chatbot" 
        showRefreshButton={true}
      />
    )
    expect(useChatActions).toHaveBeenCalledTimes(1);

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
    
    expect(useChatActions).toHaveBeenCalledTimes(1);

    const buttonElement = container.querySelector('button');
    expect(buttonElement).toBeNull()
  });
});