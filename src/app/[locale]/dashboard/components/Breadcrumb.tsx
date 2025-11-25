import { ChevronRight, Home } from "lucide-react"
import { Link } from "@/i18n/navigation"
import { cn } from "@/lib/utils"

interface BreadcrumbItem {
  label: string
  href?: string
}

interface BreadcrumbProps {
  items: BreadcrumbItem[]
}

export function Breadcrumb({ items }: BreadcrumbProps) {
  return (
    <nav className="flex items-center gap-2">
      {/* Home Icon */}
      <Link
        href="/dashboard"
        className="flex items-center justify-center w-8 h-8 text-[#A4ACB9] hover:text-[#666D80] transition-colors"
      >
        <Home className="w-4 h-4" />
      </Link>

      {/* Breadcrumb Items */}
      {items.map((item, index) => {
        const isLast = index === items.length - 1

        return (
          <div key={index} className="flex items-center gap-2">
            {/* Separator */}
            <ChevronRight className="w-4 h-4 text-[#A4ACB9]" />

            {/* Breadcrumb Item */}
            {item.href && !isLast ? (
              <Link
                href={item.href}
                className="text-sm font-medium text-[#666D80] hover:text-[#0D0D12] transition-colors"
              >
                {item.label}
              </Link>
            ) : (
              <span
                className={cn(
                  "text-sm font-medium",
                  isLast ? "text-[#0D0D12]" : "text-[#666D80]"
                )}
              >
                {item.label}
              </span>
            )}
          </div>
        )
      })}
    </nav>
  )
}
