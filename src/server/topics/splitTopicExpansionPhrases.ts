export const splitTopicExpansionPhrases = (value: string) => {
  return value.split(/[,\n.;:|]+/);
};
