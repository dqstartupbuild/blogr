export const truncateTopicText = (text: string, maxLength: number) => {
  const cleanText = text.trim().replace(/\s+/g, " ");

  if (cleanText.length <= maxLength) {
    return cleanText;
  }

  return `${cleanText.slice(0, maxLength - 3).trim()}...`;
};
