import type { ReactNode } from "react";

type SectionProps = {
  title: string;
  subtitle?: string;
  children: ReactNode;
  className?: string;
};

export function Section({ title, subtitle, children, className }: SectionProps) {
  return (
    <section className={`mb-6 last:mb-0 ${className ?? ""}`}>
      <div className="mb-3">
        <h3 className="text-xs font-semibold uppercase tracking-wide text-slate-700 dark:text-slate-200">
          {title}
        </h3>
        {subtitle ? (
          <p className="text-sm text-slate-600 dark:text-slate-400">{subtitle}</p>
        ) : null}
      </div>
      <div className="space-y-3">{children}</div>
    </section>
  );
}
