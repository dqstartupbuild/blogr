import type { ImagesPerArticle } from "../types/ImagesPerArticle";

export const imagesPerArticleOptions = [
  {
    label: "None",
    value: "None",
  },
  {
    label: "Feature only",
    value: "Feature Only",
  },
  {
    label: "Feature + 2",
    value: "Feature +2",
  },
  {
    label: "Feature + 3",
    value: "Feature +3",
  },
  {
    label: "Feature + 4",
    value: "Feature +4",
  },
] as const satisfies readonly {
  label: string;
  value: ImagesPerArticle;
}[];
