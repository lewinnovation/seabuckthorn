import seabuckthorn from "../../../seabuckthorn.config.ts";
import type { Locale } from "../../i18n/ui";

export type MarketConfig = { id: string; locale: Locale };

export function getActiveMarketId(): string | undefined {
  const fromEnv = process.env.MARKET ?? process.env.ASTRO_MARKET;
  if (fromEnv) return fromEnv;

  const markets = seabuckthorn.markets;
  if (!markets?.length) return undefined;

  if (seabuckthorn.defaultMarket) {
    return seabuckthorn.defaultMarket;
  }

  return undefined;
}

export function getMarketConfig(marketId: string): MarketConfig | undefined {
  return seabuckthorn.markets?.find((m) => m.id === marketId);
}

export function resolveContentIdForMarket(
  baseId: string,
  locale: Locale,
  marketId?: string,
): { id: string; source: "override" | "fallback" } {
  if (!marketId) {
    return { id: baseId, source: "fallback" };
  }

  const overrideId = `${locale}/markets/${marketId}/${baseId.replace(`${locale}/`, "")}`;
  return { id: overrideId, source: "override" };
}
