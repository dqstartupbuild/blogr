import type { LinkItem } from "../types/LinkItem";

type SetProductLinkActiveStateOptions = {
  isActive: boolean;
  links: LinkItem[];
  url: string;
};

export const setProductLinkActiveState = ({
  isActive,
  links,
  url,
}: SetProductLinkActiveStateOptions) => {
  return links.map((link) =>
    link.url === url
      ? {
          ...link,
          isActive,
        }
      : link,
  );
};
