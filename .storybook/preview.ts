import type { Preview } from "@storybook-astro/framework";
import seabuckthorn from "../seabuckthorn.config.ts";
import "../src/styles/global.css";

const preview: Preview = {
  globalTypes: {
    theme: {
      description: "Design token theme",
      toolbar: {
        title: "Theme",
        items: [...seabuckthorn.themes],
        dynamicTitle: true,
      },
    },
    locale: {
      description: "UI locale",
      toolbar: {
        title: "Locale",
        items: [...seabuckthorn.locales],
        dynamicTitle: true,
      },
    },
  },
  initialGlobals: {
    theme: seabuckthorn.defaultTheme,
    locale: seabuckthorn.defaultLocale,
  },
  decorators: [
    (Story, { globals }) => {
      document.documentElement.dataset.theme =
        (globals.theme as string) ?? seabuckthorn.defaultTheme;
      document.documentElement.lang =
        (globals.locale as string) ?? seabuckthorn.defaultLocale;
      return Story();
    },
  ],
  parameters: {
    a11y: {
      test: "error",
      config: {
        rules: [{ id: "color-contrast", enabled: true }],
      },
    },
    controls: {
      matchers: {
        color: /(background|color)$/i,
        date: /Date$/i,
      },
    },
  },
};

export default preview;
