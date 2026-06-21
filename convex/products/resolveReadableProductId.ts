import type { Id } from "../_generated/dataModel";
import type { QueryCtx } from "../_generated/server";
import { resolveActiveProductId } from "./resolveActiveProductId";

export const resolveReadableProductId = async (
  ctx: QueryCtx,
  userId: string,
  productId?: Id<"products">,
) => {
  try {
    return await resolveActiveProductId(ctx, userId, productId);
  } catch {
    return await resolveActiveProductId(ctx, userId);
  }
};
