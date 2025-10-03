"use client";

import * as React from "react";
import { Eye, EyeOff } from "lucide-react";

import { cn } from "@/lib/utils";
import { Input } from "@/components/ui/input";
import {
  FieldAdornment,
  FieldControl,
  useFieldProps,
} from "@/components/ui/form";

export type PasswordInputProps = React.ComponentProps<typeof Input> & {
  revealAriaLabel?: string;
  hideAriaLabel?: string;
  startAdornment?: React.ReactNode;
  togglePosition?: "start" | "end";
};

export const PasswordInput = React.forwardRef<
  HTMLInputElement,
  PasswordInputProps
>(
  (
    {
      className,
      revealAriaLabel = "Show password",
      hideAriaLabel = "Hide password",
      startAdornment,
      togglePosition = "end",
      ...props
    },
    ref
  ) => {
    const fieldProps = useFieldProps();
    const [visible, setVisible] = React.useState(false);

    return (
      <FieldControl>
        {startAdornment ? (
          <FieldAdornment position="start">{startAdornment}</FieldAdornment>
        ) : null}
        <FieldAdornment position={togglePosition}>
          <button
            type="button"
            className={cn(
              "pointer-events-auto inline-flex items-center justify-center rounded-md p-1 text-muted-foreground transition-colors hover:text-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring/50"
            )}
            aria-label={visible ? hideAriaLabel : revealAriaLabel}
            onClick={() => setVisible((v) => !v)}
          >
            {visible ? <EyeOff size={18} /> : <Eye size={18} />}
          </button>
        </FieldAdornment>
        <Input
          ref={ref}
          type={visible ? "text" : "password"}
          className={cn(
            startAdornment && "rtl:pr-10 ltr:pl-10",
            togglePosition === "end" && "rtl:pl-10 ltr:pr-10",
            togglePosition === "start" && "rtl:pr-10 ltr:pl-10",
            className
          )}
          {...fieldProps}
          {...props}
        />
      </FieldControl>
    );
  }
);

PasswordInput.displayName = "PasswordInput";

export default PasswordInput;
