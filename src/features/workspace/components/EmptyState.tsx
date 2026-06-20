type EmptyStateProps = {
  label: string;
};

export const EmptyState = ({ label }: EmptyStateProps) => {
  return (
    <div className="mt-4 rounded-md border border-dashed border-[#cfc7b8] bg-white p-8 text-center text-sm font-medium text-[#66736b]">
      {label}
    </div>
  );
};
