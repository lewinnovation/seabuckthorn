import { describe, expect, it, beforeEach } from "vitest";
import {
  getBlogPostPath,
  getStaticRoutePath,
  resolveLocalizedUrls,
} from "./resolve-path";
import { setBlogTranslationRegistry } from "./blog-registry";

describe("resolve-path", () => {
  beforeEach(() => {
    setBlogTranslationRegistry([
      {
        translationKey: "getting-started",
        slugs: {
          en: "first-post",
          fr: "premier-article",
          de: "erster-beitrag",
        },
      },
    ]);
  });

  it("localizes static blog index path for French", () => {
    expect(getStaticRoutePath("blog", "fr")).toBe("/fr/actualites/");
  });

  it("builds per-locale blog post paths from translation key", () => {
    expect(getBlogPostPath("en", "first-post")).toBe("/blog/first-post/");
    expect(getBlogPostPath("fr", "premier-article")).toBe(
      "/fr/actualites/premier-article/",
    );
  });

  it("resolves locale switch URLs across translated blog slugs", () => {
    const urls = resolveLocalizedUrls("/blog/first-post/", "en");
    expect(urls.find((u) => u.locale === "fr")?.href).toBe(
      "/fr/actualites/premier-article/",
    );
    expect(urls.find((u) => u.locale === "de")?.href).toBe(
      "/de/blog/erster-beitrag/",
    );
  });
});
