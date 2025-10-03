"use client";

import * as React from "react";
import { ChevronDown } from "lucide-react";

import { cn } from "@/lib/utils";
import {
  FieldAdornment,
  FieldControl,
  useFieldProps,
} from "@/components/ui/form";

export type SelectOption = {
  value: string;
  label: React.ReactNode;
  disabled?: boolean;
};

export type SelectProps = Omit<
  React.SelectHTMLAttributes<HTMLSelectElement>,
  "children"
> & {
  options: SelectOption[];
  placeholder?: React.ReactNode;
};

export const Select = React.forwardRef<HTMLSelectElement, SelectProps>(
  ({ className, options, placeholder, ...props }, ref) => {
    const fieldProps = useFieldProps();
    return (
      <FieldControl>
        <FieldAdornment position="end">
          <ChevronDown size={18} className="text-[#AFAFAF]" />
        </FieldAdornment>
        <select
          ref={ref}
          className={cn(
            "appearance-none bg-white rtl:pl-10 ltr:pr-10 h-11 w-full rounded-[8px] border border-[#D0D5DD] px-4 text-[1rem] shadow-xs outline-none transition-[color,box-shadow]",
            className
          )}
          {...fieldProps}
          {...props}
        >
          {placeholder ? (
            <option
              value=""
              disabled
              selected={props.defaultValue == null && props.value == null}
            >
              {placeholder as any}
            </option>
          ) : null}
          {options.map((opt) => (
            <option
              key={String(opt.value)}
              value={opt.value}
              disabled={opt.disabled}
            >
              {opt.label as any}
            </option>
          ))}
        </select>
      </FieldControl>
    );
  }
);

Select.displayName = "Select";

export default Select;
