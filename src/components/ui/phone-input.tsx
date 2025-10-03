"use client";

import * as React from "react";

import { cn } from "@/lib/utils";
import {
  FieldAdornment,
  FieldControl,
  useFieldProps,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";

export type PhoneInputProps = React.ComponentProps<typeof Input> & {
  dialCode?: string;
  dialCodeSlot?: React.ReactNode;
};

export const PhoneInput = React.forwardRef<HTMLInputElement, PhoneInputProps>(
  ({ className, dialCode = "+966", dialCodeSlot, ...props }, ref) => {
    const fieldProps = useFieldProps();
    const slot = dialCodeSlot ?? (
      <span className="h-full flex items-center justify-center rounded-[8px] border border-[#D0D5DD] bg-white px-3 py-2 text-sm text-foreground shadow-xs">
        {dialCode}
      </span>
    );

    return (
      <FieldControl className="flex ltr:flex-row rtl:flex-row-reverse items-end gap-2">
        {/* <div className="pointer-events-none absolute inset-y-0 rtl:left-3 ltr:right-auto ltr:left-3 rtl:right-auto" /> */}
        <div className="pointer-events-auto flex items-center justify-center h-11">
          {slot}
        </div>
        <Input
          ref={ref}
          inputMode="tel"
          className={cn("rtl:pr-[76px] ltr:pr-[76px] text-left bg-white", className)}
          {...fieldProps}
          {...props}
        />
      </FieldControl>
    );
  }
);

PhoneInput.displayName = "PhoneInput";

export default PhoneInput;
