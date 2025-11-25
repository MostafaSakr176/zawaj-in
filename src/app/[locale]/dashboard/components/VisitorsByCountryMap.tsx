"use client"

import { useState, useEffect, memo, useCallback } from "react"
import { RefreshCw, Users, Loader2 } from "lucide-react"
import {
  ComposableMap,
  Geographies,
  Geography,
  Marker,
  ZoomableGroup,
} from "react-simple-maps"
import { getVisitorsByCountry, CountryHeatmapData, GetVisitorsByCountryParams } from "@/lib/adminApi"

const geoUrl = "https://cdn.jsdelivr.net/npm/world-atlas@2/countries-110m.json"

function VisitorsByCountryMapComponent() {
  const [region, setRegion] = useState<GetVisitorsByCountryParams["region"]>("middle_east")
  const [period, setPeriod] = useState<GetVisitorsByCountryParams["period"]>("month")
  const [selectedCountry, setSelectedCountry] = useState<CountryHeatmapData | null>(null)
  const [countryData, setCountryData] = useState<CountryHeatmapData[]>([])
  const [loading, setLoading] = useState(true)
  const [refreshing, setRefreshing] = useState(false)
  const [error, setError] = useState<string | null>(null)

  // Build highlighted countries map from API data
  const highlightedCountries = countryData.reduce((acc, country) => {
    acc[country.name] = country.color
    return acc
  }, {} as Record<string, string>)

  const fetchData = useCallback(async (showRefreshing = false) => {
    try {
      if (showRefreshing) {
        setRefreshing(true)
      } else {
        setLoading(true)
      }
      setError(null)
      
      const response = await getVisitorsByCountry({ region, period })
      
      if (response.success) {
        setCountryData(response.data.countries)
      } else {
        setError("Failed to load data")
      }
    } catch (err) {
      console.error("Failed to fetch visitors by country:", err)
      setError("Failed to load data")
    } finally {
      setLoading(false)
      setRefreshing(false)
    }
  }, [region, period])

  useEffect(() => {
    fetchData()
  }, [fetchData])

  const handleRefresh = () => {
    fetchData(true)
  }

  // Center coordinates based on region
  const regionConfig: Record<string, { center: [number, number]; zoom: number }> = {
    all: { center: [0, 20], zoom: 1 },
    middle_east: { center: [45, 25], zoom: 3 },
    europe: { center: [15, 50], zoom: 3 },
    asia: { center: [100, 35], zoom: 2 },
    africa: { center: [20, 5], zoom: 2 },
    americas: { center: [-80, 15], zoom: 1.5 },
  }

  const currentRegion = regionConfig[region || "middle_east"]

  const handleCountryClick = (countryName: string) => {
    const country = countryData.find(c => c.name === countryName)
    if (country) {
      setSelectedCountry(country)
    }
  }

  const handleMarkerClick = (country: CountryHeatmapData) => {
    setSelectedCountry(country)
  }

  // Calculate positions for tooltips dynamically based on coordinates
  const getTooltipPosition = (coordinates: [number, number], index: number) => {
    // Spread positions to avoid overlap
    const baseOffset = (index % 3) * 15
    return {
      left: `${20 + baseOffset + (index * 12) % 50}%`,
      top: `${20 + (index * 15) % 40}%`,
    }
  }

  return (
    <div className="bg-white rounded-2xl border border-[#DFE1E7] p-6">
      {/* Header */}
      <div className="flex items-center justify-between mb-4">
        <h3 className="text-base font-semibold text-[#0D0D12]">Visitors by Country</h3>
        <div className="flex items-center gap-2">
          <select
            value={region}
            onChange={(e) => setRegion(e.target.value as GetVisitorsByCountryParams["region"])}
            className="px-3 py-1.5 border border-[#DFE1E7] rounded-lg text-sm text-[#666D80] bg-white focus:outline-none cursor-pointer"
          >
            <option value="all">All Regions</option>
            <option value="middle_east">Middle East</option>
            <option value="europe">Europe</option>
            <option value="asia">Asia</option>
            <option value="africa">Africa</option>
            <option value="americas">Americas</option>
          </select>
          <select
            value={period}
            onChange={(e) => setPeriod(e.target.value as GetVisitorsByCountryParams["period"])}
            className="px-3 py-1.5 border border-[#DFE1E7] rounded-lg text-sm text-[#666D80] bg-white focus:outline-none cursor-pointer"
          >
            <option value="all">All Time</option>
            <option value="week">Week</option>
            <option value="month">Month</option>
            <option value="year">Year</option>
          </select>
          <button 
            onClick={handleRefresh}
            disabled={refreshing}
            className="p-1.5 hover:bg-gray-100 rounded-lg transition-colors disabled:opacity-50"
          >
            <RefreshCw className={`w-4 h-4 text-[#666D80] ${refreshing ? 'animate-spin' : ''}`} />
          </button>
        </div>
      </div>

      {/* Map Container with Sidebar */}
      <div className="relative h-[320px] bg-[#F8FAFC] rounded-xl overflow-hidden flex">
        {/* Loading State */}
        {loading && (
          <div className="absolute inset-0 bg-white/80 flex items-center justify-center z-30">
            <div className="flex items-center gap-2 text-[#666D80]">
              <Loader2 className="w-5 h-5 animate-spin" />
              <span className="text-sm">Loading map data...</span>
            </div>
          </div>
        )}

        {/* Error State */}
        {error && !loading && (
          <div className="absolute inset-0 bg-white/80 flex items-center justify-center z-30">
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
        )}

        {/* Country Details Sidebar */}
        {selectedCountry && (
          <div className="w-72 bg-white border-r border-[#DFE1E7] p-4 flex flex-col z-20">
            {/* Country Header */}
            <div className="flex items-center gap-2 mb-6">
              <span className="text-xl">{selectedCountry.flag}</span>
              <h4 className="text-base font-semibold text-[#0D0D12]">{selectedCountry.name}</h4>
            </div>

            {/* Total Users */}
            <div className="flex items-center gap-2 mb-4 pb-4 border-b border-[#DFE1E7]">
              <Users className="w-4 h-4 text-[#666D80]" />
              <span className="text-sm font-medium text-[#0D0D12]">{selectedCountry.users}</span>
            </div>

            {/* Cities List */}
            <div className="flex-1 space-y-4 overflow-y-auto">
              {selectedCountry.cities.map((city, index) => (
                <div key={index} className="flex items-center justify-between">
                  <span className="text-sm text-[#0D0D12]">{city.name}</span>
                  <div className="flex items-center gap-1.5 text-sm text-[#666D80]">
                    <Users className="w-4 h-4" />
                    <span>{city.users}</span>
                  </div>
                </div>
              ))}
            </div>

            {/* Done Button */}
            <button
              onClick={() => setSelectedCountry(null)}
              className="w-full mt-4 py-2.5 bg-[#301B69] text-white rounded-lg text-sm font-medium hover:bg-[#301B69]/90 transition-colors"
            >
              Done
            </button>
          </div>
        )}

        {/* Map */}
        <div className="flex-1 relative">
          <ComposableMap
            projection="geoMercator"
            projectionConfig={{
              scale: 150,
            }}
            style={{ width: "100%", height: "100%" }}
          >
            <ZoomableGroup center={currentRegion.center} zoom={currentRegion.zoom}>
              <Geographies geography={geoUrl}>
                {({ geographies }) =>
                  geographies.map((geo) => {
                    const countryName = geo.properties.name
                    const isHighlighted = countryName ? highlightedCountries[countryName] : undefined

                    return (
                      <Geography
                        key={geo.rsmKey}
                        geography={geo}
                        fill={isHighlighted || "#E2E8F0"}
                        fillOpacity={isHighlighted ? 0.8 : 1}
                        stroke="#FFFFFF"
                        strokeWidth={0.5}
                        onClick={() => countryName && handleCountryClick(countryName)}
                        style={{
                          default: { outline: "none", cursor: isHighlighted ? "pointer" : "default" },
                          hover: {
                            fill: isHighlighted || "#CBD5E1",
                            outline: "none",
                            cursor: isHighlighted ? "pointer" : "default"
                          },
                          pressed: { outline: "none" },
                        }}
                      />
                    )
                  })
                }
              </Geographies>

              {/* Markers */}
              {countryData.map((country, index) => (
                <Marker
                  key={index}
                  coordinates={country.coordinates}
                  onClick={() => handleMarkerClick(country)}
                  style={{ cursor: "pointer" }}
                >
                  <g>
                    {/* Flag marker */}
                    <rect
                      x={-4}
                      y={-12}
                      width={8}
                      height={10}
                      rx={1}
                      fill={country.color}
                      stroke="#FFFFFF"
                      strokeWidth={1}
                    />
                    {/* Pin point */}
                    <polygon
                      points="-4,0 4,0 0,6"
                      fill={country.color}
                    />
                  </g>
                </Marker>
              ))}
            </ZoomableGroup>
          </ComposableMap>

          {/* Floating Tooltips */}
          {countryData.slice(0, 5).map((country, index) => {
            const pos = getTooltipPosition(country.coordinates, index)

            return (
              <div
                key={index}
                onClick={() => handleMarkerClick(country)}
                className="absolute bg-white rounded-lg shadow-lg px-3 py-2 border border-[#E5E7EB] whitespace-nowrap z-10 cursor-pointer hover:shadow-xl transition-shadow"
                style={pos}
              >
                <div className="flex items-center gap-1.5">
                  <span className="text-sm">{country.flag}</span>
                  <p className="text-xs font-semibold text-[#0D0D12]">{country.name}</p>
                </div>
                <div className="flex items-center gap-1 text-xs text-[#666D80]">
                  <Users className="w-3 h-3" />
                  <span>{country.users}</span>
                </div>
              </div>
            )
          })}
        </div>
      </div>

      {/* Legend */}
      <div className="flex items-center justify-center gap-6 mt-4 pt-4 border-t border-[#F0F0F0]">
        <div className="flex items-center gap-2">
          <div className="w-3 h-3 rounded-full bg-[#EF4444]" />
          <span className="text-xs text-[#666D80]">High (≥60%)</span>
        </div>
        <div className="flex items-center gap-2">
          <div className="w-3 h-3 rounded-full bg-[#EAB308]" />
          <span className="text-xs text-[#666D80]">Medium (≥30%)</span>
        </div>
        <div className="flex items-center gap-2">
          <div className="w-3 h-3 rounded-full bg-[#22C55E]" />
          <span className="text-xs text-[#666D80]">Low (≥10%)</span>
        </div>
        <div className="flex items-center gap-2">
          <div className="w-3 h-3 rounded-full bg-[#6366F1]" />
          <span className="text-xs text-[#666D80]">Very Low</span>
        </div>
      </div>
    </div>
  )
}

export const VisitorsByCountryMap = memo(VisitorsByCountryMapComponent)
