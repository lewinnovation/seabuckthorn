import seabuckthorn from "../../../seabuckthorn.config.ts";
import { createWebinyBlogSource } from "../../integrations/webiny/source";
import { createMdxBlogSource } from "./mdx";
import type { ContentSource } from "./types";

export function getBlogSource(): ContentSource {
  if (seabuckthorn.cms === "webiny") {
    return createWebinyBlogSource();
  }
  return createMdxBlogSource();
}

export type { BlogPost, ContentSource } from "./types";
