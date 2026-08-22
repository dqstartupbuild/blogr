export const normalizeHexColor = (value: string) => {
  const match = value
    .trim()
    .match(/^#([0-9a-fA-F]{3}|[0-9a-fA-F]{6}|[0-9a-fA-F]{8})$/);

  if (!match) return null;

  const raw = match[1].toUpperCase();

  if (raw.length === 3) {
    return `#${raw
      .split("")
      .map((char) => `${char}${char}`)
      .join("")}`;
  }

  if (raw.length === 8) {
    const alpha = Number.parseInt(raw.slice(6, 8), 16) / 255;
    if (!Number.isFinite(alpha) || alpha <= 0.05) return null;
    return `#${raw.slice(0, 6)}`;
  }

  return `#${raw}`;
};
