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
};

export function Stepper({ steps, activeIndex, className }: StepperProps) {
  const pct = steps.length > 1 ? (activeIndex / (steps.length - 1)) * 100 : 0;
  return (
    <div className={cn("w-full", className)}>
      <div className="relative mx-auto flex max-w-4xl items-center">
        <div className="absolute left-0 right-0 h-1 rounded-full bg-[#E5DDF7]" />
        <div
          className="absolute left-0 h-1 rounded-full"
          style={{
            right: `${100 - pct}%`,
            background:
              "linear-gradient(229.14deg, #F2EFFF -7.04%, #B07CD1 121.07%)",
          }}
        />
        <ol className="relative z-10 flex w-full items-center justify-between">
          {steps.map((s, idx) => {
            const state =
              idx < activeIndex
                ? "completed"
                : idx === activeIndex
                ? "active"
                : "upcoming";
            const isChecked = state === "completed" || state === "active";
            return (
              <li key={s.id} className="flex flex-col items-center gap-1">
                <div
                  className={cn(
                    "flex size-6 items-center justify-center rounded-full border-2",
                    isChecked
                      ? "border-[#6B3FA0] bg-white text-[#6B3FA0]"
                      : "border-[#E5DDF7] bg-white text-muted-foreground"
                  )}
                >
                  <span className="text-xs font-bold">{idx + 1}</span>
                </div>
                <div className="text-center">
                  <div
                    className={cn(
                      "text-sm font-semibold",
                      isChecked ? "text-[#301B69]" : "text-foreground/70"
                    )}
                  >
                    {s.label}
                  </div>
                  {s.description ? (
                    <div className="text-xs text-muted-foreground">
                      {s.description}
                    </div>
                  ) : null}
                </div>
              </li>
            );
          })}
        </ol>
      </div>
    </div>
  );
}

export default Stepper;
