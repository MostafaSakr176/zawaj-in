"use client"

import { useEffect, useState } from "react"
import { StatsCard } from "./StatsCard"
import { getUsersForStats } from "@/lib/adminApi"

interface UserStats {
  totalUsers: number
  maleUsers: number
  femaleUsers: number
  subscriptions: number
}

export function StatsCards() {
  const [stats, setStats] = useState<UserStats>({
    totalUsers: 0,
    maleUsers: 0,
    femaleUsers: 0,
    subscriptions: 0
  })
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    async function fetchStats() {
      try {
        const response = await getUsersForStats()
        if (response.success) {
          const users = response.data.users
          const maleCount = users.filter(user => user.gender === "male").length
          const femaleCount = users.filter(user => user.gender === "female").length
          
          setStats({
            totalUsers: response.data.pagination.total,
            maleUsers: maleCount,
            femaleUsers: femaleCount,
            subscriptions: 3200 // Placeholder - will be updated when subscriptions API is available
          })
        }
      } catch (error) {
        console.error("Failed to fetch user stats:", error)
      } finally {
        setLoading(false)
      }
    }

    fetchStats()
  }, [])

  const formatNumber = (num: number) => {
    return num.toLocaleString()
  }

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
      <StatsCard
        iconSrc="/icons/dashboard/users-teal.svg"
        label="Total Users"
        value={loading ? "..." : formatNumber(stats.totalUsers)}
        change={10.5}
        changeType="decrease"
      />
      <StatsCard
        iconSrc="/icons/dashboard/credit-card-purple.svg"
        label="Subscriptions"
        value={loading ? "..." : `$${formatNumber(stats.subscriptions)}`}
        change={10.5}
        changeType="increase"
      />
      <StatsCard
        iconSrc="/icons/dashboard/user-blue.svg"
        label="Total Males"
        value={loading ? "..." : formatNumber(stats.maleUsers)}
        change={10.5}
        changeType="decrease"
      />
      <StatsCard
        iconSrc="/icons/dashboard/user-pink.svg"
        label="Total Females"
        value={loading ? "..." : formatNumber(stats.femaleUsers)}
        change={10.5}
        changeType="increase"
      />
    </div>
  )
}
