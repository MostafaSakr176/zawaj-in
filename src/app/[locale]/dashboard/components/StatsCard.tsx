import { cn } from "@/lib/utils"
import Image from "next/image"

interface StatsCardProps {
  iconSrc: string
  label: string
  value: string | number
  change?: number
  changeType?: "increase" | "decrease"
  iconBgColor?: string
}

export function StatsCard({
  iconSrc,
  label,
  value,
  change,
  changeType = "increase",
  iconBgColor = "bg-white"
}: StatsCardProps) {
  return (
    <div className="flex flex-col gap-4 p-4 pb-3.5 bg-white border border-[#DFE1E7] rounded-2xl shadow-sm">
      {/* Header */}
      <div className="flex items-center justify-between">
        {/* Icon Container */}
        <div className={cn(
          "flex items-center justify-center w-10 h-10 border border-[#DFE1E7] rounded-[10px]",
          iconBgColor
        )}>
          <Image
            src={iconSrc}
            alt={label}
            width={20}
            height={20}
            className="w-5 h-5"
          />
        </div>

        {/* Info Icon */}
        <Image
          src="/icons/dashboard/info-icon.svg"
          alt="Info"
          width={20}
          height={20}
          className="w-5 h-5"
        />
      </div>

      {/* Content */}
      <div className="flex items-end justify-between gap-4">
        {/* Text Container */}
        <div className="flex flex-col gap-1 flex-1">
          <span className="text-sm font-normal text-[#666D80] leading-[1.5em]">
            {label}
          </span>
          <span className="text-lg font-semibold text-[#0D0D12] leading-[1.4em]">
            {value}
          </span>
        </div>

        {/* Badge - Only show if change is provided */}
        {change !== undefined && (
          <div className={cn(
            "flex items-center justify-center gap-0.5 px-1.5 py-0.5 rounded border",
            changeType === "increase"
              ? "bg-[#ECFDF3] border-[#12B76A] text-[#12B76A]"
              : "bg-[#FFF0F3] border-[#DF1C41] text-[#DF1C41]"
          )}>
            <Image
              src="/icons/dashboard/arrow-up.svg"
              alt="Arrow"
              width={14}
              height={14}
              className={cn(
                "w-3.5 h-3.5",
                changeType === "decrease" && "rotate-180"
              )}
            />
            <span className="text-xs font-medium leading-[1.5em]">
              {change}%
            </span>
          </div>
        )}
      </div>
    </div>
  )
}
