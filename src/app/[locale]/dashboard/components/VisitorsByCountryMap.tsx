"use client"

import { useState, memo } from "react"
import { RefreshCw, Users } from "lucide-react"
import {
  ComposableMap,
  Geographies,
  Geography,
  Marker,
  ZoomableGroup,
} from "react-simple-maps"

const geoUrl = "https://cdn.jsdelivr.net/npm/world-atlas@2/countries-110m.json"

interface CityData {
  name: string
  users: string
}

interface CountryData {
  name: string
  users: string
  coordinates: [number, number]
  color: string
  flag: string
  cities: CityData[]
}

const countryData: CountryData[] = [
  {
    name: "Libya",
    users: "3,000 U",
    coordinates: [17.2283, 26.3351],
    color: "#22C55E",
    flag: "🇱🇾",
    cities: [
      { name: "Tripoli", users: "1,500 User" },
      { name: "Benghazi", users: "800 User" },
      { name: "Misrata", users: "400 User" },
      { name: "Others", users: "300 User" },
    ]
  },
  {
    name: "Egypt",
    users: "27,360 User",
    coordinates: [30.8025, 26.8206],
    color: "#EF4444",
    flag: "🇪🇬",
    cities: [
      { name: "Cairo", users: "15,000 User" },
      { name: "Alexandria", users: "6,000 User" },
      { name: "Giza", users: "4,000 User" },
      { name: "Others", users: "2,360 User" },
    ]
  },
  {
    name: "Saudi Arabia",
    users: "27,360 User",
    coordinates: [45.0792, 23.8859],
    color: "#EAB308",
    flag: "🇸🇦",
    cities: [
      { name: "Riyadh", users: "1400K User" },
      { name: "Jeddah", users: "700 User" },
      { name: "Makkah", users: "800 User" },
      { name: "Madinah", users: "500 User" },
      { name: "Dammam", users: "200 User" },
      { name: "Others", users: "150 User" },
    ]
  },
]

// Country codes for highlighting
const highlightedCountries: Record<string, string> = {
  "Libya": "#22C55E",
  "Egypt": "#EF4444",
  "Saudi Arabia": "#EAB308",
}

function VisitorsByCountryMapComponent() {
  const [region, setRegion] = useState("middle_east")
  const [period, setPeriod] = useState("month")
  const [selectedCountry, setSelectedCountry] = useState<CountryData | null>(null)

  // Center coordinates based on region
  const regionConfig: Record<string, { center: [number, number]; zoom: number }> = {
    middle_east: { center: [35, 25], zoom: 3 },
    europe: { center: [15, 50], zoom: 3 },
    asia: { center: [100, 35], zoom: 2 },
    africa: { center: [20, 5], zoom: 2 },
  }

  const currentRegion = regionConfig[region] || regionConfig.middle_east

  const handleCountryClick = (countryName: string) => {
    const country = countryData.find(c => c.name === countryName)
    if (country) {
      setSelectedCountry(country)
    }
  }

  const handleMarkerClick = (country: CountryData) => {
    setSelectedCountry(country)
  }

  return (
    <div className="bg-white rounded-2xl border border-[#DFE1E7] p-6">
      {/* Header */}
      <div className="flex items-center justify-between mb-4">
        <h3 className="text-base font-semibold text-[#0D0D12]">Visitors by Country</h3>
        <div className="flex items-center gap-2">
          <select
            value={region}
            onChange={(e) => setRegion(e.target.value)}
            className="px-3 py-1.5 border border-[#DFE1E7] rounded-lg text-sm text-[#666D80] bg-white focus:outline-none cursor-pointer"
          >
            <option value="middle_east">Middle East</option>
            <option value="europe">Europe</option>
            <option value="asia">Asia</option>
            <option value="africa">Africa</option>
          </select>
          <select
            value={period}
            onChange={(e) => setPeriod(e.target.value)}
            className="px-3 py-1.5 border border-[#DFE1E7] rounded-lg text-sm text-[#666D80] bg-white focus:outline-none cursor-pointer"
          >
            <option value="month">Month</option>
            <option value="week">Week</option>
            <option value="year">Year</option>
          </select>
          <button className="p-1.5 hover:bg-gray-100 rounded-lg transition-colors">
            <RefreshCw className="w-4 h-4 text-[#666D80]" />
          </button>
        </div>
      </div>

      {/* Map Container with Sidebar */}
      <div className="relative h-[320px] bg-[#F8FAFC] rounded-xl overflow-hidden flex">
        {/* Country Details Sidebar */}
        {selectedCountry && (
          <div className="w-72 bg-white border-r border-[#DFE1E7] p-4 flex flex-col z-20">
            {/* Country Header */}
            <div className="flex items-center gap-2 mb-6">
              <span className="text-xl">{selectedCountry.flag}</span>
              <h4 className="text-base font-semibold text-[#0D0D12]">{selectedCountry.name}</h4>
            </div>

            {/* Cities List */}
            <div className="flex-1 space-y-4">
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
          {countryData.map((country, index) => {
            const positions = [
              { left: "25%", top: "25%" },
              { left: "45%", top: "30%" },
              { left: "60%", top: "45%" },
            ]
            const pos = positions[index] || positions[0]

            return (
              <div
                key={index}
                onClick={() => handleMarkerClick(country)}
                className="absolute bg-white rounded-lg shadow-lg px-3 py-2 border border-[#E5E7EB] whitespace-nowrap z-10 cursor-pointer hover:shadow-xl transition-shadow"
                style={pos}
              >
                <p className="text-xs font-semibold text-[#0D0D12]">{country.name}</p>
                <div className="flex items-center gap-1 text-xs text-[#666D80]">
                  <Users className="w-3 h-3" />
                  <span>{country.users}</span>
                </div>
              </div>
            )
          })}
        </div>
      </div>
    </div>
  )
}

export const VisitorsByCountryMap = memo(VisitorsByCountryMapComponent)
