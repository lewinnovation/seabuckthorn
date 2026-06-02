export interface WebinyPostRecord {
  slug: string;
  translationKey?: string | null;
  title: string;
  description: string;
  pubDate: string;
  locale: string;
  draft?: boolean | null;
  body: string;
  cover?: string | null;
  coverAlt?: string | null;
}

export interface WebinyListPostsResponse {
  listPosts: {
    data: WebinyPostRecord[];
  };
}

export interface WebinyGetPostResponse {
  listPosts: {
    data: WebinyPostRecord[];
  };
}
