"use client"

import { cn } from "@/lib/utils"

interface PasswordInputProps {
  label: string
  value?: string
  onChangePassword?: () => void
  required?: boolean
  className?: string
}

export function PasswordInput({ label, value = "••••••••••••••••", onChangePassword, required, className }: PasswordInputProps) {
  return (
    <div className="space-y-2">
      <label className="text-sm font-medium text-[#0D0D12]">
        {label}
        {required && <span className="text-red-500 ml-0.5">*</span>}
      </label>
      <div className={cn("flex items-center gap-3", className)}>
        <input
          type="password"
          value={value}
          readOnly
          className="flex-1 px-4 py-2.5 border border-[#DFE1E7] rounded-lg text-sm text-[#0D0D12] bg-white focus:outline-none"
        />
        <button
          type="button"
          onClick={onChangePassword}
          className="px-4 py-2.5 border border-[#301B69] rounded-lg text-sm font-medium text-[#301B69] hover:bg-[#301B69]/5 transition-colors whitespace-nowrap"
        >
          Change Password
        </button>
      </div>
    </div>
  )
}
