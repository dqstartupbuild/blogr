import type { ImageStyle } from "../types/ImageStyle";

export const imageStyleOptions = [
  {
    description:
      "Hand-drawn pencil sketches with natural texture and soft shading.",
    label: "Sketch",
    value: "Sketch",
  },
  {
    description:
      "High-quality photos with realistic lighting and a polished layout.",
    label: "Realistic",
    value: "Realistic",
  },
  {
    description:
      "Clean digital illustrations with bright color and simple shapes.",
    label: "Illustration",
    value: "Illustration",
  },
  {
    description:
      "Photo-style scenes with short text and your brand colors in the background.",
    label: "Brand & Text",
    value: "Brand & Text",
  },
  {
    description:
      "A feature image with the article title in your brand colors. It can look sketched, illustrated, or realistic.",
    label: "Title-Based",
    value: "Title-Based",
  },
] as const satisfies readonly {
  description: string;
  label: string;
  value: ImageStyle;
}[];
