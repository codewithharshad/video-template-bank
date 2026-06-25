import type { Appearance } from "@clerk/types";

/** Dark theme so Clerk forms are visible on Animably's zinc background. */
export const clerkAppearance: Appearance = {
  variables: {
    colorBackground: "#18181b",
    colorInputBackground: "#09090b",
    colorInputText: "#fafafa",
    colorText: "#fafafa",
    colorTextSecondary: "#a1a1aa",
    colorPrimary: "#fbbf24",
    colorDanger: "#f87171",
    borderRadius: "0.75rem",
  },
  elements: {
    rootBox: "mx-auto w-full max-w-md",
    card: "border border-zinc-800 bg-zinc-900 shadow-xl",
    headerTitle: "text-zinc-100",
    headerSubtitle: "text-zinc-400",
    socialButtonsBlockButton:
      "border border-zinc-700 bg-zinc-950 text-zinc-100 hover:bg-zinc-800",
    formFieldInput:
      "border-zinc-700 bg-zinc-950 text-zinc-100 focus:border-amber-500",
    formButtonPrimary:
      "bg-amber-400 text-zinc-950 hover:bg-amber-300",
    footerActionLink: "text-amber-400 hover:text-amber-300",
  },
};
