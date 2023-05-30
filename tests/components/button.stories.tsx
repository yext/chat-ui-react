import type { Meta, StoryObj } from "@storybook/react";
import { Button } from "../../src";

const meta: Meta<typeof Button> = {
  title: "Button",
  component: Button,
};
export default meta;

export const Primary: StoryObj<typeof meta> = {
  render: () => <Button />,
};
