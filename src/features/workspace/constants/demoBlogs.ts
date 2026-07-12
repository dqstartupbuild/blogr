import type { BlogItem } from "../types/BlogItem";

const demoNow = Date.now();
const teamPrioritiesCreatedAt = demoNow - 1000 * 60 * 60 * 24 * 3;
const weeklyCheckInsCreatedAt = demoNow - 1000 * 60 * 60 * 24 * 10;

export const demoBlogs: BlogItem[] = [
  {
    createdAt: teamPrioritiesCreatedAt,
    id: "blog-team-priorities",
    keyword: "how to choose team priorities",
    title: "How to Choose Team Priorities Without Turning It Into a Meeting Marathon",
    seoTitle:
      "How to Choose Team Priorities Without Another Long Planning Meeting This Week",
    slug: "choose-team-priorities",
    excerpt:
      "Learn a simple way to choose the few priorities that matter this week, keep the team focused, and stop every task from feeling urgent.",
    tags: ["team priorities", "weekly planning", "team focus"],
    status: "ready",
    updatedAt: demoNow - 1000 * 60 * 45,
    featureImageUrl: undefined,
    images: [],
    internalLinks: [
      {
        title: "Team dashboard",
        url: "https://example.com/team-dashboard",
      },
    ],
    youtubeVideos: [
      {
        title: "How to prioritize work",
        url: "https://www.youtube.com/results?search_query=how+to+prioritize+work",
      },
    ],
    sources: [
      {
        title: "Project Management Institute",
        url: "https://www.pmi.org/",
      },
    ],
    mdx: `---
title: "How to Choose Team Priorities Without Turning It Into a Meeting Marathon"
seoTitle: "How to Choose Team Priorities Without Another Long Planning Meeting This Week"
description: "Learn a simple way to choose the few priorities that matter this week, keep the team focused, and stop every task from feeling urgent."
---

# How to Choose Team Priorities Without Turning It Into a Meeting Marathon

Most teams do not need more planning. They need a cleaner way to decide what matters right now.

The easiest place to start is with one question:

> What would make this week feel meaningfully better by Friday?

That question keeps the team out of vague strategy talk and close to real work.

## Start With the Bottleneck

Look for the thing slowing everyone down. It might be unclear ownership, too many half-finished tasks, or a launch that needs one final push.

When you name the bottleneck first, priorities get simpler.

## Pick Fewer Things

A good weekly plan should feel small enough to actually finish. Three clear priorities beat twelve hopeful ones.

## Make Ownership Obvious

Every priority needs one person who can say what happens next. That does not mean they do all the work. It means no one has to guess who is steering.

## Keep the Plan Visible

If the plan only lives in a meeting note, people will forget it. Keep it somewhere the team already checks, like your [team dashboard](https://example.com/team-dashboard).

## The Simple Rule

If a priority does not change what someone does today, it is probably too vague.
`,
  },
  {
    createdAt: weeklyCheckInsCreatedAt,
    id: "blog-weekly-team-check-ins",
    keyword: "weekly team check ins",
    title: "A Better Weekly Check-In for Busy Teams",
    seoTitle:
      "A Better Weekly Team Check-In Format for Busy Small Teams That Need Focus",
    slug: "better-weekly-team-check-in",
    excerpt:
      "Use a short weekly check-in format that helps everyone share wins, blockers, and next steps without dragging the team off track.",
    tags: ["weekly check ins", "team updates", "meeting planning"],
    status: "published",
    publishedAt: demoNow - 1000 * 60 * 60 * 24,
    updatedAt: demoNow - 1000 * 60 * 60 * 6,
    featureImageUrl: undefined,
    images: [],
    internalLinks: [
      {
        title: "Team dashboard",
        url: "https://example.com/team-dashboard",
      },
    ],
    youtubeVideos: [],
    sources: [],
    mdx: `---
title: "A Better Weekly Check-In for Busy Teams"
seoTitle: "A Better Weekly Team Check-In Format for Busy Small Teams That Need Focus"
description: "Use a short weekly check-in format that helps everyone share wins, blockers, and next steps without dragging the team off track."
---

# A Better Weekly Check-In for Busy Teams

A useful weekly check-in should help people say what changed, what is blocked, and what needs attention next.

Keep it simple: wins, blockers, and one next step.
`,
  },
];
