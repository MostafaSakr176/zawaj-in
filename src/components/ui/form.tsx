"use client";

import * as React from "react";

import { cn } from "@/lib/utils";

type FormFieldContextValue = {
  id: string;
  error?: string;
  hint?: string;
  required?: boolean;
};

const FormFieldContext = React.createContext<FormFieldContextValue | null>(
  null
);

function useFormField() {
  const ctx = React.useContext(FormFieldContext);
  if (!ctx) throw new Error("useFormField must be used within <FormField>");
  return ctx;
}

type FormFieldProps = {
  id?: string;
  label?: React.ReactNode;
  hint?: React.ReactNode;
  error?: React.ReactNode;
  required?: boolean;
  className?: string;
  children: React.ReactNode;
};

export function FormField({
  id,
  label,
  hint,
  error,
  required,
  className,
  children,
}: FormFieldProps) {
  const generatedId = React.useId();
  const fieldId = id ?? generatedId;

  return (
    <FormFieldContext.Provider
      value={{
        id: fieldId,
        error: typeof error === "string" ? error : undefined,
        hint: typeof hint === "string" ? hint : undefined,
        required,
      }}
    >
      <div className={cn("w-full", className)}>
        {label ? (
          <div className="mb-1 flex items-center justify-between">
            <label
              htmlFor={fieldId}
              className={cn("text-sm font-medium text-foreground/80")}
            >
              {label}
              {required ? <span className="text-destructive"> *</span> : null}
            </label>
          </div>
        ) : null}
        {children}
        {hint && !error ? (
          <p className="mt-1 text-xs text-muted-foreground">{hint}</p>
        ) : null}
        {error ? (
          <p className="mt-1 text-xs text-destructive">{error}</p>
        ) : null}
      </div>
    </FormFieldContext.Provider>
  );
}

type FieldControlProps = React.ComponentProps<"div">;

export function FieldControl({ className, ...props }: FieldControlProps) {
  const { id, error } = useFormField();
  return (
    <div
      data-slot="control"
      aria-invalid={Boolean(error) || undefined}
      aria-describedby={`${id}-desc`}
      className={cn("relative", className)}
      {...props}
    />
  );
}

type FieldAdornmentProps = React.ComponentProps<"div"> & {
  position?: "start" | "end";
};

export function FieldAdornment({
  position = "start",
  className,
  ...props
}: FieldAdornmentProps) {
  const posClass =
    position === "start"
      ? "inset-y-0 rtl:right-3 ltr:left-3"
      : "inset-y-0 rtl:left-3 ltr:right-3";
  return (
    <div
      className={cn(
        "pointer-events-none absolute flex items-center text-muted-foreground",
        posClass,
        className
      )}
      {...props}
    />
  );
}

export function useFieldProps<
  T extends { id?: string; "aria-invalid"?: boolean }
>(props?: T) {
  const { id, error } = useFormField();
  return {
    id,
    "aria-invalid": Boolean(error) || undefined,
    ...props,
  };
}
