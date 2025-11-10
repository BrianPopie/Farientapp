"use client";

export default function GlobalError({
  error,
  reset
}: {
  error: Error;
  reset: () => void;
}) {
  return (
    <html>
      <body style={{ padding: 16, fontFamily: "ui-sans-serif" }}>
        <h1>App crashed</h1>
        <pre style={{ whiteSpace: "pre-wrap" }}>{error?.stack || error?.message}</pre>
        <button onClick={() => reset()} style={{ marginTop: 12, padding: "6px 12px" }}>
          Retry
        </button>
      </body>
    </html>
  );
}
