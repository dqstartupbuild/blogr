import styles from "./YoutubeEmbed.module.css";

type YoutubeEmbedProps = {
  title: string;
  url: string;
};

export const YoutubeEmbed = ({ title, url }: YoutubeEmbedProps) => {
  return (
    <span className={styles.youtubeEmbed}>
      <iframe
        allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
        allowFullScreen
        loading="lazy"
        src={url}
        title={title}
      />
    </span>
  );
};
