import { AsyncLocalStorage } from "node:async_hooks";
export const mediaScope = new AsyncLocalStorage<Set<string>>();
