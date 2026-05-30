import type { Meta, StoryObj } from "@storybook/react";
import { expect, userEvent, within } from "storybook/test";
import { ThemeSwitch } from "./ThemeSwitch";
import {
  defaultThemeLabels,
  themeStoryGlobals,
} from "../../../storybook/themeVariants";

const meta = {
  title: "UI/React/ThemeSwitch",
  component: ThemeSwitch,
  tags: ["test"],
  parameters: {
    layout: "centered",
    renderer: "react",
  },
  args: {
    label: "Theme",
    themeLabels: defaultThemeLabels,
  },
} satisfies Meta<typeof ThemeSwitch>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {};

export const Keyboard: Story = {
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement);
    const toggle = canvas.getByRole("switch", { name: "Theme" });

    toggle.focus();
    await userEvent.keyboard(" ");
    expect(toggle).toHaveAttribute("aria-checked", "true");

    const select = canvas.getByRole("combobox", { name: "Theme" });
    await userEvent.selectOptions(select, "high-contrast");
    expect(select).toHaveValue("high-contrast");
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
