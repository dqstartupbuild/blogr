import { seoContentLengthLimits } from "./seoContentLengthLimits";

type ValidateSeoContentLengthsOptions = {
  excerpt: string;
  seoTitle: string;
};

export const validateSeoContentLengths = ({
  excerpt,
  seoTitle,
}: ValidateSeoContentLengthsOptions) => {
  if (
    seoTitle.length < seoContentLengthLimits.seoTitleMin ||
    seoTitle.length > seoContentLengthLimits.seoTitleMax
  ) {
    throw new Error("Keep the SEO title between 70 and 110 characters.");
  }

  if (
    excerpt.length < seoContentLengthLimits.metaDescriptionMin ||
    excerpt.length > seoContentLengthLimits.metaDescriptionMax
  ) {
    throw new Error("Keep the meta description between 110 and 160 characters.");
  }
};
