import { blogPublishingPayloadExample } from "../constants/publishing/blogPublishingPayloadExample";
import { blogPublishingReceiverEndpoint } from "../constants/publishing/blogPublishingReceiverEndpoint";
import { blogPublishingReceiverEnvVar } from "../constants/publishing/blogPublishingReceiverEnvVar";
import { BlogPublishingCodeBlock } from "./BlogPublishingCodeBlock";
import { BlogPublishingCopyButton } from "./BlogPublishingCopyButton";
import { BlogPublishingReceiverChecklist } from "./BlogPublishingReceiverChecklist";

export const BlogPublishingReceiverDetails = () => {
  return (
    <details className="border-t border-black pt-4">
      <summary className="cursor-pointer text-sm font-semibold text-black">
        View what the other app needs
      </summary>
      <div className="mt-4 grid gap-4">
        <div className="grid gap-2">
          <div className="flex flex-wrap items-center justify-between gap-2">
            <h4 className="text-sm font-semibold text-black">Webhook path</h4>
            <BlogPublishingCopyButton
              copiedLabel="Path copied"
              label="Copy path"
              text={blogPublishingReceiverEndpoint}
            />
          </div>
          <BlogPublishingCodeBlock code={`POST ${blogPublishingReceiverEndpoint}`} />
        </div>
        <div className="grid gap-2">
          <h4 className="text-sm font-semibold text-black">Token setting</h4>
          <BlogPublishingCodeBlock code={blogPublishingReceiverEnvVar} />
        </div>
        <div className="grid gap-2">
          <div className="flex flex-wrap items-center justify-between gap-2">
            <h4 className="text-sm font-semibold text-black">Sample payload</h4>
            <BlogPublishingCopyButton
              copiedLabel="Payload copied"
              label="Copy payload"
              text={blogPublishingPayloadExample}
            />
          </div>
          <BlogPublishingCodeBlock code={blogPublishingPayloadExample} />
        </div>
        <div className="grid gap-2">
          <h4 className="text-sm font-semibold text-black">Quick check</h4>
          <BlogPublishingReceiverChecklist />
        </div>
      </div>
    </details>
  );
};
