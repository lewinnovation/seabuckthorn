import { marked } from "marked";

marked.setOptions({
  gfm: true,
});

/** Render trusted CMS markdown to HTML (Webiny body field). */
export function renderMarkdownToHtml(markdown: string): string {
  return marked.parse(markdown, { async: false }) as string;
}
