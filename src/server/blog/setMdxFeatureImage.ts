export const setMdxFeatureImage = (mdx: string, featureImageUrl?: string) => {
  if (!featureImageUrl) {
    return mdx;
  }

  if (!mdx.startsWith("---")) {
    return mdx;
  }

  const closingIndex = mdx.indexOf("\n---", 3);

  if (closingIndex < 0) {
    return mdx;
  }

  const frontmatter = mdx.slice(0, closingIndex);
  const rest = mdx.slice(closingIndex);
  const featureImageLine = `featureImage: "${featureImageUrl}"`;

  if (/^featureImage:/m.test(frontmatter)) {
    return `${frontmatter.replace(/^featureImage:.*$/m, featureImageLine)}${rest}`;
  }

  return `${frontmatter}\n${featureImageLine}${rest}`;
};
