"use client";

import * as React from "react";

import { cn } from "@/lib/utils";
import { FieldControl, useFieldProps } from "@/components/ui/form";

export type TextareaProps = React.TextareaHTMLAttributes<HTMLTextAreaElement>;

export const Textarea = React.forwardRef<HTMLTextAreaElement, TextareaProps>(
  ({ className, rows = 4, ...props }, ref) => {
    const fieldProps = useFieldProps();
    return (
      <FieldControl>
        <textarea
          ref={ref}
          rows={rows}
          className={cn(
            "min-h-24 resize-y bg-white h-auto w-full rounded-[8px] border border-[#E5DDF7] px-6 py-4 text-[1rem] shadow-xs outline-none transition-[color,box-shadow] focus-visible:border-ring focus-visible:ring-ring/50 focus-visible:ring-[3px]",
            className
          )}
          {...fieldProps}
          {...props}
        />
      </FieldControl>
    );
  }
);

Textarea.displayName = "Textarea";

export default Textarea;
