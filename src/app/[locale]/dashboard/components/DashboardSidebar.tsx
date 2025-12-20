"use client"

import { useState } from "react"
import { usePathname } from "next/navigation"
import { Link } from "@/i18n/navigation"
import {
  Home,
  Users,
  CreditCard,
  MessageSquare,
  BarChart3,
  Lock,
  MessageCircle,
  UserCircle,
  Settings,
  Search,
  ChevronLeft,
  ChevronRight,
  Crown,
  FileText,
  Mail
} from "lucide-react"
import { cn } from "@/lib/utils"

interface MenuItem {
  icon: React.ElementType
  label: string
  href: string
}

interface MenuSection {
  title: string
  items: MenuItem[]
}

const menuSections: MenuSection[] = [
  {
    title: "Home",
    items: [
      { icon: Home, label: "Dashboard", href: "/dashboard" },
      { icon: CreditCard, label: "Subscriptions & Payments", href: "/dashboard/subscriptions" },
    ]
  },
  {
    title: "Management",
    items: [
      { icon: Users, label: "Users", href: "/dashboard/users" },
      { icon: Crown, label: "Subscription Plans", href: "/dashboard/plans" },
      { icon: BarChart3, label: "Analytics & Insights", href: "/dashboard/analytics" },
      { icon: MessageSquare, label: "Chats", href: "/dashboard/chats" },
      { icon: Mail, label: "Contact Us Messages", href: "/dashboard/contact-us" },
      { icon: FileText, label: "Content", href: "/dashboard/content" },
      { icon: Lock, label: "Security & Privacy", href: "/dashboard/security" },
      { icon: MessageCircle, label: "Reviews & Feedback", href: "/dashboard/reviews" },
      { icon: UserCircle, label: "Roles & Permissions", href: "/dashboard/roles" },
    ]
  },
  {
    title: "Other",
    items: [
      { icon: Settings, label: "Settings", href: "/dashboard/settings" },
    ]
  }
]

export function DashboardSidebar() {
  const pathname = usePathname()
  const [isCollapsed, setIsCollapsed] = useState(false)

  return (
    <aside
      className={cn(
        "relative border-r border-[#DFE1E7] bg-white h-screen flex flex-col transition-all duration-300",
        isCollapsed ? "w-20" : "w-[272px]"
      )}
    >
      {/* Toggle Button */}
      <button
        onClick={() => setIsCollapsed(!isCollapsed)}
        className="absolute -right-3 top-6 z-50 w-6 h-6 bg-white border border-[#DFE1E7] rounded-full flex items-center justify-center shadow-sm hover:bg-gray-50 transition-colors"
      >
        {isCollapsed ? (
          <ChevronRight className="h-3.5 w-3.5 text-gray-600" />
        ) : (
          <ChevronLeft className="h-3.5 w-3.5 text-gray-600" />
        )}
      </button>

      {/* Logo Header */}
      <div className="border-b border-[#DFE1E7]">
        <div className="flex items-center justify-between px-5 py-4">
          {!isCollapsed ? (
            <div className="flex items-center gap-2">
              <span className="text-xl font-semibold text-[#301B69]">Zwaj</span>
              <span className="text-xl font-semibold text-[#301B69]">In</span>
            </div>
          ) : (
            <div className="flex items-center justify-center w-full">
              <span className="text-xl font-bold text-[#301B69]">Z</span>
            </div>
          )}
        </div>
      </div>

      {/* Search Bar */}
      {!isCollapsed && (
        <div className="px-4 py-5">
          <div className="relative">
            <Search className="pointer-events-none absolute left-4 top-1/2 -translate-y-1/2 h-5 w-5 text-[#818898]" />
            <div className="pointer-events-none absolute right-3 top-1/2 -translate-y-1/2 flex items-center gap-1">
              <kbd className="flex items-center justify-center min-w-[20px] h-5 px-1.5 bg-[#ECEFF3] rounded text-xs text-[#818898] font-medium border border-[#DFE1E7]">
                ⌘
              </kbd>
              <kbd className="flex items-center justify-center min-w-[20px] h-5 px-1.5 bg-[#ECEFF3] rounded text-xs text-[#818898] font-semibold border border-[#DFE1E7]">
                K
              </kbd>
            </div>
            <input
              type="text"
              placeholder="Search"
              className="w-full bg-white border border-[#DFE1E7] rounded-lg shadow-sm py-2 pl-11 pr-16 text-sm text-gray-900 placeholder:text-[#818898] focus:outline-none focus:ring-2 focus:ring-[#301B69]/20"
            />
          </div>
        </div>
      )}

      {/* Menu Sections */}
      <nav className="flex-1 overflow-y-auto px-4 py-2 space-y-4">
        {menuSections.map((section) => (
          <div key={section.title} className="space-y-1">
            {!isCollapsed && (
              <div className="px-3 py-1">
                <h3 className="text-sm font-medium text-[#A4ACB9]">
                  {section.title}
                </h3>
              </div>
            )}

            <div className="space-y-0.5">
              {section.items.map((item) => {
                const Icon = item.icon
                // Remove locale prefix from pathname for comparison
                const pathWithoutLocale = pathname.replace(/^\/(en|ar)/, '')
                const itemPath = item.href

                // Check if current path matches the item path exactly or starts with it
                const isActive =
                  pathWithoutLocale === itemPath ||
                  (pathWithoutLocale.startsWith(itemPath + '/') && itemPath !== '/dashboard') ||
                  (pathWithoutLocale === '/dashboard' && itemPath === '/dashboard')

                return (
                  <Link
                    key={item.href}
                    href={item.href}
                    className={cn(
                      "relative flex items-center gap-2 px-3 py-2 rounded-lg text-base font-medium transition-all duration-200",
                      isActive
                        ? "bg-[#EAE8F0] text-[#0D0D12]"
                        : "text-[#666D80] hover:bg-gray-50 hover:text-[#0D0D12]",
                      isCollapsed && "justify-center"
                    )}
                    title={isCollapsed ? item.label : undefined}
                  >
                    {isActive && !isCollapsed && (
                      <div className="absolute -left-4 top-1/2 -translate-y-1/2 w-1 h-6 bg-[#301B69] rounded-r-full" />
                    )}
                    {isActive && isCollapsed && (
                      <div className="absolute left-0 top-1/2 -translate-y-1/2 w-1 h-6 bg-[#301B69] rounded-r-full" />
                    )}

                    <Icon className="h-5 w-5 flex-shrink-0" />
                    {!isCollapsed && <span className="text-base">{item.label}</span>}
                  </Link>
                )
              })}
            </div>
          </div>
        ))}
      </nav>
    </aside>
  )
}
