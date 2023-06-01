import { FaCircle } from "react-icons/fa"
import { twMerge } from "tailwind-merge"

/**
 * A component that signifies loading status.
 * 
 * @internal
 */
export function LoadingDots({ className }: { className?: string }) {
  return (
    <div
      className={twMerge(
        "flex gap-1 p-2 text-[8px] text-slate-500 animate-fade-in",
        className
      )}>
      <FaCircle className="animate-bounce" />
      <FaCircle className="animate-[bounce_1s_infinite_0.3s]" />
      <FaCircle className="animate-[bounce_1s_infinite_0.6s]" />
    </div>
  )
}