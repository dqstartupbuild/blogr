export const getBlogTagConnectorPhrases = (tag: string) => {
  const phrases: string[] = [];

  for (const connector of [" for ", " with ", " without ", " using "]) {
    if (!tag.includes(connector)) {
      continue;
    }

    const [beforeConnector, afterConnector] = tag.split(connector);

    if (beforeConnector) {
      phrases.push(beforeConnector);
    }

    if (afterConnector) {
      phrases.push(afterConnector);
    }
  }

  return phrases;
};
