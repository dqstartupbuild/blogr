type SectionTitleProps = {
  title: string;
  action?: React.ReactNode;
};

export const SectionTitle = ({ title, action }: SectionTitleProps) => {
  return (
    <div className="flex flex-wrap items-center justify-between gap-3">
      <h2 className="text-lg font-semibold tracking-normal text-[#1d2320]">
        {title}
      </h2>
      {action}
    </div>
  );
};
