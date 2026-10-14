const longHexColorPattern = /^#?([0-9a-f]{6})$/i;
const shortHexColorPattern = /^#?([0-9a-f])([0-9a-f])([0-9a-f])$/i;

export const getColorPickerValue = (value: string) => {
  const normalizedValue = value.trim();
  const longHexMatch = normalizedValue.match(longHexColorPattern);

  if (longHexMatch) {
    return `#${longHexMatch[1].toLowerCase()}`;
  }

  const shortHexMatch = normalizedValue.match(shortHexColorPattern);

  if (shortHexMatch) {
    return `#${shortHexMatch
      .slice(1)
      .map((character) => `${character}${character}`)
      .join("")
      .toLowerCase()}`;
  }

  return "#000000";
};
