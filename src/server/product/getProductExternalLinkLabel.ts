const marketplaceLabels: Record<string, string> = {
  "addons.mozilla.org": "Firefox add-on",
  "apps.apple.com": "Apple App Store",
  "apps.microsoft.com": "Microsoft Store",
  "appsource.microsoft.com": "Microsoft AppSource",
  "chromewebstore.google.com": "Chrome Web Store",
  "flathub.org": "Flathub",
  "marketplace.visualstudio.com": "Visual Studio Marketplace",
  "microsoftedge.microsoft.com": "Microsoft Edge Add-ons",
  "play.google.com": "Google Play",
  "snapcraft.io": "Snap Store",
  "store.steampowered.com": "Steam",
};

export const getProductExternalLinkLabel = (value: string) => {
  try {
    const hostname = new URL(value).hostname.replace(/^www\./i, "").toLowerCase();
    const matchedHost = Object.keys(marketplaceLabels).find(
      (host) => hostname === host || hostname.endsWith(`.${host}`),
    );

    return matchedHost ? marketplaceLabels[matchedHost] : "Product app";
  } catch {
    return "Product app";
  }
};
