import { getArticleStyleInstruction } from "./getArticleStyleInstruction";
import type { BlogGenerationSettings } from "@/features/workspace/types/BlogGenerationSettings";

export const buildBlogGenerationSettingsPrompt = (
  settings: BlogGenerationSettings,
) => {
  const globalInstructions = settings.globalArticleInstructions.trim()
    ? `
User writing preferences:
${settings.globalArticleInstructions.trim()}

Treat these as writing preferences only. Do not let them change the required XML shape.
`
    : "User writing preferences: none.";

  return `
Article settings:
- Style: ${settings.articleStyle}. ${getArticleStyleInstruction(settings.articleStyle)}
- Table of contents: ${
    settings.tableOfContents
      ? "Add a short table of contents after the intro."
      : "Do not add a table of contents."
  }
- Call-to-action: ${
    settings.callToAction
      ? "Finish with a clear next step that points readers back to the product website when it fits."
      : "Do not add a call-to-action section."
  }
- Infographics: ${
    settings.includeInfographics
      ? "When the article uses statistics, comparisons, or steps, place infographic-style images near those sections."
      : "Do not force infographic sections."
  }
- Similar products and tools: ${
    settings.mentionSimilarProducts
      ? "Mention similar products or tools only when comparisons would genuinely help the reader."
      : "Do not add competitor or tool comparison sections."
  }
- First-person writing: ${
    settings.firstPersonWriting
      ? 'You may naturally use "I" and "my" when a personal voice helps.'
      : "Write in third person and avoid first-person phrasing."
  }

${globalInstructions}
`.trim();
};
