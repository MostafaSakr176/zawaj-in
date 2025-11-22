import { StatsCard } from "./StatsCard"

export function SubscriptionStats() {
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
      <StatsCard
        iconSrc="/icons/dashboard/dollar-icon.svg"
        label="Total Earnings"
        value="$325,000"
        change={10.5}
        changeType="increase"
      />
      <StatsCard
        iconSrc="/icons/dashboard/credit-card-icon.svg"
        label="Silver Package Earnings"
        value="$3200"
        change={10.5}
        changeType="increase"
      />
      <StatsCard
        iconSrc="/icons/dashboard/credit-card-icon.svg"
        label="Gold package Earnings"
        value="$12,000"
        change={10.5}
        changeType="increase"
      />
      <StatsCard
        iconSrc="/icons/dashboard/dollar-icon.svg"
        label="Onetime Earnings"
        value="$1500"
        change={10.5}
        changeType="increase"
      />
    </div>
  )
}
