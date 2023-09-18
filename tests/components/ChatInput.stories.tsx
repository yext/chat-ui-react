import type { Meta, StoryObj } from "@storybook/react";
import { within, userEvent } from "@storybook/testing-library";
import { ChatInput } from "../../src";
import { DummyChatHeadlessProvider } from "../__utils__/stories";

const meta: Meta<typeof ChatInput> = {
  title: "ChatInput",
  component: ChatInput,
};
export default meta;

export const Primary: StoryObj<typeof meta> = {
  render: (args) => (
    <DummyChatHeadlessProvider>
      <ChatInput {...args} />
    </DummyChatHeadlessProvider>
  ),
};

export const InputWithText: StoryObj<typeof meta> = {
  ...Primary,
  play: ({ canvasElement }) => {
    const canvas = within(canvasElement);
    userEvent.type(canvas.getByRole("textbox"), "my message");
  },
};
