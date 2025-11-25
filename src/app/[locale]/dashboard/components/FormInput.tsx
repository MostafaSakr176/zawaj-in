"use client"

import { cn } from "@/lib/utils"

interface FormInputProps extends React.InputHTMLAttributes<HTMLInputElement> {
  label: string
  required?: boolean
}

export function FormInput({ label, required, className, ...props }: FormInputProps) {
  return (
    <div className="space-y-2">
      <label className="text-sm font-medium text-[#0D0D12]">
        {label}
        {required && <span className="text-red-500 ml-0.5">*</span>}
      </label>
      <input
        className={cn(
          "w-full px-4 py-2.5 border border-[#DFE1E7] rounded-lg text-sm text-[#0D0D12] placeholder:text-[#818898] focus:outline-none focus:ring-2 focus:ring-[#301B69]/20 focus:border-[#301B69]",
          className
        )}
        {...props}
      />
    </div>
  )
}
