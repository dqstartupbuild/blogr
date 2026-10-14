import type { ComponentPropsWithoutRef } from "react";
import { YoutubeEmbed } from "./YoutubeEmbed";
import { buildYoutubeEmbedUrl } from "../utils/buildYoutubeEmbedUrl";
import { getReactNodeText } from "../utils/getReactNodeText";

type MarkdownPreviewLinkProps = ComponentPropsWithoutRef<"a"> & {
  node?: unknown;
};

export const MarkdownPreviewLink = ({
  children,
  href,
  node,
  ...props
}: MarkdownPreviewLinkProps) => {
  void node;

  const embedUrl = href ? buildYoutubeEmbedUrl(href) : "";

  if (embedUrl) {
    return (
      <YoutubeEmbed
        title={getReactNodeText(children) || "YouTube video"}
        url={embedUrl}
      />
    );
  }

  return (
    <a href={href} {...props}>
      {children}
    </a>
  );
};
