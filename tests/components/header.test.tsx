import { render, fireEvent} from '@testing-library/react';
import { ChatHeader } from "../../src/components";
import { useChatActions } from '@yext/chat-headless-react';

  jest.mock('@yext/chat-headless-react', () => {

    // Mock the headless object
    const mockedHeadless = {
      restartConversation: jest.fn(),
      getNextMessage: jest.fn(),
    };

   return {useChatActions: () => mockedHeadless};
  });
  

describe('refresh button', () => {
  it('should call chat headless functions', () => {

    const { container } = render(
      <ChatHeader
        title="Clippy's Chatbot" 
        showRefreshButton={true}
      />
    )

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

    const buttonElement = container.querySelector('button');
    expect(buttonElement).toBeNull()
  });
});