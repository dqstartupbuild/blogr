import type { TopicDiscoveryExistingBlog } from "./types/TopicDiscoveryExistingBlog";
import type { TopicDiscoveryProduct } from "./types/TopicDiscoveryProduct";

type BuildCalendarKeywordSuggestionPromptOptions = {
  existingBlogs: TopicDiscoveryExistingBlog[];
  existingTopics: string[];
  product: TopicDiscoveryProduct;
  targetCount: number;
};

export const buildCalendarKeywordSuggestionPrompt = ({
  existingBlogs,
  existingTopics,
  product,
  targetCount,
}: BuildCalendarKeywordSuggestionPromptOptions) => {
  return `
Return JSON only. Do not include markdown fences.

Create exactly ${targetCount} distinct SEO keyword ideas for this product's content calendar.

These are candidate phrases, not measured search-volume claims. Write what a real person might naturally type into a search box. Use the product profile to understand the problem, desired outcome, use cases, category, and audience, but never paste the full niche, description, or audience into a keyword.

Requirements:
- Use plain customer language.
- Mix short keywords of 2 to 4 words with natural long-tail keywords of 5 to 10 words.
- Cover different problems, questions, goals, use cases, comparisons, and stages of awareness.
- Keep each keyword under 80 characters and 10 words.
- Make each keyword useful for an article that can honestly connect to the product.
- Avoid repeating the same core phrase with one word changed.
- Avoid stuffing words such as checklist, framework, workflow, guide, template, metrics, setup, or review into every keyword.
- Do not invent search volume, difficulty, rankings, trends, or SERP evidence.
- Do not return article headlines, title-case marketing copy, or the product's full audience description.
- Do not return any existing topic or article keyword.

Required JSON shape:
{
  "keywords": [
    {
      "keyword": "natural search phrase",
      "readerNeed": "what the reader wants to learn or solve",
      "reason": "why this topic fits the product"
    }
  ]
}

Product:
${JSON.stringify(
  {
    audience: product.audience,
    competitors: product.competitors,
    description: product.description,
    name: product.name,
    niche: product.niche,
    siteLinks: product.siteLinks?.slice(0, 20),
    websiteUrl: product.websiteUrl,
  },
  null,
  2,
)}

Existing topics:
${JSON.stringify(existingTopics.slice(0, 150), null, 2)}

Existing article keywords:
${JSON.stringify(
  existingBlogs
    .map((blog) => blog.keyword || blog.title)
    .filter(Boolean)
    .slice(0, 150),
  null,
  2,
)}
`.trim();
};
