"use client";

export default function Error({
  reset,
}: {
  error: Error;
  reset: () => void;
}) {
  return (
    <div className="card flex min-h-[50vh] flex-col items-center justify-center gap-4 px-6 py-16 text-center">
      <h1 className="font-display text-4xl font-semibold">Something went wrong</h1>
      <p className="max-w-sm text-ink/70">
        Please try again. If it keeps happening, come back in a few minutes.
      </p>
      <button onClick={reset} className="btn-primary">
        Try again
      </button>
    </div>
  );
}