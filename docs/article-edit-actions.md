# Article Edit Actions

## Overview

The article editor focuses on editing and saving an existing article. Refresh Ideas and Publish are available from the article lists and previews, where those actions have the context a user expects, but they are not shown inside Edit Article.

## Behavior

- The editor header keeps Back to Articles, Download, and Save.
- Refresh Ideas is not shown while editing an article.
- Publish is not shown while editing an article.
- Publishing remains available from article previews.

## Relevant Code

- `src/features/workspace/components/BlogEditorHeader.tsx`
- `src/features/workspace/components/BlogEditorView.tsx`
- `src/features/workspace/hooks/useBlogEditor.ts`

## File Tree

```text
src/features/workspace/
├── components/
│   ├── BlogEditorHeader.tsx
│   └── BlogEditorView.tsx
└── hooks/
    └── useBlogEditor.ts
```
