# Coding Guidelines

## Atomic Strict Code Splitting

This project strictly enforces an **Atomic Code Splitting** architecture. The fundamental rule of this codebase is: **One File, One Purpose.**

Every feature, function, component, type definition, and configuration must exist only within a single, dedicated file. 

### Core Rules

1. **Single Responsibility per File**: No file is allowed to do more than one thing. If a file is handling two different concepts or tasks, it must be split.
2. **Atomic Components**: Every UI component must live in its own file. Do not declare multiple components in the same file, even if they are internal or related.
3. **Atomic Functions**: Every distinct utility, hook, action, or helper function must reside in its own isolated file. 
4. **Types and Interfaces**: Type definitions should be kept in separate files from implementation logic, unless the type is exclusively used by and strictly coupled to the single export of that specific file.
5. **Constants**: Grouping constants is only acceptable if they are strictly related to a single atomic concept. Otherwise, split them.

## Reusable Atomic Abstractions

Atomic code splitting means each file should have one clear responsibility. It does not mean every feature, page, or use case needs a duplicated version of the same component, function, hook, utility, or type.

When a component or helper has one clear purpose and can serve multiple places, it should be reused across features instead of copied or split into unnecessary variants. Split the supporting behavior into focused files when the variations are meaningfully different.

For example, a single `MediaUploader` can handle media uploads while separate files define how images, videos, audio files, previews, validation, metadata, and upload progress interact with that uploader.

### Core Rules

1. **Split by Responsibility**: Separate distinct responsibilities, not every possible usage location.
2. **Reuse Clear Abstractions**: Shared components and utilities are encouraged when they have one focused purpose.
3. **Avoid Duplicate Variants**: Do not create separate files like `PhotoUploader`, `VideoUploader`, and `AudioUploader` if one reusable uploader with focused supporting files is clearer.
4. **Split When Scope Expands**: If a reusable file starts handling unrelated behavior, extract that behavior into its own focused file.

### The "Why"
- **Ultimate Maintainability**: Smaller, focused files are infinitely easier to read, understand, and debug.
- **Isolated Testing**: Single-purpose files simplify unit testing by removing hidden dependencies and side effects.
- **Conflict Reduction**: Having one purpose per file drastically reduces Git merge conflicts during parallel development.

## File Tree Organization

All new files must be added to the most relevant existing subdirectory whenever one exists. Do not place implementation files, components, utilities, types, assets, or configuration at the repository root unless they are truly root-level project files.

When a relevant subdirectory does not exist, create a narrowly named folder that matches the file's domain or feature. Keep related atomic files grouped together so the file tree remains clean, scannable, and organized.

### Core Rules

1. **Use Existing Structure First**: Follow the nearest existing folder pattern before creating a new path.
2. **No Root-Level Clutter**: Avoid adding loose files to the repo root or broad parent directories.
3. **Group by Domain or Feature**: Place files beside the code, tests, assets, or types they support.
4. **Create Focused Folders**: New directories should have clear, specific names and should not become catch-all buckets.

## Feature Documentation

Every new feature or capability must be documented in its own new `.md` file. The documentation file must explain how the feature works, what it does, the relevant code, use cases, source references, file tree, and any other details needed to understand and maintain the implementation.

When an existing feature or capability changes, any existing documentation for that feature must be updated in the same change. Documentation must always match the current implementation.

### Core Rules

1. **Document New Capabilities**: Add a dedicated `.md` file for every new feature or capability.
2. **Explain Implementation Details**: Include how the feature works, what code is involved, and how the files are organized.
3. **Include Usage Context**: Document supported use cases, important behavior, and source references.
4. **Keep Docs Current**: Update existing documentation whenever related code changes.

## User-Facing Copywriting

All copywriting must be hyper-relatable, simple to understand, human, and non-technical. This rule applies to marketing pages, landing pages, user interfaces, user-facing documents, and any other content the end user can read.

User-facing copy should explain value, action, and context in plain language. Avoid jargon, internal terminology, technical implementation details, and phrases that sound robotic or overly formal.

### Core Rules

1. **Write for Real People**: Use natural, relatable language that sounds human.
2. **Keep It Simple**: Make every sentence easy to understand without technical knowledge.
3. **Avoid Jargon**: Do not expose internal systems, engineering terms, or implementation details to end users.
4. **Prioritize Clarity**: Make actions, benefits, labels, errors, and instructions immediately understandable.

### Examples

**❌ Incorrect (Monolithic File):**
```typescript
// utils/math.ts
export const add = (a, b) => a + b;
export const subtract = (a, b) => a - b;
export const calculateTotal = (items) => /* ... */;
```

**✅ Correct (Atomic Files):**
```typescript
// utils/math/add.ts
export const add = (a, b) => a + b;

// utils/math/subtract.ts
export const subtract = (a, b) => a - b;

// utils/math/calculateTotal.ts
export const calculateTotal = (items) => /* ... */;
```

**❌ Incorrect (Multiple Components):**
```tsx
// components/ListItem.tsx
const ListItemIcon = () => <Icon />;
const ListItemText = () => <span>Text</span>;

export const ListItem = () => (
  <div>
    <ListItemIcon />
    <ListItemText />
  </div>
);
```

**✅ Correct (Atomic Components):**
```tsx
// components/ListItem/ListItemIcon.tsx
export const ListItemIcon = () => <Icon />;

// components/ListItem/ListItemText.tsx
export const ListItemText = () => <span>Text</span>;

// components/ListItem/ListItem.tsx
import { ListItemIcon } from './ListItemIcon';
import { ListItemText } from './ListItemText';

export const ListItem = () => (
  <div>
    <ListItemIcon />
    <ListItemText />
  </div>
);
```

### Enforcement
When submitting PRs or writing new code, review your files against this standard. If a file name cannot accurately and concisely describe everything inside the file without using "and", it likely needs to be split.
