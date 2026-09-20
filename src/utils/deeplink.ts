// A deep link boots straight into one app: /happy-farm opens the `farm` window.
const DEEP_LINKS: { [path: string]: string } = {
  "/happy-farm": "farm"
};

export const deepLinkApp = (): string | null => {
  if (typeof window === "undefined") return null;

  // GitHub Pages has no SPA fallback, so 404.html bounces /happy-farm here as
  // /?p=/happy-farm; either shape resolves to the same app id.
  const bounced = new URLSearchParams(window.location.search).get("p");
  const path = (bounced ?? window.location.pathname).replace(/\/+$/, "");

  return DEEP_LINKS[path.toLowerCase()] ?? null;
};
