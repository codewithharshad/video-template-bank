import type { Appearance } from "@clerk/types";
import { clerkAppearance } from "./clerk-appearance";

/** Auth form appearance — hides Clerk footer since AuthPageShell has cross-links. */
export const clerkAuthFormAppearance: Appearance = {
  ...clerkAppearance,
  elements: {
    ...clerkAppearance.elements,
    footer: "hidden",
    footerAction: "hidden",
  },
};
