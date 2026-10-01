# Plan article topics

The Topics page saves keywords and notes to the active local project. Create topics manually without a network connection. Search, filter, schedule, edit notes, and delete them from the existing list. Deleting a topic keeps an already written article and detaches the link.

Topic discovery and refreshed research briefs use optional outside research services. Review the suggestions before saving them. A brief is locked after its article is written. Research results are saved only if the topic and product have not changed during the request.

Open a topic to write with an AI provider or [start a blank article](manual-article-creation.md) without one. Topics, article links, and dates are saved under `BLOGR_HOME` and included in [backups](local-application.md).

Relevant code: `src/features/workspace/components/TopicsPanel.tsx`, `src/features/workspace/components/TopicActionDialog.tsx`, and `src/local/server/actions/`.
