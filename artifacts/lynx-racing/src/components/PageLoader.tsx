import lynxLogo from "@assets/lynx-logo.png";

export function PageLoader() {
  return (
    <div className="min-h-[70vh] flex flex-col items-center justify-center gap-6">
      <div className="relative">
        <img
          src={lynxLogo}
          alt="Lynx Racing"
          className="h-14 w-auto object-contain animate-pulse-glow"
        />
      </div>
      <div className="h-[2px] w-40 bg-border overflow-hidden rounded-full">
        <div className="h-full w-1/3 bg-primary animate-scanline" style={{ animationDuration: "1.2s" }} />
      </div>
      <p className="font-mono text-xs tracking-[0.3em] text-muted-foreground uppercase">
        Loading systems
      </p>
    </div>
  );
}
