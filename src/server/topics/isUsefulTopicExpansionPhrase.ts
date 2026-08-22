const weakTopicExpansionPhrases = new Set([
  "about",
  "blog",
  "contact",
  "features",
  "home",
  "login",
  "pricing",
  "product",
  "products",
  "sign in",
]);

export const isUsefulTopicExpansionPhrase = (phrase: string) => {
  const cleanPhrase = phrase.trim().toLowerCase();

  return cleanPhrase.length >= 3 && !weakTopicExpansionPhrases.has(cleanPhrase);
};
