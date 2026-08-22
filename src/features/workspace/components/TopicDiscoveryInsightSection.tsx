type TopicDiscoveryInsightSectionProps = {
  items: string[];
  title: string;
};

export const TopicDiscoveryInsightSection = ({
  items,
  title,
}: TopicDiscoveryInsightSectionProps) => {
  if (items.length === 0) {
    return null;
  }

  return (
    <section className="grid gap-2 border-t border-black pt-3">
      <h3 className="text-sm font-semibold text-black">{title}</h3>
      <ul className="grid gap-1 text-sm text-black">
        {items.map((item) => (
          <li key={item}>{item}</li>
        ))}
      </ul>
    </section>
  );
};
