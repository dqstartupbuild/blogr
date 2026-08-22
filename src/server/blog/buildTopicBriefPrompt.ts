export const buildTopicBriefPrompt = (topicBrief?: string) => {
  const trimmedTopicBrief = topicBrief?.trim();

  if (!trimmedTopicBrief) {
    return "";
  }

  return `
Search-informed brief:
${trimmedTopicBrief}

Use this brief to match search intent, answer useful questions, improve weak spots in ranking posts, and shape titles and meta descriptions. Do not copy competitor wording.
`.trim();
};
