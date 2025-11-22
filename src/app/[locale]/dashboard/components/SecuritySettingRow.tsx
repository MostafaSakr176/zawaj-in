"use client"

import { Toggle } from "./Toggle"
import { ChevronDown } from "lucide-react"

interface SecuritySettingRowProps {
  title: string
  description: string
  enabled: boolean
  onToggle: (enabled: boolean) => void
  preferredMethod?: {
    label: string
    value: string
    options: { label: string; value: string }[]
    onChange: (value: string) => void
  }
}

export function SecuritySettingRow({
  title,
  description,
  enabled,
  onToggle,
  preferredMethod
}: SecuritySettingRowProps) {
  return (
    <div className="flex items-start gap-8 py-4 border-b border-[#DFE1E7] last:border-b-0">
      {/* Left side - Title and Description */}
      <div className="w-64 flex-shrink-0">
        <h3 className="text-sm font-semibold text-[#0D0D12] mb-1">{title}</h3>
        <p className="text-xs text-[#666D80] leading-relaxed">{description}</p>
      </div>

      {/* Middle - Preferred Method (if any) */}
      {preferredMethod && (
        <div className="w-36">
          <label className="text-xs text-[#666D80] mb-1.5 block">
            Preferred Method <span className="text-[#DF1C41]">*</span>
          </label>
          <div className="relative">
            <select
              value={preferredMethod.value}
              onChange={(e) => preferredMethod.onChange(e.target.value)}
              className="w-full appearance-none px-3 py-2 pr-8 border border-[#DFE1E7] rounded-lg text-sm text-[#0D0D12] bg-white focus:outline-none focus:ring-2 focus:ring-[#301B69]/20"
            >
              {preferredMethod.options.map((option) => (
                <option key={option.value} value={option.value}>
                  {option.label}
                </option>
              ))}
            </select>
            <ChevronDown className="absolute right-3 top-1/2 -translate-y-1/2 w-4 h-4 text-[#666D80] pointer-events-none" />
          </div>
        </div>
      )}

      {/* Right side - Toggle */}
      <div className="ml-auto">
        <Toggle checked={enabled} onChange={onToggle} />
      </div>
    </div>
  )
}
