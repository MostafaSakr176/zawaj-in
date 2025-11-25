"use client"

import { useState } from "react"
import { ChevronDown } from "lucide-react"
import { cn } from "@/lib/utils"

interface PhoneInputProps {
  label: string
  value?: string
  onChange?: (value: string) => void
  required?: boolean
  className?: string
}

const countryCodes = [
  { code: "+966", country: "SA", flag: "🇸🇦" },
  { code: "+1", country: "US", flag: "🇺🇸" },
  { code: "+44", country: "UK", flag: "🇬🇧" },
  { code: "+971", country: "AE", flag: "🇦🇪" },
  { code: "+20", country: "EG", flag: "🇪🇬" },
]

export function PhoneInput({ label, value = "", onChange, required, className }: PhoneInputProps) {
  const [selectedCode, setSelectedCode] = useState(countryCodes[0])
  const [isOpen, setIsOpen] = useState(false)

  return (
    <div className="space-y-2">
      <label className="text-sm font-medium text-[#0D0D12]">
        {label}
        {required && <span className="text-red-500 ml-0.5">*</span>}
      </label>
      <div className={cn("flex border border-[#DFE1E7] rounded-lg overflow-hidden focus-within:ring-2 focus-within:ring-[#301B69]/20 focus-within:border-[#301B69]", className)}>
        {/* Country Code Selector */}
        <div className="relative">
          <button
            type="button"
            onClick={() => setIsOpen(!isOpen)}
            className="flex items-center gap-1.5 px-3 py-2.5 bg-white border-r border-[#DFE1E7] text-sm text-[#0D0D12] hover:bg-gray-50 transition-colors"
          >
            <ChevronDown className="h-3.5 w-3.5 text-[#666D80]" />
            <span>{selectedCode.code}</span>
            <span>{selectedCode.flag}</span>
          </button>

          {/* Dropdown */}
          {isOpen && (
            <div className="absolute top-full left-0 mt-1 w-32 bg-white border border-[#DFE1E7] rounded-lg shadow-lg z-10">
              {countryCodes.map((country) => (
                <button
                  key={country.code}
                  type="button"
                  onClick={() => {
                    setSelectedCode(country)
                    setIsOpen(false)
                  }}
                  className="w-full flex items-center gap-2 px-3 py-2 text-sm text-[#0D0D12] hover:bg-gray-50 transition-colors"
                >
                  <span>{country.flag}</span>
                  <span>{country.code}</span>
                </button>
              ))}
            </div>
          )}
        </div>

        {/* Phone Number Input */}
        <input
          type="tel"
          value={value}
          onChange={(e) => onChange?.(e.target.value)}
          placeholder="Enter phone number"
          className="flex-1 px-4 py-2.5 text-sm text-[#0D0D12] placeholder:text-[#818898] focus:outline-none"
        />
      </div>
    </div>
  )
}
