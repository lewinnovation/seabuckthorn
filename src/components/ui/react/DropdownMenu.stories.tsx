import type { Meta, StoryObj } from "@storybook/react";
import { expect, userEvent, waitFor, within } from "storybook/test";
import { DropdownMenu } from "./DropdownMenu";
import {
  sampleLocaleItems,
  sampleNavItems,
  themeStoryGlobals,
  keyboardStoryParams,
} from "../../../storybook/themeVariants";

const meta = {
  title: "UI/React/DropdownMenu",
  component: DropdownMenu,
  tags: ["test"],
  parameters: {
    layout: "centered",
    renderer: "react",
  },
  args: {
    buttonLabel: "Menu",
    items: sampleNavItems,
    align: "left",
  },
} satisfies Meta<typeof DropdownMenu>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {};

export const RightAligned: Story = {
  args: {
    align: "right",
    buttonLabel: "Language",
    items: sampleLocaleItems,
  },
};

export const Keyboard: Story = {
  parameters: keyboardStoryParams,
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement);
    const button = canvas.getByRole("button", { name: "Menu" });

    button.focus();
    await userEvent.keyboard("{Enter}");

    const menu = await within(document.body).findByRole("menu");
    expect(menu).toBeInTheDocument();

    await userEvent.keyboard("{ArrowDown}");
    await userEvent.keyboard("{Escape}");
    await waitFor(() => {
      expect(within(document.body).queryByRole("menu")).not.toBeInTheDocument();
    });
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
