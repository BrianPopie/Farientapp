export function Ambience() {
  return (
    <div className="pointer-events-none absolute inset-0 z-0">
      <div className="absolute inset-0 opacity-40 dark:opacity-70 motion-reduce:opacity-20 bg-[radial-gradient(600px_400px_at_50%_60%,rgba(120,130,255,0.12),transparent_60%)]" />
      <div className="absolute inset-x-0 top-0 h-48 opacity-30 dark:opacity-50 motion-reduce:opacity-15 bg-gradient-to-b from-[rgba(120,130,255,0.12)] to-transparent" />
    </div>
  );
}
