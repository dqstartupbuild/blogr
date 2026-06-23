import type { TopicDiscoveryResult } from "../types/topicDiscovery/TopicDiscoveryResult";

export const demoTopicDiscoveryResult: TopicDiscoveryResult = {
  aeoInsights: [
    {
      productMentioned: false,
      query: "best project planning tool for small teams",
      recommendations: [
        "Answer the main question near the top.",
        "Add a short FAQ with the questions people ask most.",
      ],
      summary:
        "Search answers usually mention broad project management options, but they do not explain which one fits a lean team that wants less setup.",
    },
  ],
  clusters: [
    {
      name: "Comparison posts",
      purpose: "Help readers compare options before they choose.",
      topicTitles: [
        "Best Project Planning Tools for Small Teams",
        "Project Planning Tool Alternatives for Busy Teams",
      ],
    },
    {
      name: "Question-led posts",
      purpose: "Answer common buying questions in plain language.",
      topicTitles: ["How Do Small Teams Keep Projects on Track?"],
    },
  ],
  comparisonTopics: [
    "Best Project Planning Tools for Small Teams",
    "Project Planning Tool Alternatives for Busy Teams",
  ],
  contentGaps: [
    {
      reason:
        "Many posts list tools but do not explain which workflow each one fits.",
      source: "Organic results",
      title: "Tool lists without fit guidance",
    },
  ],
  difficultyNotes: [
    {
      level: "medium",
      query: "best project planning tool for small teams",
      reason:
        "Several known sites rank here, but a focused product-led guide can still help.",
    },
  ],
  faqQuestions: [
    "What is the easiest way to plan a small team project?",
    "How do you keep project planning simple?",
    "What should a project plan include?",
  ],
  ideas: [
    {
      angle:
        "Compare simple tools by the work a small team actually needs to do.",
      brief: {
        intent:
          "Help a small team pick a planning tool without reading a long software list.",
        sections: [
          "Start with the quickest answer",
          "Compare the common choices",
          "Explain what to avoid",
          "Give a simple picking checklist",
        ],
        sources: [],
        weakSpots: [
          "Most ranking posts are too broad.",
          "Many do not explain day-to-day fit.",
        ],
      },
      cluster: "Comparison posts",
      difficulty: "medium",
      faqQuestions: [
        "What is the easiest way to plan a small team project?",
        "What should a project plan include?",
      ],
      intent: "Help the reader choose a tool.",
      metaDescriptions: [
        "A simple guide to choosing a project planning tool for a small team, with practical examples and a clear checklist.",
      ],
      sourceSignals: ["People ask how to keep small team planning simple."],
      title: "Best Project Planning Tools for Small Teams",
      titleOptions: [
        "Best Project Planning Tools for Small Teams",
        "A Simple Guide to Project Planning Tools for Small Teams",
      ],
    },
    {
      angle:
        "Turn common questions into a practical workflow readers can copy.",
      brief: {
        intent:
          "Show readers how to keep projects organized without a heavy process.",
        sections: [
          "Define the project goal",
          "Break work into clear steps",
          "Set owners and dates",
          "Review progress without busywork",
        ],
        sources: [],
        weakSpots: ["Most advice sounds formal and hard to apply."],
      },
      cluster: "Question-led posts",
      difficulty: "low",
      faqQuestions: [
        "How do you keep project planning simple?",
        "What should a project plan include?",
      ],
      intent: "Help the reader solve a planning problem.",
      metaDescriptions: [
        "Learn a simple way to plan team projects, assign work, and keep momentum without adding extra meetings.",
      ],
      sourceSignals: ["Related searches point to simple planning workflows."],
      title: "How Do Small Teams Keep Projects on Track?",
      titleOptions: [
        "How Do Small Teams Keep Projects on Track?",
        "A Simple Way to Keep Team Projects Moving",
      ],
    },
  ],
  rawSignalsCount: 3,
  refreshSuggestions: [
    {
      blogTitle: "A Simple Guide to Team Planning",
      reason: "Search questions suggest readers want more practical examples.",
      updates: [
        "Add a short FAQ section.",
        "Add a checklist readers can use right away.",
      ],
    },
  ],
};
