import * as React from "react";

import { cn } from "@/lib/utils";

export type Step = {
  id: string;
  label: React.ReactNode;
  description?: React.ReactNode;
};

export type StepperProps = {
  steps: Step[];
  activeIndex: number; // zero-based
  className?: string;
  direction?: "rtl" | "ltr";
};

export function Stepper({
  steps,
  activeIndex,
  className,
  direction = "ltr",
}: StepperProps) {
  const n = steps.length;
  const edgePct = 50 / n; // left/right offset so the track starts/ends at circle centers
  const currentCenterPct = ((2 * activeIndex + 1) / (2 * n)) * 100;
  return (
    <div className={cn("w-full", className)}>
      <div className="relative mx-auto flex max-w-6xl items-start">
        <div
          className="absolute top-4 h-1 rounded-full bg-[#E5DDF7]"
          style={{ left: `${edgePct}%`, right: `${edgePct}%` }}
        />
        <div
          className="absolute top-4 h-1 rounded-full"
          style={
            direction === "rtl"
              ? {
                  right: `${edgePct}%`,
                  left: `${100 - currentCenterPct}%`,
                  background:
                    "linear-gradient(229.14deg, #C6B4F0 -7.04%, #8C5BD3 121.07%)",
                }
              : {
                  left: `${edgePct}%`,
                  right: `${100 - currentCenterPct}%`,
                  background:
                    "linear-gradient(229.14deg, #C6B4F0 -7.04%, #8C5BD3 121.07%)",
                }
          }
        />
        <ol className="relative z-10 grid w-full grid-cols-4 items-start gap-4">
          {steps.map((s, idx) => {
            const state =
              idx < activeIndex
                ? "completed"
                : idx === activeIndex
                ? "active"
                : "upcoming";
            const isActive = state === "active";
            const isCompleted = state === "completed";
            return (
              <li
                key={s.id}
                className="flex flex-col items-center gap-2 text-center"
              >
                <div
                  className={cn(
                    "relative flex size-8 items-center justify-center rounded-full border-2 bg-white",
                    isActive
                      ? "border-[#8C5BD3]"
                      : isCompleted
                      ? "border-[#8C5BD3]"
                      : "border-[#E5DDF7]"
                  )}
                >
                  {isCompleted ? (
                    <svg
                      width="14"
                      height="14"
                      viewBox="0 0 20 20"
                      fill="none"
                      xmlns="http://www.w3.org/2000/svg"
                    >
                      <path
                        d="M5 10.5L8.2 13.5L15 6.5"
                        stroke="#8C5BD3"
                        strokeWidth="2"
                        strokeLinecap="round"
                        strokeLinejoin="round"
                      />
                    </svg>
                  ) : (
                    <span
                      className={cn(
                        "text-xs font-bold",
                        isActive ? "text-[#8C5BD3]" : "text-muted-foreground"
                      )}
                    >
                      {idx + 1}
                    </span>
                  )}
                  {isActive && (
                    <span className="absolute -inset-1 rounded-full ring-2 ring-[#C6B4F0]" />
                  )}
                </div>
                <div
                  className={cn(
                    "text-sm font-semibold",
                    isActive || isCompleted
                      ? "text-[#301B69]"
                      : "text-foreground/70"
                  )}
                >
                  {s.label}
                </div>
                {s.description ? (
                  <div className="text-xs text-muted-foreground">
                    {s.description}
                  </div>
                ) : null}
              </li>
            );
          })}
        </ol>
      </div>
    </div>
  );
}

export default Stepper;
