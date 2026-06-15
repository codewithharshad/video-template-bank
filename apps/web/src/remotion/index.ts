import type { ComponentType } from "react";
import { BoldTitleHook } from "./compositions/BoldTitleHook";
import { CounterReveal } from "./compositions/CounterReveal";
import { GradientTextReveal } from "./compositions/GradientTextReveal";
import { ThreePointReveal } from "./compositions/ThreePointReveal";
import { QuoteSpotlight } from "./compositions/QuoteSpotlight";
import { ZoomTransition } from "./compositions/ZoomTransition";
import { SaasMetricCard } from "./compositions/SaasMetricCard";
import { FinanceMarketAlert } from "./compositions/FinanceMarketAlert";
import { ComparisonBars } from "./compositions/ComparisonBars";

// eslint-disable-next-line @typescript-eslint/no-explicit-any
export const COMPOSITION_REGISTRY: Record<string, ComponentType<any>> = {
  BoldTitleHook,
  CounterReveal,
  GradientTextReveal,
  ThreePointReveal,
  QuoteSpotlight,
  ZoomTransition,
  SaasMetricCard,
  FinanceMarketAlert,
  ComparisonBars,
};

export function getComposition(id: string) {
  return COMPOSITION_REGISTRY[id];
}

export {
  BoldTitleHook,
  CounterReveal,
  GradientTextReveal,
  ThreePointReveal,
  QuoteSpotlight,
  ZoomTransition,
  SaasMetricCard,
  FinanceMarketAlert,
  ComparisonBars,
};
