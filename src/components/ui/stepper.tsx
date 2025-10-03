import * as React from "react";

import { cn } from "@/lib/utils";
import Image from "next/image";

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
          className="absolute top-4 h-1 rounded-full bg-[#E5DDF7] w-3/4 ltr:right-auto ltr:left-6 rtl:left-auto rtl:right-6"
        />
        <div
          className="absolute top-4 h-1 rounded-full"
          style={
            direction === "rtl"
              ? {
                right: `20px`,
                width:`${activeIndex === 0 ? 0 : activeIndex === 1 ? 25 : activeIndex === 2 ? 50 : activeIndex === 3 ? 75 : 75}%`,
                background:
                  "linear-gradient(229.14deg, #C6B4F0 -7.04%, #8C5BD3 121.07%)",
              }
              : {
                left: `20px`,
                right: `${activeIndex === 0 ? 0 : activeIndex === 1 ? 25 : activeIndex === 2 ? 50 : activeIndex === 3 ? 75 : 75}%`,
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
                className="flex flex-col items-start gap-2"
              >
                <div
                  className={cn(
                    "relative flex size-10 items-center justify-center rounded-full border-3 bg-[#F9F5FF]",
                    isActive
                      ? "border-[#8C5BD3] ring-[4px] ring-[#F4EBFF]"
                      : isCompleted
                        ? "border-[#8C5BD3]"
                        : "border-[#E5DDF7]"
                  )}
                >
                  {isCompleted ? (
                    <Image src={"/icons/complete.svg"} alt="Completed" width={14} height={14} className="w-5" />
                  ) : (
                    <span
                      className={cn(
                        "w-3 h-3 rounded-full",
                        isActive ? "bg-[#7F56D9]" : "bg-[#E4E7EC]"
                      )}
                    >
                    </span>
                  )}
                  {/* {isActive && (
                    <span className="absolute -inset-1 rounded-full" />
                  )} */}
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
