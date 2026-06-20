import {
  mutationGeneric,
  queryGeneric,
  type GenericDataModel,
  type GenericMutationCtx,
  type GenericQueryCtx,
} from "convex/server";

export const query = queryGeneric;

export const mutation = mutationGeneric;

export type QueryCtx = GenericQueryCtx<GenericDataModel>;

export type MutationCtx = GenericMutationCtx<GenericDataModel>;
