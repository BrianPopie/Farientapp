type SlideCardProps = {
  title: string;
  subtitle: string;
  highlights: string[];
};

export function SlideCard({ title, subtitle, highlights }: SlideCardProps) {
  return (
    <div className="flex h-60 w-full flex-col rounded-3xl border border-white/10 bg-gradient-to-br from-white/10 to-transparent p-6">
      <p className="text-xs uppercase tracking-wide text-muted-foreground">{subtitle}</p>
      <h3 className="mt-2 text-2xl font-semibold">{title}</h3>
      <ul className="mt-4 space-y-2 text-sm text-muted-foreground">
        {highlights.map((item) => (
          <li key={item} className="flex gap-2">
            <span className="text-primary">•</span>
            {item}
          </li>
        ))}
      </ul>
      <div className="mt-auto text-xs text-muted-foreground/70">Citations embedded →</div>
    </div>
  );
}
