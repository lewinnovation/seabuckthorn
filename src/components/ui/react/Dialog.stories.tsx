import type { Meta, StoryObj } from "@storybook/react";
import { expect, userEvent, within } from "storybook/test";
import { Dialog } from "./Dialog";
import { themeStoryGlobals, keyboardStoryParams } from "../../../storybook/themeVariants";

const meta = {
  title: "UI/React/Dialog",
  component: Dialog,
  tags: ["test"],
  parameters: {
    layout: "centered",
    renderer: "react",
  },
  args: {
    triggerLabel: "About this template",
    title: "About Seabuckthorn",
    body: "Seabuckthorn is a starter template for fast, accessible marketing and content sites.",
    closeLabel: "Close",
  },
} satisfies Meta<typeof Dialog>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {};

export const Keyboard: Story = {
  parameters: keyboardStoryParams,
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement);
    const trigger = canvas.getByRole("button", { name: /about this template/i });

    await userEvent.click(trigger);
    const dialog = await within(document.body).findByRole("dialog");
    expect(dialog).toBeInTheDocument();

    await userEvent.keyboard("{Escape}");
    expect(within(document.body).queryByRole("dialog")).not.toBeInTheDocument();
    expect(trigger).toHaveFocus();
  },
};

export const Light: Story = {
  ...themeStoryGlobals("light"),
};

export const Dark: Story = {
  ...themeStoryGlobals("dark"),
};

export const HighContrast: Story = {
  ...themeStoryGlobals("high-contrast"),
};
