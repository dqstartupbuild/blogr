import { mediaScope } from "./mediaScope";
export const trackManagedMedia = (name: string): void => { mediaScope.getStore()?.add(name); };
