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
      <span className="inline-flex items-center justify-center rounded-[12px] border border-[#E5DDF7] bg-white px-3 py-2 text-sm text-foreground shadow-xs rtl:ml-2 ltr:mr-2">
        {dialCode}
      </span>
    );

    return (
      <FieldControl className="flex items-center">
        <div className="pointer-events-none absolute inset-y-0 rtl:left-3 ltr:right-auto ltr:left-3 rtl:right-auto" />
        <div className="pointer-events-auto absolute inset-y-0 rtl:left-3 ltr:left-3 flex items-center">
          {slot}
        </div>
        <Input
          ref={ref}
          inputMode="tel"
          className={cn("rtl:pr-[96px] ltr:pl-[96px] bg-white", className)}
          {...fieldProps}
          {...props}
        />
      </FieldControl>
    );
  }
);

PhoneInput.displayName = "PhoneInput";

export default PhoneInput;
