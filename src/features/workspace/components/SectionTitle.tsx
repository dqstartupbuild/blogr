type SectionTitleProps = {
  title: string;
  action?: React.ReactNode;
};

export const SectionTitle = ({ title, action }: SectionTitleProps) => {
  return (
    <div className="flex flex-wrap items-center justify-between gap-3">
      <h2 className="text-lg font-semibold tracking-normal text-black">
        {title}
      </h2>
      {action}
    </div>
  );
};
