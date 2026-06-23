type BlogPublishingSetupStepProps = {
  index: number;
  step: string;
};

export const BlogPublishingSetupStep = ({
  index,
  step,
}: BlogPublishingSetupStepProps) => {
  return (
    <li className="grid grid-cols-[2rem_minmax(0,1fr)] gap-3">
      <span className="flex h-8 w-8 items-center justify-center rounded-md border border-black text-sm font-semibold text-black">
        {index + 1}
      </span>
      <span className="pt-1 text-sm leading-6 text-black">{step}</span>
    </li>
  );
};
