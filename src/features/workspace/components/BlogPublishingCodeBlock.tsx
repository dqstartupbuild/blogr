type BlogPublishingCodeBlockProps = {
  code: string;
};

export const BlogPublishingCodeBlock = ({
  code,
}: BlogPublishingCodeBlockProps) => {
  return (
    <pre className="max-h-80 overflow-auto rounded-md border border-black bg-white p-3 text-xs leading-5 text-black">
      <code>{code}</code>
    </pre>
  );
};
