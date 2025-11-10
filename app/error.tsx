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
      <body className="p-6 text-sm">
        <h1 className="mb-2 text-lg font-semibold">App crashed</h1>
        <pre className="whitespace-pre-wrap text-red-500">{error.message}</pre>
        <button onClick={() => reset()} className="mt-3 rounded border px-3 py-1">
          Retry
        </button>
      </body>
    </html>
  );
}
