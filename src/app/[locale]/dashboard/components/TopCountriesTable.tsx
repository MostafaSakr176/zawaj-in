"use client"

import { useState, useEffect, useCallback } from "react"
import { RefreshCw, TrendingUp, TrendingDown, Globe, Loader2 } from "lucide-react"
import { getTopCountries, TopCountryData } from "@/lib/adminApi"

export function TopCountriesTable() {
  const [countriesData, setCountriesData] = useState<TopCountryData[]>([])
  const [totalUsers, setTotalUsers] = useState(0)
  const [totalRevenue, setTotalRevenue] = useState(0)
  const [loading, setLoading] = useState(true)
  const [refreshing, setRefreshing] = useState(false)
  const [error, setError] = useState<string | null>(null)

  const fetchData = useCallback(async (showRefreshing = false) => {
    try {
      if (showRefreshing) {
        setRefreshing(true)
      } else {
        setLoading(true)
      }
      setError(null)

      const response = await getTopCountries()
      
      if (response.success) {
        setCountriesData(response.data.countries)
        setTotalUsers(response.data.totalUsers)
        setTotalRevenue(response.data.totalRevenue)
      } else {
        setError("Failed to load data")
      }
    } catch (err) {
      console.error("Failed to fetch top countries:", err)
      setError("Failed to load data")
    } finally {
      setLoading(false)
      setRefreshing(false)
    }
  }, [])

  useEffect(() => {
    fetchData()
  }, [fetchData])

  const handleRefresh = () => {
    fetchData(true)
  }

  if (loading) {
    return (
      <div className="bg-white rounded-2xl border border-[#DFE1E7] p-6">
        <div className="flex items-center justify-center h-64">
          <div className="flex items-center gap-2 text-[#666D80]">
            <Loader2 className="w-5 h-5 animate-spin" />
            <span className="text-sm">Loading countries data...</span>
          </div>
        </div>
      </div>
    )
  }

  if (error) {
    return (
      <div className="bg-white rounded-2xl border border-[#DFE1E7] p-6">
        <div className="flex items-center justify-center h-64">
          <div className="text-center">
            <p className="text-sm text-red-500 mb-2">{error}</p>
            <button
              onClick={() => fetchData()}
              className="text-sm text-[#301B69] hover:underline"
            >
              Try again
            </button>
          </div>
        </div>
      </div>
    )
  }

  return (
    <div className="bg-white rounded-2xl border border-[#DFE1E7] p-6">
      {/* Header */}
      <div className="flex items-center justify-between mb-6">
        <div className="flex items-center gap-3">
          <div className="p-2 bg-indigo-50 rounded-lg">
            <Globe className="w-5 h-5 text-indigo-600" />
          </div>
          <div>
            <h3 className="text-base font-semibold text-[#0D0D12]">Top Countries</h3>
            <p className="text-xs text-[#666D80]">User distribution by country</p>
          </div>
        </div>
        <button 
          onClick={handleRefresh}
          disabled={refreshing}
          className="p-1.5 hover:bg-gray-100 rounded-lg transition-colors disabled:opacity-50"
        >
          <RefreshCw className={`w-4 h-4 text-[#666D80] ${refreshing ? 'animate-spin' : ''}`} />
        </button>
      </div>

      {/* Summary Stats */}
      <div className="grid grid-cols-2 gap-4 mb-6">
        <div className="p-4 bg-gradient-to-br from-violet-50 to-purple-50 rounded-xl">
          <p className="text-xs text-[#666D80] mb-1">Total Users</p>
          <p className="text-2xl font-bold text-[#301B69]">{totalUsers.toLocaleString()}</p>
        </div>
        <div className="p-4 bg-gradient-to-br from-emerald-50 to-green-50 rounded-xl">
          <p className="text-xs text-[#666D80] mb-1">Total Revenue</p>
          <p className="text-2xl font-bold text-emerald-600">
            ${totalRevenue >= 1000 ? `${(totalRevenue / 1000).toFixed(1)}K` : totalRevenue.toLocaleString()}
          </p>
        </div>
      </div>

      {/* Table */}
      <div className="overflow-x-auto">
        <table className="w-full">
          <thead>
            <tr className="border-b border-[#DFE1E7]">
              <th className="text-left py-3 px-2 text-xs font-medium text-[#666D80]">#</th>
              <th className="text-left py-3 px-2 text-xs font-medium text-[#666D80]">Country</th>
              <th className="text-right py-3 px-2 text-xs font-medium text-[#666D80]">Users</th>
              <th className="text-right py-3 px-2 text-xs font-medium text-[#666D80]">Share</th>
              <th className="text-right py-3 px-2 text-xs font-medium text-[#666D80]">Growth</th>
              <th className="text-right py-3 px-2 text-xs font-medium text-[#666D80]">Revenue</th>
            </tr>
          </thead>
          <tbody>
            {countriesData.map((country) => (
              <tr 
                key={country.rank} 
                className="border-b border-[#F0F0F0] hover:bg-gray-50 transition-colors"
              >
                <td className="py-3 px-2">
                  <span className={`
                    w-6 h-6 rounded-full flex items-center justify-center text-xs font-semibold
                    ${country.rank === 1 ? 'bg-amber-100 text-amber-700' : 
                      country.rank === 2 ? 'bg-gray-100 text-gray-700' : 
                      country.rank === 3 ? 'bg-orange-100 text-orange-700' : 
                      'bg-gray-50 text-gray-500'}
                  `}>
                    {country.rank}
                  </span>
                </td>
                <td className="py-3 px-2">
                  <div className="flex items-center gap-2">
                    <span className="text-lg">{country.flag}</span>
                    <span className="text-sm font-medium text-[#0D0D12]">{country.country}</span>
                  </div>
                </td>
                <td className="py-3 px-2 text-right">
                  <span className="text-sm font-semibold text-[#0D0D12]">{country.users.toLocaleString()}</span>
                </td>
                <td className="py-3 px-2 text-right">
                  <div className="flex items-center justify-end gap-2">
                    <div className="w-16 bg-gray-100 rounded-full h-1.5">
                      <div
                        className="h-1.5 rounded-full bg-[#301B69]"
                        style={{ width: `${Math.min(country.percentage, 100)}%` }}
                      />
                    </div>
                    <span className="text-xs text-[#666D80] w-10">{country.percentage.toFixed(1)}%</span>
                  </div>
                </td>
                <td className="py-3 px-2 text-right">
                  <div className={`
                    inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-xs font-medium
                    ${country.growth >= 0 
                      ? 'bg-green-50 text-green-600' 
                      : 'bg-red-50 text-red-600'}
                  `}>
                    {country.growth >= 0 ? (
                      <TrendingUp className="w-3 h-3" />
                    ) : (
                      <TrendingDown className="w-3 h-3" />
                    )}
                    {country.growth >= 0 ? '+' : ''}{country.growth.toFixed(1)}%
                  </div>
                </td>
                <td className="py-3 px-2 text-right">
                  <span className="text-sm font-semibold text-emerald-600">
                    ${country.revenue.toLocaleString()}
                  </span>
                </td>
              </tr>
            ))}
          </tbody>
        </table>

        {countriesData.length === 0 && (
          <div className="text-center py-8 text-[#666D80]">
            <p className="text-sm">No country data available</p>
          </div>
        )}
      </div>
    </div>
  )
}
