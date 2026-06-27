import type { Appearance } from "@clerk/types";

/** Dark theme aligned with Animably's zinc + amber design system. */
export const clerkAppearance: Appearance = {
  variables: {
    colorBackground: "transparent",
    colorInputBackground: "#09090b",
    colorInputText: "#fafafa",
    colorText: "#fafafa",
    colorTextSecondary: "#a1a1aa",
    colorPrimary: "#fbbf24",
    colorDanger: "#f87171",
    colorSuccess: "#34d399",
    colorNeutral: "#a1a1aa",
    borderRadius: "0.75rem",
    fontFamily: "var(--font-inter), Inter, ui-sans-serif, system-ui, sans-serif",
    fontSize: "0.875rem",
  },
  elements: {
    rootBox: "w-full",
    card: "bg-transparent shadow-none border-0 p-0 gap-6",
    cardBox: "shadow-none",
    header: "gap-1",
    headerTitle: "text-xl font-semibold text-zinc-100",
    headerSubtitle: "text-sm text-zinc-400",
    socialButtonsBlockButton:
      "h-11 border border-zinc-700 bg-zinc-950 text-zinc-100 hover:bg-zinc-800 transition-colors",
    socialButtonsBlockButtonText: "font-medium",
    dividerLine: "bg-zinc-800",
    dividerText: "text-zinc-500 text-xs",
    formFieldLabel: "text-sm font-medium text-zinc-300",
    formFieldInput:
      "h-11 border-zinc-700 bg-zinc-950 text-zinc-100 placeholder:text-zinc-600 focus:border-amber-500 focus:ring-amber-500/20",
    formButtonPrimary:
      "h-11 bg-amber-400 text-zinc-950 font-semibold hover:bg-amber-300 shadow-none transition-colors",
    footerAction: "justify-center",
    footerActionText: "text-sm text-zinc-500",
    footerActionLink: "text-amber-400 hover:text-amber-300 font-medium",
    identityPreview: "border-zinc-800 bg-zinc-900",
    identityPreviewText: "text-zinc-200",
    identityPreviewEditButton: "text-amber-400 hover:text-amber-300",
    formFieldInputShowPasswordButton: "text-zinc-400 hover:text-zinc-200",
    alertText: "text-sm",
    otpCodeFieldInput: "border-zinc-700 bg-zinc-950 text-zinc-100",
    navbar: "hidden",
    navbarMobileMenuButton: "hidden",
    profileSection: "border-zinc-800",
    profileSectionTitle: "text-zinc-100 font-semibold",
    profileSectionTitleText: "text-zinc-100",
    profileSectionContent: "border-zinc-800",
    profileSectionPrimaryButton:
      "bg-amber-400 text-zinc-950 hover:bg-amber-300 font-medium",
    accordionTriggerButton: "text-zinc-200 hover:text-white",
    badge: "bg-amber-400/15 text-amber-300 border-amber-500/30",
    menuButton: "text-zinc-300 hover:text-white",
    menuList: "border border-zinc-800 bg-zinc-900",
    menuItem: "text-zinc-200 hover:bg-zinc-800",
    tableHead: "text-zinc-400",
    formResendCodeLink: "text-amber-400 hover:text-amber-300",
    backLink: "text-zinc-400 hover:text-zinc-200",
    backIcon: "text-zinc-400",
  },
};

/** Compact appearance for embedded UserProfile in the account dashboard. */
export const clerkProfileAppearance: Appearance = {
  ...clerkAppearance,
  elements: {
    ...clerkAppearance.elements,
    rootBox: "w-full",
    card: "bg-transparent shadow-none border-0 p-0 w-full",
    pageScrollBox: "p-0",
    navbar: "hidden",
    navbarMobileMenuRow: "hidden",
    header: "hidden",
    profilePage: "gap-6",
  },
};
