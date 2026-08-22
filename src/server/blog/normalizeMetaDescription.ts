import { metaDescriptionLengthLimits } from "@/config/metaDescriptionLengthLimits";
import { normalizeWhitespace } from "./normalizeWhitespace";
import { truncateTextToMaxLength } from "./truncateTextToMaxLength";

type NormalizeMetaDescriptionOptions = {
  description?: string;
  keyword: string;
  productName?: string;
};

export const normalizeMetaDescription = ({
  description,
  keyword,
  productName,
}: NormalizeMetaDescriptionOptions) => {
  const topic = normalizeWhitespace(keyword || "this topic");
  const product = normalizeWhitespace(productName || "");
  const fallback = `Learn ${topic} in plain language, with practical steps, useful examples, and clear advice to help you decide what to do next.`;
  const additions = [
    product ? `See how it connects to ${product} and what to try first.` : "",
    "It covers key steps, common mistakes, and the next move to make with confidence.",
  ].filter(Boolean);
  let normalized = normalizeWhitespace(description || fallback);

  additions.forEach((addition) => {
    if (normalized.length >= metaDescriptionLengthLimits.min) {
      return;
    }

    normalized = normalizeWhitespace(`${normalized} ${addition}`);
  });

  if (normalized.length < metaDescriptionLengthLimits.min) {
    normalized = fallback;
  }

  return truncateTextToMaxLength(normalized, metaDescriptionLengthLimits.max);
};
