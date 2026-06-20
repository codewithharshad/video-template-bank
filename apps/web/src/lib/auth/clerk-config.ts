/** Auth/sign-in is off until NEXT_PUBLIC_AUTH_ENABLED=true */
export function isAuthEnabled() {
  return process.env.NEXT_PUBLIC_AUTH_ENABLED === "true";
}

export function isClerkConfigured() {
  return (
    isAuthEnabled() &&
    Boolean(
      process.env.NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY &&
        process.env.CLERK_SECRET_KEY
    )
  );
}
