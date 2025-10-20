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
  onStepClick?: (index: number) => void; // New prop for handling step clicks
  clickableSteps?: boolean; // New prop to enable/disable clicking
};

export function Stepper({
  steps,
  activeIndex,
  className,
  direction = "ltr",
  onStepClick,
  clickableSteps = false,
}: StepperProps) {
  const n = steps.length;

  const handleStepClick = (index: number) => {
    // Only allow clicking on completed steps or current step
    const isClickableStep = index <= activeIndex;
    
    if (clickableSteps && onStepClick && isClickableStep) {
      onStepClick(index);
    }
  };

  return (
    <div className={cn("w-full", className)}>
      <div className="relative mx-auto flex max-w-6xl items-start">
        <div
          className="absolute top-4 h-1 rounded-full bg-[#E5DDF7] w-full md:w-3/4  ltr:left-0 rtl:right-0 ltr:right-auto ltr:md:left-6 rtl:left-auto rtl:md:right-6"
        />
        <div
          className="absolute top-4 h-1 rounded-full block md:hidden"
          style={
            direction === "rtl"
              ? {
                right: `0px`,
                width: `${activeIndex === 0 ? 25 : activeIndex === 1 ? 50 : activeIndex === 2 ? 75 : activeIndex === 3 ? 100 : 100}%`,
                background:
                  "#E30BCD",
              }
              : {
                left: `0px`,
                width: `${activeIndex === 0 ? 25 : activeIndex === 1 ? 50 : activeIndex === 2 ? 75 : activeIndex === 3 ? 100 : 100}%`,
                background:
                  "#E30BCD",
              }
          }
        />
        <h6 className="text-lg font-semibold text-[#301B69] mt-8 md:hidden">{steps[activeIndex].label}</h6>

        <div
          className="absolute top-4 h-1 rounded-full hidden md:block"
          style={
            direction === "rtl"
              ? {
                right: `20px`,
                width: `${activeIndex === 0 ? 0 : activeIndex === 1 ? 25 : activeIndex === 2 ? 50 : activeIndex === 3 ? 75 : 75}%`,
                background:
                  "linear-gradient(229.14deg, #C6B4F0 -7.04%, #8C5BD3 121.07%)",
              }
              : {
                left: `20px`,
                width: `${activeIndex === 0 ? 0 : activeIndex === 1 ? 25 : activeIndex === 2 ? 50 : activeIndex === 3 ? 75 : 75}%`,
                background:
                  "linear-gradient(229.14deg, #C6B4F0 -7.04%, #8C5BD3 121.07%)",
              }
          }
        />
        <ol className="relative z-10 hidden md:grid w-full grid-cols-4 items-start gap-4">
          {steps.map((s, idx) => {
            const state =
              idx < activeIndex
                ? "completed"
                : idx === activeIndex
                  ? "active"
                  : "upcoming";
            const isActive = state === "active";
            const isCompleted = state === "completed";
            const isUpcoming = state === "upcoming";
            
            // Only allow clicking on completed steps and current step
            const isClickableStep = clickableSteps && onStepClick && (isCompleted || isActive);
            
            return (
              <li
                key={s.id}
                className={cn(
                  "flex flex-col items-start gap-2",
                  isClickableStep && "cursor-pointer",
                  isUpcoming && "cursor-not-allowed opacity-60"
                )}
                onClick={() => handleStepClick(idx)}
              >
                <div
                  className={cn(
                    "relative flex size-10 items-center justify-center rounded-full border-3 bg-[#F9F5FF] transition-all duration-200",
                    isActive
                      ? "border-[#8C5BD3] ring-[4px] ring-[#F4EBFF]"
                      : isCompleted
                        ? "border-[#8C5BD3]"
                        : "border-[#E5DDF7]",
                    isClickableStep && "hover:border-[#8C5BD3] hover:ring-[2px] hover:ring-[#F4EBFF]",
                    isUpcoming && "hover:border-[#E5DDF7] hover:ring-0" // Remove hover effects for upcoming steps
                  )}
                >
                  {isCompleted ? (
                    <Image src={"/icons/complete.webp"} alt="Completed" width={14} height={14} className="w-5" />
                  ) : (
                    <span
                      className={cn(
                        "w-3 h-3 rounded-full transition-colors duration-200",
                        isActive ? "bg-[#7F56D9]" : "bg-[#E4E7EC]"
                      )}
                    >
                    </span>
                  )}
                </div>
                <div
                  className={cn(
                    "text-sm font-semibold transition-colors duration-200",
                    isActive || isCompleted
                      ? "text-[#301B69]"
                      : "text-foreground/70",
                    isClickableStep && "hover:text-[#301B69]"
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
