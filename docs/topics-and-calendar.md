# Topics and calendar

## Topics

The **Topics** page lists the keywords you might write about. Add one by hand, or use **Find topic ideas**.

**Find topic ideas** uses the same keyword generator as the calendar's **AI fill**. It uses the same prompt, skips topics and articles you already have, fills gaps with fallback ideas, and runs the same Google research. It saves up to 30 new topics as unscheduled **Saved** topics. It needs `REPLICATE_API_TOKEN` and a product niche or description. Research notes need `APIFY_TOKEN`.

Open a topic to:

- **Edit brief**: hand-edit or refresh the research notes the writer uses. The brief locks once its article is written.
- **Write blog**: generate an article ([articles](articles.md)).
- **Repurpose**: paste existing text and have it rewritten as a new article for this product.
- **Start blank article**: create an empty draft without AI.
- **Add to calendar**: pick a day from the dropdown's mini calendar. Days that already have a topic show a checkmark, and past or taken days can't be picked.

## Calendar

The **Calendar** page shows a month of scheduled topics. Add a topic on an open day, schedule a saved topic, move one, or remove its date.

- **Quick fill** puts your oldest saved topics on open queue days. It works offline.
- **AI fill** creates new topics for the open queue days, using the same generator as Find topic ideas.

Both only use days that match the **calendar queue**, at most 30 per run. Set the queue in **Settings → Calendar**: daily, weekly, monthly, or every N days. Monthly and custom queues add a little date variation.

Relevant code: `src/server/topics/selectNewTopicCandidates.ts` (shared by AI fill and Find ideas), `src/app/api/topics/ideas/route.ts`, `src/app/api/topics/batch-plan/route.ts`, `src/features/workspace/utils/buildCalendarQueueDateKeys.ts`, and `src/local/server/actions/`.
