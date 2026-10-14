import { blogPublishingSetupSteps } from "../constants/publishing/blogPublishingSetupSteps";
import { BlogPublishingSetupStep } from "./BlogPublishingSetupStep";

export const BlogPublishingSetupSteps = () => {
  return (
    <ol className="grid gap-3">
      {blogPublishingSetupSteps.map((step, index) => (
        <BlogPublishingSetupStep index={index} key={step} step={step} />
      ))}
    </ol>
  );
};
