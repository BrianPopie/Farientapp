type SlideCardProps = {
  title: string;
  subtitle: string;
  highlights: string[];
};

export function SlideCard({ title, subtitle, highlights }: SlideCardProps) {
  return (
    <div className="flex h-60 w-full flex-col rounded-3xl border border-border bg-surface/90 p-6 shadow-sm">
      <p className="text-[0.75rem] uppercase tracking-wide text-text-muted">{subtitle}</p>
      <h3 className="mt-2 text-[1.35rem] font-semibold text-text">{title}</h3>
      <ul className="mt-4 space-y-2 text-sm text-text-muted">
        {highlights.map((item) => (
          <li key={item} className="flex gap-2">
            <span className="text-accent" aria-hidden="true">
              &bull;
            </span>
            {item}
          </li>
        ))}
      </ul>
      <div className="mt-auto text-xs text-text-muted">Citations embedded</div>
    </div>
  );
}
