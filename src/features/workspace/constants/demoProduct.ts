import type { ProductProfile } from "../types/ProductProfile";
import { emptyBlogPublishingIntegration } from "./emptyBlogPublishingIntegration";

export const demoProduct: ProductProfile = {
  blogPublishingIntegration: emptyBlogPublishingIntegration,
  name: "ClearPath",
  websiteUrl: "https://example.com",
  niche: "simple planning software for busy founders",
  audience: "small teams who want to plan work without getting buried",
  description:
    "ClearPath helps small teams turn messy ideas into a clean weekly plan. It keeps the next step obvious, gives every task an owner, and makes progress easy to spot.",
  competitors: "Asana, Trello",
  colors: ["#000000", "#ffffff"],
  externalLinks: [
    {
      label: "iPhone and iPad app",
      url: "https://apps.apple.com/app/clearpath/id123456789",
    },
  ],
  features: [
    "Weekly planning",
    "Shared team dashboard",
    "Simple task ownership",
  ],
  offers: ["14-day free trial"],
  pricing: [
    {
      billingPeriod: "per month",
      details: "For small teams",
      name: "Team",
      price: "$12",
    },
  ],
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
