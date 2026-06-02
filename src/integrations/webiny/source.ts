import type { Locale } from "../../i18n/ui";
import type { BlogPost, ContentSource } from "../../lib/content/types";
import { webinyFetch } from "./client";
import { GET_POST_BY_SLUG, LIST_POSTS } from "./queries";
import type { WebinyGetPostResponse, WebinyListPostsResponse, WebinyPostRecord } from "./types";

function mapWebinyPost(record: WebinyPostRecord, locale: Locale): BlogPost {
  const cover =
    record.cover != null && record.cover !== ""
      ? { src: record.cover, alt: record.coverAlt ?? record.title }
      : undefined;

  return {
    slug: record.slug,
    translationKey: record.translationKey ?? record.slug,
    locale,
    title: record.title,
    description: record.description,
    pubDate: new Date(record.pubDate),
    draft: Boolean(record.draft),
    cover,
    body: record.body,
    bodyFormat: "markdown",
  };
}

function isPublished(post: BlogPost): boolean {
  return !post.draft;
}

export class WebinyBlogSource implements ContentSource {
  async list(locale: Locale): Promise<BlogPost[]> {
    const data = await webinyFetch<WebinyListPostsResponse>(LIST_POSTS, { locale });
    return data.listPosts.data
      .map((record) => mapWebinyPost(record, locale))
      .filter(isPublished);
  }

  async getBySlug(locale: Locale, slug: string): Promise<BlogPost | null> {
    const data = await webinyFetch<WebinyGetPostResponse>(GET_POST_BY_SLUG, {
      locale,
      slug,
    });
    const record = data.listPosts.data[0];
    if (!record) {
      return null;
    }
    const post = mapWebinyPost(record, locale);
    return isPublished(post) ? post : null;
  }
}

export function createWebinyBlogSource(): ContentSource {
  return new WebinyBlogSource();
}
