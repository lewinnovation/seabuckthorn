import SiteHeader from "./SiteHeader.astro";
import seabuckthorn from "../../seabuckthorn.config.ts";

export default {
  title: "Components/SiteHeader",
  component: SiteHeader,
  tags: ["!test"],
  parameters: {
    layout: "fullscreen",
  },
  args: {
    lang: seabuckthorn.defaultLocale,
  },
};

export const English = {
  args: {
    lang: "en",
  },
};

export const French = {
  args: {
    lang: "fr",
  },
  globals: {
    locale: "fr",
  },
};

export const German = {
  args: {
    lang: "de",
  },
  globals: {
    locale: "de",
  },
};
