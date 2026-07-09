export function PageLoader() {
  return (
    <div className="flex min-h-[70vh] flex-col items-center justify-center gap-5">
      <div className="mono-label-lg text-ink">
        LYNX <span className="text-ink-dim">//</span> <span className="text-acid">LOADING</span>
      </div>
      <div className="relative h-px w-44 overflow-hidden bg-hairline">
        <div className="absolute inset-y-0 left-0 w-1/3 bg-acid animate-pulse" />
      </div>
      <span className="mono-label text-ink-dim">Initialising module</span>
    </div>
  );
}
