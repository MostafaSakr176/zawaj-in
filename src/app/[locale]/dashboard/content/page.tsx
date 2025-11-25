"use client"

import { useState, useEffect } from "react"
import { DashboardHeader } from "../components/DashboardHeader"
import { DashboardSidebar } from "../components/DashboardSidebar"
import { Breadcrumb } from "../components/Breadcrumb"
import { ContentCard } from "../components/ContentCard"
import { 
  getSystemSettings, 
  updateSystemSetting,
  deleteSystemSetting,
  initializeDefaultSettings, 
  SystemSetting 
} from "@/lib/adminApi"
import { Plus, RefreshCw, Loader2 } from "lucide-react"
import toast from "react-hot-toast"

export default function ContentPage() {
  const [settings, setSettings] = useState<SystemSetting[]>([])
  const [loading, setLoading] = useState(true)
  const [initializing, setInitializing] = useState(false)
  const [deletingKey, setDeletingKey] = useState<string | null>(null)

  const fetchSettings = async () => {
    try {
      setLoading(true)
      const response = await getSystemSettings()
      if (response.success) {
        setSettings(response.data)
      }
    } catch (error: any) {
      console.error("Failed to fetch settings:", error)
      toast.error("Failed to load content settings")
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    fetchSettings()
  }, [])

  const handleInitializeDefaults = async () => {
    try {
      setInitializing(true)
      const response = await initializeDefaultSettings()
      if (response.success) {
        toast.success("Default settings initialized successfully")
        fetchSettings()
      }
    } catch (error: any) {
      console.error("Failed to initialize defaults:", error)
      toast.error(error.response?.data?.message || "Failed to initialize default settings")
    } finally {
      setInitializing(false)
    }
  }

  const handleDelete = async (key: string) => {
    try {
      setDeletingKey(key)
      await deleteSystemSetting(key)
      toast.success("Content deleted successfully")
      fetchSettings()
    } catch (error: any) {
      console.error("Failed to delete:", error)
      toast.error(error.response?.data?.message || "Failed to delete content")
    } finally {
      setDeletingKey(null)
    }
  }

  const handleSave = async (key: string, contentEn: string, contentAr: string) => {
    await updateSystemSetting(key, {
      valueEn: contentEn,
      valueAr: contentAr,
    })
    toast.success("Content updated successfully")
    fetchSettings()
  }

  const formatTitle = (key: string) => {
    return key
      .split("_")
      .map(word => word.charAt(0).toUpperCase() + word.slice(1))
      .join(" ")
  }

  return (
    <div className="flex h-screen bg-gray-50">
      <DashboardSidebar />

      <div className="flex-1 flex flex-col overflow-hidden">
        <DashboardHeader />

        <main className="flex-1 overflow-y-auto p-8">
          <div className="max-w-5xl mx-auto space-y-6">
            {/* Breadcrumb */}
            <div className="flex items-center justify-between">
              <Breadcrumb
                items={[
                  { label: "Management", href: "/dashboard" },
                  { label: "Content" }
                ]}
              />

              <div className="flex items-center gap-2">
                {settings.length === 0 && !loading && (
                  <button
                    onClick={handleInitializeDefaults}
                    disabled={initializing}
                    className="flex items-center gap-2 px-4 py-2 bg-[#301B69] text-white text-sm font-medium rounded-lg hover:bg-[#301B69]/90 transition-colors disabled:opacity-50"
                  >
                    {initializing ? (
                      <Loader2 className="w-4 h-4 animate-spin" />
                    ) : (
                      <Plus className="w-4 h-4" />
                    )}
                    Initialize Defaults
                  </button>
                )}
                <button
                  onClick={() => fetchSettings()}
                  disabled={loading}
                  className="flex items-center gap-2 px-4 py-2 bg-white border border-[#DFE1E7] text-[#0D0D12] text-sm font-medium rounded-lg hover:bg-[#F9FAFB] transition-colors"
                >
                  <RefreshCw className={`w-4 h-4 ${loading ? "animate-spin" : ""}`} />
                  Refresh
                </button>
              </div>
            </div>

            {/* Content Cards */}
            <div className="space-y-6">
              {loading ? (
                <div className="flex flex-col items-center justify-center py-20 bg-white rounded-2xl border border-[#DFE1E7]">
                  <Loader2 className="w-10 h-10 text-[#301B69] animate-spin mb-4" />
                  <p className="text-gray-500">Loading content settings...</p>
                </div>
              ) : settings.length === 0 ? (
                <div className="flex flex-col items-center justify-center py-20 bg-white rounded-2xl border border-[#DFE1E7]">
                  <p className="text-gray-500 mb-4">No content settings found</p>
                  <button
                    onClick={handleInitializeDefaults}
                    disabled={initializing}
                    className="flex items-center gap-2 px-4 py-2 bg-[#301B69] text-white text-sm font-medium rounded-lg hover:bg-[#301B69]/90 transition-colors disabled:opacity-50"
                  >
                    {initializing ? (
                      <Loader2 className="w-4 h-4 animate-spin" />
                    ) : (
                      <Plus className="w-4 h-4" />
                    )}
                    Initialize Default Content
                  </button>
                </div>
              ) : (
                settings.map((setting) => (
                  <ContentCard
                    key={setting.id}
                    title={formatTitle(setting.key)}
                    status={setting.isActive ? "Active" : "Inactive"}
                    contentEn={setting.valueEn}
                    contentAr={setting.valueAr}
                    contentType={setting.type}
                    settingKey={setting.key}
                    onDelete={() => handleDelete(setting.key)}
                    onSave={(contentEn, contentAr) => handleSave(setting.key, contentEn, contentAr)}
                    loading={deletingKey === setting.key}
                  />
                ))
              )}
            </div>
          </div>
        </main>
      </div>
    </div>
  )
}
