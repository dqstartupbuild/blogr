import type { BlogItem } from "../types/BlogItem";

export const demoBlogs: BlogItem[] = [
  {
    id: "blog-team-priorities",
    keyword: "how to choose team priorities",
    title: "How to Choose Team Priorities Without Turning It Into a Meeting Marathon",
    slug: "choose-team-priorities",
    excerpt:
      "A simple way to pick what matters this week, keep the team focused, and stop every task from feeling urgent.",
    status: "ready",
    updatedAt: Date.now() - 1000 * 60 * 45,
    featureImageUrl:
      "https://images.unsplash.com/photo-1552664730-d307ca884978?auto=format&fit=crop&w=1400&q=80",
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
description: "A simple way to pick what matters this week, keep the team focused, and stop every task from feeling urgent."
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
];
