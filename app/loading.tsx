export default function Loading() {
  return (
    <div className="flex min-h-[50vh] items-center justify-center">
      <div className="flex gap-3">
        <span className="h-5 w-5 animate-bounce rounded-full bg-grape" />
        <span className="h-5 w-5 animate-bounce rounded-full bg-coral [animation-delay:150ms]" />
        <span className="h-5 w-5 animate-bounce rounded-full bg-sun [animation-delay:300ms]" />
      </div>
    </div>
  );
}