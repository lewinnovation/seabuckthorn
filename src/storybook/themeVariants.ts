import seabuckthorn from "../../seabuckthorn.config.ts";

type Theme = (typeof seabuckthorn.themes)[number];

export function themeStoryGlobals(theme: Theme) {
  return { globals: { theme } };
}

export const defaultThemeLabels = {
  light: "Light",
  dark: "Dark",
  "high-contrast": "High contrast",
} as const;

export const sampleNavItems = [
  { label: "Home", href: "/" },
  { label: "Blog", href: "/blog/" },
  { label: "About", href: "/#about" },
];

export const sampleLocaleItems = [
  { label: "English", href: "/" },
  { label: "Français", href: "/fr/" },
  { label: "Deutsch", href: "/de/" },
];
