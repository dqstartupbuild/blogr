export type RegenerateBlogImage = (
  blogId: string,
  options: {
    alt: string;
    imageIndex: number;
    isFeatureImage?: boolean;
    prompt: string;
  },
) => Promise<void>;