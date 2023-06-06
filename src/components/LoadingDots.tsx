import { twMerge } from "tailwind-merge";

/**
 * A component that signifies loading status.
 *
 * @internal
 */
export function LoadingDots({ className }: { className?: string }) {
  return (
    <div
      aria-label="Loading Indicator"
      className={twMerge(
        "flex gap-1 p-2 animate-fade-in",
        className
      )}
    >
      <div className="w-2 h-2 bg-slate-500 rounded-full animate-[bounce_1s_infinite]" />
      <div className="w-2 h-2 bg-slate-500 rounded-full animate-[bounce_1s_infinite_0.3s]" />
      <div className="w-2 h-2 bg-slate-500 rounded-full animate-[bounce_1s_infinite_0.6s]" />
    </div>
  );
}
