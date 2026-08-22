import { seoTitleLengthLimits } from "@/config/seoTitleLengthLimits";
import { normalizeWhitespace } from "./normalizeWhitespace";
import { truncateTextToMaxLength } from "./truncateTextToMaxLength";

type NormalizeSeoTitleOptions = {
  keyword: string;
  productName?: string;
  seoTitle?: string;
  title: string;
};

export const normalizeSeoTitle = ({
  keyword,
  productName,
  seoTitle,
  title,
}: NormalizeSeoTitleOptions) => {
  const product = normalizeWhitespace(productName || "");
  const topic = normalizeWhitespace(keyword || title || "this topic");
  const seed = normalizeWhitespace(seoTitle || title);
  const fallback = `A practical guide to ${topic} with clear steps, useful examples, and simple next actions`;
  const additions = [
    product ? `for ${product}` : "",
    `for people comparing their next steps`,
    `with practical examples`,
  ].filter(Boolean);
  let normalized = truncateTextToMaxLength(seed || fallback, seoTitleLengthLimits.max);

  additions.forEach((addition) => {
    if (normalized.length >= seoTitleLengthLimits.min) {
      return;
    }

    normalized = truncateTextToMaxLength(
      `${normalized} ${addition}`,
      seoTitleLengthLimits.max,
    );
  });

  if (normalized.length < seoTitleLengthLimits.min) {
    normalized = truncateTextToMaxLength(fallback, seoTitleLengthLimits.max);
  }

  return normalized;
};
