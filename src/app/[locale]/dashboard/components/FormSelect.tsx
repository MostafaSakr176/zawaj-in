"use client"

import { ChevronDown } from "lucide-react"
import { cn } from "@/lib/utils"

interface Option {
  value: string
  label: string
}

interface FormSelectProps {
  label: string
  options: Option[]
  value?: string
  onChange?: (value: string) => void
  placeholder?: string
  required?: boolean
  className?: string
}

export function FormSelect({ label, options, value, onChange, placeholder, required, className }: FormSelectProps) {
  return (
    <div className="space-y-2">
      <label className="text-sm font-medium text-[#0D0D12]">
        {label}
        {required && <span className="text-red-500 ml-0.5">*</span>}
      </label>
      <div className="relative">
        <select
          value={value}
          onChange={(e) => onChange?.(e.target.value)}
          className={cn(
            "w-full px-4 py-2.5 border border-[#DFE1E7] rounded-lg text-sm text-[#0D0D12] bg-white appearance-none focus:outline-none focus:ring-2 focus:ring-[#301B69]/20 focus:border-[#301B69] cursor-pointer",
            className
          )}
        >
          {placeholder && (
            <option value="" disabled>
              {placeholder}
            </option>
          )}
          {options.map((option) => (
            <option key={option.value} value={option.value}>
              {option.label}
            </option>
          ))}
        </select>
        <ChevronDown className="absolute right-3 top-1/2 -translate-y-1/2 h-4 w-4 text-[#666D80] pointer-events-none" />
      </div>
    </div>
  )
}
