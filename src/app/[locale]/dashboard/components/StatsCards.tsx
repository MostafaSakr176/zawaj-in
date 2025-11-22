import { StatsCard } from "./StatsCard"

export function StatsCards() {
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
      <StatsCard
        iconSrc="/icons/dashboard/users-icon.svg"
        label="Total Users"
        value="4,000"
        change={10.5}
        changeType="decrease"
      />
      <StatsCard
        iconSrc="/icons/dashboard/credit-card-icon.svg"
        label="Active Subscriptions"
        value="2,340"
        change={8.2}
        changeType="increase"
      />
      <StatsCard
        iconSrc="/icons/dashboard/user-plus-icon.svg"
        label="New Users Today"
        value="234"
        change={15.3}
        changeType="increase"
      />
      <StatsCard
        iconSrc="/icons/dashboard/dollar-icon.svg"
        label="Revenue"
        value="$45,678"
        change={12.5}
        changeType="increase"
      />
    </div>
  )
}
