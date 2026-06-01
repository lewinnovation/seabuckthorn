/** GraphQL model/API names — adjust if your Webiny content model differs. */
export const POSTS_LIST_FIELD = "listPosts";

export const LIST_POSTS = `
  query ListPosts($locale: String!) {
    ${POSTS_LIST_FIELD}(where: { locale: $locale }) {
      data {
        slug
        title
        description
        pubDate
        locale
        draft
        body
        cover
        coverAlt
      }
    }
  }
`;

export const GET_POST_BY_SLUG = `
  query GetPostBySlug($locale: String!, $slug: String!) {
    ${POSTS_LIST_FIELD}(where: { locale: $locale, slug: $slug }) {
      data {
        slug
        title
        description
        pubDate
        locale
        draft
        body
        cover
        coverAlt
      }
    }
  }
`;
