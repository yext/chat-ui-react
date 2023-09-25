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

const YextLogo = () => {
  return (
    <svg
      width="48"
      height="48"
      viewBox="0 0 48 48"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      className="chat-yext-logo"
    >
      <path
        fillRule="evenodd"
        clipRule="evenodd"
        d="M8.16003 23.9779C8.16003 15.242 15.252 8.15991 24 8.15991C32.7481 8.15991 39.84 15.242 39.84 23.9779C39.84 32.7139 32.7481 39.796 24 39.796C15.252 39.796 8.16003 32.7139 8.16003 23.9779ZM9.42723 23.9779C9.42723 32.0153 15.9516 38.5305 24 38.5305C32.0485 38.5305 38.5728 32.0153 38.5728 23.9779C38.5728 15.9406 32.0485 9.42535 24 9.42535C15.9516 9.42535 9.42723 15.9406 9.42723 23.9779Z"
        fill="white"
      />
      <path
        d="M24.4752 25.7178H27.3264V31.4123H28.5936V25.7178H31.4448V24.4524H24.4752V25.7178Z"
        fill="white"
      />
      <path
        d="M22.787 24.2942L20.0401 27.0377L17.2931 24.2942L16.3969 25.1892L19.1442 27.9323L16.3969 30.6754L17.2931 31.5705L20.0401 28.8269L22.787 31.5705L23.6833 30.6754L20.9359 27.9323L23.6833 25.1892L22.787 24.2942Z"
        fill="white"
      />
      <path
        fillRule="evenodd"
        clipRule="evenodd"
        d="M31.4449 19.9444C31.4449 21.9098 29.849 23.5034 27.8809 23.5034C25.9123 23.5034 24.3169 21.9102 24.3169 19.9448C24.3169 17.9794 25.9123 16.3857 27.8809 16.3857C29.1349 16.3857 30.2367 17.033 30.872 18.0106L29.9445 18.9368L26.872 22.0051C27.1765 22.1541 27.5188 22.238 27.8809 22.238C29.1494 22.238 30.1777 21.2111 30.1777 19.9444H31.4449ZM29.0935 17.997C28.7415 17.7777 28.3262 17.6507 27.8809 17.6507C26.6124 17.6507 25.5841 18.6776 25.5845 19.9444C25.5845 20.389 25.7113 20.8038 25.9308 21.1553L29.0935 17.997Z"
        fill="white"
      />
      <path
        d="M20.0401 19.5656L17.3675 16.3853L16.3969 17.1986L19.4065 20.7805V23.5034H20.6737V20.7805L23.6833 17.1986L22.7126 16.3853L20.0401 19.5656Z"
        fill="white"
      />
    </svg>
  );
};

const Header = () => {
  return (
    <div className="flex items-center bg-black p-1 rounded-t-3xl">
      <YextLogo />
      <h1 className="text-white ps-2">This is a custom header</h1>
    </div>
  );
};

const Footer = () => {
  return (
    <p className="pb-4 text-center text-slate-400 text-[12px]">
      This is a footer
    </p>
  );
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

export const PopupPanelWithCustomHeaderAndFooter: StoryObj<typeof meta> = {
  ...PopupButton,
  play: ({ canvasElement }) => {
    const canvas = within(canvasElement);
    userEvent.click(canvas.getByLabelText("Chat Popup Button"));
  },
  args: {
    header: <Header />,
    footer: <Footer />,
  },
};
