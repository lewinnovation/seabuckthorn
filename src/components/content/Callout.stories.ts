import Callout from "./Callout.astro";

export default {
  title: "Content/Callout",
  component: Callout,
  tags: ["!test"],
  parameters: {
    layout: "padded",
  },
  args: {
    type: "info",
  },
};

export const Info = {
  render: (args: { type?: "info" | "warning" }) => ({
    ...args,
    slots: {
      default:
        "MDX content collections, locale-aware routing, and design tokens are included.",
    },
  }),
};

export const Warning = {
  args: {
    type: "warning",
  },
  render: (args: { type?: "info" | "warning" }) => ({
    ...args,
    slots: {
      default: "High-contrast theme is recommended for accessibility testing.",
    },
  }),
};
