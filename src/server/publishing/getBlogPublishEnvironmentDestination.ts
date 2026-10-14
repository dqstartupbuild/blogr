import { getBlogPublishSource } from "./getBlogPublishSource";
import { getBlogPublishToken } from "./getBlogPublishToken";
import { getBlogPublishUrl } from "./getBlogPublishUrl";
import type { BlogPublishDestination } from "./types/BlogPublishDestination";

export const getBlogPublishEnvironmentDestination =
  (): BlogPublishDestination | null => {
    const token = getBlogPublishToken();
    const url = getBlogPublishUrl();

    if (!token || !url) {
      return null;
    }

    return {
      sourceName: getBlogPublishSource(),
      token,
      url,
    };
  };
