import type { WebinyGetPostResponse, WebinyListPostsResponse } from "./types";

function getWebinyConfig(): { apiUrl: string; apiToken: string } {
  const apiUrl = process.env.WEBINY_API_URL;
  const apiToken = process.env.WEBINY_API_TOKEN;

  if (!apiUrl || !apiToken) {
    throw new Error(
      "Webiny CMS is enabled (cms: \"webiny\") but WEBINY_API_URL and WEBINY_API_TOKEN are not set.",
    );
  }

  return { apiUrl, apiToken };
}

export async function webinyFetch<T>(
  query: string,
  variables?: Record<string, unknown>,
): Promise<T> {
  const { apiUrl, apiToken } = getWebinyConfig();

  const response = await fetch(apiUrl, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${apiToken}`,
    },
    body: JSON.stringify({ query, variables }),
  });

  if (!response.ok) {
    throw new Error(`Webiny API request failed: ${response.status} ${response.statusText}`);
  }

  const json = (await response.json()) as {
    data?: T;
    errors?: Array<{ message: string }>;
  };

  if (json.errors?.length) {
    throw new Error(`Webiny GraphQL error: ${json.errors.map((e) => e.message).join(", ")}`);
  }

  if (!json.data) {
    throw new Error("Webiny API returned no data.");
  }

  return json.data;
}

export type { WebinyGetPostResponse, WebinyListPostsResponse };
