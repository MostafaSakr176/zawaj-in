"use client";

import * as React from "react";

import { cn } from "@/lib/utils";
import { Input } from "@/components/ui/input";
import {
  FieldAdornment,
  FieldControl,
  useFieldProps,
} from "@/components/ui/form";

export type TextFieldProps = React.ComponentProps<typeof Input> & {
  startAdornment?: React.ReactNode;
  endAdornment?: React.ReactNode;
};

export const TextField = React.forwardRef<HTMLInputElement, TextFieldProps>(
  ({ className, startAdornment, endAdornment, ...props }, ref) => {
    const fieldProps = useFieldProps();
    const hasStart = Boolean(startAdornment);
    const hasEnd = Boolean(endAdornment);

    return (
      <FieldControl>
        {hasStart ? (
          <FieldAdornment position="start">{startAdornment}</FieldAdornment>
        ) : null}
        {hasEnd ? (
          <FieldAdornment position="end">{endAdornment}</FieldAdornment>
        ) : null}
        <Input
          ref={ref}
          className={cn(
            hasStart && "rtl:pr-10 ltr:pl-10",
            hasEnd && "rtl:pl-10 ltr:pr-10",
            className
          )}
          {...fieldProps}
          {...props}
        />
      </FieldControl>
    );
  }
);

TextField.displayName = "TextField";

export default TextField;
