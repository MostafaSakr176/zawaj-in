import * as React from "react"
import { Slot } from "@radix-ui/react-slot"
import { cva, type VariantProps } from "class-variance-authority"

import { cn } from "@/lib/utils"

const buttonVariants = cva(
  "cursor-pointer inline-flex items-center justify-center gap-2 whitespace-nowrap text-sm font-medium transition-all disabled:pointer-events-none disabled:opacity-50  shrink-0 outline-none focus-visible:border-ring focus-visible:ring-ring/50 focus-visible:ring-[3px] aria-invalid:ring-destructive/20 dark:aria-invalid:ring-destructive/40 aria-invalid:border-destructive  outline-none focus:outline-none focus:ring-0",
  {
    variants: {
      variant: {
        default: "rounded-[16px] text-sm md:text-lg font-normal transition-all disabled:pointer-events-none disabled:opacity-50 shrink-0 bg-gradient-to-b from-[#6B3FA0] to-[#2D0B5A] text-white shadow-[0_8px_32px_0_rgba(80,40,160,0.16),inset_0_4px_12px_0_rgba(255,255,255,0.32)] border-[3px] border-[#E5DDF7] hover:shadow-[0_8px_32px_0_rgba(80,40,160,0.16),inset_0_-4px_12px_0_rgba(255,255,255,0.42)] transition duration-300",
        destructive:
          "bg-destructive text-white hover:bg-destructive/90 focus-visible:ring-destructive/20 dark:focus-visible:ring-destructive/40 dark:bg-destructive/60",
        outline:
          "border bg-background shadow-xs hover:bg-accent hover:text-accent-foreground dark:bg-input/30 dark:border-input dark:hover:bg-input/50",
        secondary:
          "rounded-[16px] text-lg font-normal transition-all disabled:pointer-events-none disabled:opacity-50 shrink-0 shadow-[0_4px_24px_0_rgba(80,40,160,0.10),inset_0_2px_4px_0_rgba(255,255,255,0.20)] border-[3px] border-[#E5DDF7] bg-white text-[#301B69] hover:bg-[#F2EFFF] transition duration-300",
        ghost:
          "px-1 py-1",
        link: "text-primary underline-offset-4 hover:underline",
      },
      size: {
        default: "px-3 py-2 md:px-4 md:py-3",
        sm: " gap-1.5 px-3",
        lg: " px-6",
        icon: "w-10 h-10 p-2 rounded-full",
      },
    },
    defaultVariants: {
      variant: "default",
      size: "default",
    },
  }
)

function Button({
  className,
  variant,
  size,
  asChild = false,
  ...props
}: React.ComponentProps<"button"> &
  VariantProps<typeof buttonVariants> & {
    asChild?: boolean
  }) {
  const Comp = asChild ? Slot : "button"

  return (
    <Comp
      data-slot="button"
      className={cn(buttonVariants({ variant, size, className }))}
      {...props}
    />
  )
}

export { Button, buttonVariants }
