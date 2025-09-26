import * as React from "react";

import { cn } from "@/lib/utils";

type LabelProps = React.LabelHTMLAttributes<HTMLLabelElement>;

export function Label({ className, ...props }: LabelProps) {
  return (
    <label
      data-slot="label"
      className={cn(
        "mb-1 block text-sm font-medium text-foreground/80",
        className
      )}
      {...props}
    />
  );
}

export default Label;
