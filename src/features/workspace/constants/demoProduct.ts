import type { ProductProfile } from "../types/ProductProfile";

export const demoProduct: ProductProfile = {
  name: "ClearPath",
  websiteUrl: "https://example.com",
  niche: "simple planning software for busy founders",
  audience: "small teams who want to plan work without getting buried",
  description:
    "ClearPath helps small teams turn messy ideas into a clean weekly plan. It keeps the next step obvious, gives every task an owner, and makes progress easy to spot.",
  colors: ["#2563EB", "#14B8A6", "#F97316"],
  siteLinks: [
    {
      title: "Weekly planning",
      url: "https://example.com/weekly-planning",
      reason: "Useful when a post mentions planning the week.",
    },
    {
      title: "Team dashboard",
      url: "https://example.com/team-dashboard",
      reason: "Useful when a post mentions shared progress.",
    },
    {
      title: "Pricing",
      url: "https://example.com/pricing",
      reason: "Useful near buying-intent sections.",
    },
  ],
};
