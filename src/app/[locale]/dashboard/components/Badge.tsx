import * as React from "react"
import { cva, type VariantProps } from "class-variance-authority"
import { cn } from "@/lib/utils"

const badgeVariants = cva(
  "inline-flex items-center gap-1.5 rounded-2xl border px-2.5 py-0.5 text-xs font-medium transition-colors",
  {
    variants: {
      variant: {
        success: "border-green-600 bg-white text-green-600",
        warning: "border-yellow-600 bg-yellow-50 text-yellow-600",
        error: "border-red-500 bg-white text-red-500",
        premium: "border-primary bg-primary/10 text-primary",
        primary: "border-[#301B69] bg-[#301B69]/10 text-[#301B69]",
        default: "border-gray-400 bg-gray-100 text-gray-700",
        free: "border-gray-300 bg-gray-50 text-gray-600",
        gold: "border-yellow-500 bg-yellow-50 text-yellow-600",
        neutral: "border-gray-300 bg-gray-50 text-gray-700",
      },
    },
    defaultVariants: {
      variant: "neutral",
    },
  }
)

export interface BadgeProps
  extends React.HTMLAttributes<HTMLDivElement>,
    VariantProps<typeof badgeVariants> {
  showDot?: boolean
}

export function Badge({ className, variant, showDot = false, children, ...props }: BadgeProps) {
  return (
    <div className={cn(badgeVariants({ variant }), className)} {...props}>
      {showDot && (
        <span className={cn(
          "h-1.5 w-1.5 rounded-full",
          variant === "success" && "bg-green-600",
          variant === "error" && "bg-red-500",
          variant === "warning" && "bg-yellow-600",
          variant === "premium" && "bg-primary",
          variant === "free" && "bg-primary",
        )} />
      )}
      {children}
    </div>
  )
}
