import { buildBlogPublishingCodexPrompt } from "../utils/buildBlogPublishingCodexPrompt";
import { BlogPublishingCopyButton } from "./BlogPublishingCopyButton";
import { BlogPublishingReceiverDetails } from "./BlogPublishingReceiverDetails";
import { BlogPublishingSetupSteps } from "./BlogPublishingSetupSteps";

type BlogPublishingSetupGuideProps = {
  productName: string;
};

export const BlogPublishingSetupGuide = ({
  productName,
}: BlogPublishingSetupGuideProps) => {
  const codexPrompt = buildBlogPublishingCodexPrompt(productName);

  return (
    <section className="grid gap-4 border-t border-black pt-4">
      <div className="grid gap-1">
        <h3 className="text-base font-semibold tracking-normal text-black">
          Setup guide
        </h3>
        <p className="text-sm leading-6 text-black">
          Use this when another app should receive and show the blogs you publish
          from this product.
        </p>
      </div>
      <BlogPublishingSetupSteps />
      <div className="flex flex-wrap gap-2">
        <BlogPublishingCopyButton
          copiedLabel="Prompt copied"
          label="Copy Codex prompt"
          text={codexPrompt}
        />
      </div>
      <BlogPublishingReceiverDetails />
    </section>
  );
};
