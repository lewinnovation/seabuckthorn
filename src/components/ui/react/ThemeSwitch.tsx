import { Switch } from "@headlessui/react";
import { useEffect, useState } from "react";
import seabuckthorn from "../../../../seabuckthorn.config.ts";

export type Theme = (typeof seabuckthorn.themes)[number];

export type ThemeSwitchProps = {
  label: string;
  themeLabels: Record<Theme, string>;
};

function resolveTheme(): Theme {
  const stored = window.localStorage.getItem("theme");
  if (stored && seabuckthorn.themes.includes(stored as Theme)) {
    return stored as Theme;
  }
  return window.matchMedia("(prefers-color-scheme: dark)").matches
    ? "dark"
    : "light";
}

function applyTheme(theme: Theme) {
  document.documentElement.dataset.theme = theme;
  window.localStorage.setItem("theme", theme);
}

export function ThemeSwitch({ label, themeLabels }: ThemeSwitchProps) {
  const [theme, setThemeState] = useState<Theme>(seabuckthorn.defaultTheme);

  useEffect(() => {
    const initial = resolveTheme();
    setThemeState(initial);
    applyTheme(initial);
  }, []);

  const setTheme = (next: Theme) => {
    setThemeState(next);
    applyTheme(next);
  };

  const isDark = theme === "dark" || theme === "high-contrast";

  return (
    <div className="flex items-center gap-3">
      <span id="theme-switch-label" className="text-sm text-text-muted">
        {label}
      </span>
      <Switch
        checked={isDark}
        onChange={(checked) => setTheme(checked ? "dark" : "light")}
        aria-labelledby="theme-switch-label"
        className="group relative inline-flex h-6 w-11 shrink-0 cursor-pointer rounded-full border border-border-default bg-surface-secondary transition ui-checked:bg-accent ui-focus-visible:outline-focus-ring"
      >
        <span className="sr-only">{label}</span>
        <span
          aria-hidden="true"
          className="pointer-events-none inline-block size-5 translate-x-0.5 rounded-full bg-surface-primary shadow-sm ring-0 transition group-data-checked:translate-x-5"
        />
      </Switch>
      <select
        value={theme}
        onChange={(event) => setTheme(event.target.value as Theme)}
        className="rounded-md border border-border-default bg-surface-primary px-2 py-1 text-sm text-text-primary"
        aria-label={label}
      >
        {seabuckthorn.themes.map((value) => (
          <option key={value} value={value}>
            {themeLabels[value]}
          </option>
        ))}
      </select>
    </div>
  );
}

export default ThemeSwitch;
