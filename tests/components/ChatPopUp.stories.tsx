import type { Meta, StoryObj } from "@storybook/react";
import { within, userEvent } from "@storybook/testing-library";
import { ChatPopUp } from "../../src";
import { DummyChatHeadlessProvider } from "../__utils__/stories";

const meta: Meta<typeof ChatPopUp> = {
  title: "ChatPopUp",
  component: ChatPopUp,
};
export default meta;

/**
 * This is a workaround for storybook's issue with "position: fixed" leaked out of preview container
 * https://github.com/storybookjs/storybook/issues/8011#issuecomment-557016621
 * https://github.com/storybookjs/storybook/issues/16774
 */
const styles = {
  transform: "scale(1)",
  height: "80vh",
};

export const PopupButton: StoryObj<typeof meta> = {
  render: (args) => (
    <DummyChatHeadlessProvider>
      <div style={styles}>
        <ChatPopUp {...args} />
      </div>
    </DummyChatHeadlessProvider>
  ),
  args: {
    title: "My Chatbot",
  },
};

export const PopupPanel: StoryObj<typeof meta> = {
  ...PopupButton,
  play: ({ canvasElement }) => {
    const canvas = within(canvasElement);
    userEvent.click(canvas.getByLabelText("Chat Popup Button"));
  },
};
