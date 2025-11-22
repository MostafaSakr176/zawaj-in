"use client"

import { Search, Filter, ArrowUpDown } from "lucide-react"
import { useState } from "react"

export function SubscriptionFilters() {
  return (
    <div className="bg-white border border-[#DFE1E7] rounded-2xl p-5 shadow-sm">
      <div className="flex items-center justify-between gap-4">
        {/* Search */}
        <div className="relative flex-1 max-w-xs">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-[#818898]" />
          <input
            type="text"
            placeholder="Search"
            className="w-full pl-9 pr-4 py-2 border border-[#DFE1E7] rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-[#301B69]/20 placeholder:text-[#818898]"
          />
        </div>

        {/* Actions */}
        <div className="flex gap-3">
          <button className="flex items-center gap-2 px-4 py-2 border border-[#DFE1E7] rounded-lg text-sm text-[#666D80] hover:bg-gray-50 transition-colors">
            <Filter className="h-4 w-4" />
            <span>Filter</span>
          </button>

          <button className="flex items-center gap-2 px-4 py-2 border border-[#DFE1E7] rounded-lg text-sm text-[#666D80] hover:bg-gray-50 transition-colors">
            <ArrowUpDown className="h-4 w-4" />
            <span>Sort by</span>
          </button>
        </div>
      </div>
    </div>
  )
}
