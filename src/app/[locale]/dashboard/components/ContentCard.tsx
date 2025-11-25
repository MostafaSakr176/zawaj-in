"use client"

import { useState } from "react"
import { Badge } from "./Badge"
import Image from "next/image"
import { Loader2 } from "lucide-react"

interface ContentCardProps {
  title: string
  status: "Active" | "Inactive"
  contentEn: string
  contentAr: string
  contentType: string
  settingKey: string
  imageUrl?: string
  imageName?: string
  onDelete?: () => void
  onSave?: (contentEn: string, contentAr: string) => Promise<void>
  loading?: boolean
}

export function ContentCard({
  title,
  status,
  contentEn: initialContentEn,
  contentAr: initialContentAr,
  contentType,
  settingKey,
  imageUrl,
  imageName = "Image1121234346",
  onDelete,
  onSave,
  loading = false
}: ContentCardProps) {
  const [isEditing, setIsEditing] = useState(false)
  const [editedContentEn, setEditedContentEn] = useState(initialContentEn)
  const [editedContentAr, setEditedContentAr] = useState(initialContentAr)
  const [saving, setSaving] = useState(false)
  const [activeLanguage, setActiveLanguage] = useState<"en" | "ar">("en")

  const handleEdit = () => {
    setIsEditing(true)
    setEditedContentEn(initialContentEn)
    setEditedContentAr(initialContentAr)
  }

  const handleCancel = () => {
    setIsEditing(false)
    setEditedContentEn(initialContentEn)
    setEditedContentAr(initialContentAr)
  }

  const handleApply = async () => {
    if (onSave) {
      setSaving(true)
      try {
        await onSave(editedContentEn, editedContentAr)
        setIsEditing(false)
      } catch (error) {
        // Error handling done in parent
      } finally {
        setSaving(false)
      }
    }
  }

  const handleUpdateImage = () => {
    console.log("Update image clicked")
  }

  const displayContent = activeLanguage === "en" ? initialContentEn : initialContentAr
  const editedContent = activeLanguage === "en" ? editedContentEn : editedContentAr

  return (
    <div className="bg-white rounded-2xl border border-[#DFE1E7] p-6 shadow-sm">
      {/* Header */}
      <div className="flex items-start justify-between mb-4">
        <div className="flex items-center gap-3">
          <h2 className="text-lg font-semibold text-[#0D0D12]">{title}</h2>
          <Badge variant={status === "Active" ? "success" : "neutral"} showDot>
            {status}
          </Badge>
        </div>

        <div className="flex items-center gap-2">
          {isEditing ? (
            <>
              <button
                onClick={handleApply}
                disabled={saving}
                className="px-4 py-2 bg-[#301B69] text-white text-sm font-medium rounded-lg hover:bg-[#301B69]/90 transition-colors disabled:opacity-50 flex items-center gap-2"
              >
                {saving && <Loader2 className="w-4 h-4 animate-spin" />}
                Apply
              </button>
              <button
                onClick={handleCancel}
                disabled={saving}
                className="px-4 py-2 bg-white border border-[#DFE1E7] text-[#0D0D12] text-sm font-medium rounded-lg hover:bg-[#F9FAFB] transition-colors"
              >
                Cancel
              </button>
            </>
          ) : (
            <>
              <button
                onClick={onDelete}
                disabled={loading}
                className="px-4 py-2 bg-[#DF1C41] text-white text-sm font-medium rounded-lg hover:bg-[#DF1C41]/90 transition-colors disabled:opacity-50"
              >
                Delete
              </button>
              <button
                onClick={handleEdit}
                className="px-4 py-2 bg-white border border-[#DFE1E7] text-[#0D0D12] text-sm font-medium rounded-lg hover:bg-[#F9FAFB] transition-colors"
              >
                Edit
              </button>
            </>
          )}
        </div>
      </div>

      {/* Language Tabs */}
      <div className="flex gap-2 mb-4">
        <button
          onClick={() => setActiveLanguage("en")}
          className={`px-3 py-1.5 text-sm font-medium rounded-lg transition-colors ${
            activeLanguage === "en"
              ? "bg-[#301B69] text-white"
              : "bg-gray-100 text-gray-600 hover:bg-gray-200"
          }`}
        >
          🇺🇸 English
        </button>
        <button
          onClick={() => setActiveLanguage("ar")}
          className={`px-3 py-1.5 text-sm font-medium rounded-lg transition-colors ${
            activeLanguage === "ar"
              ? "bg-[#301B69] text-white"
              : "bg-gray-100 text-gray-600 hover:bg-gray-200"
          }`}
        >
          🇸🇦 العربية
        </button>
      </div>

      {/* Content */}
      {isEditing ? (
        <div className="space-y-3">
          {activeLanguage === "en" ? (
            <textarea
              value={editedContentEn}
              onChange={(e) => setEditedContentEn(e.target.value)}
              dir="ltr"
              className="w-full h-48 p-4 text-sm text-[#666D80] leading-relaxed mb-6 border border-[#DFE1E7] rounded-xl focus:outline-none focus:ring-2 focus:ring-[#301B69]/20 resize-none"
            />
          ) : (
            <textarea
              value={editedContentAr}
              onChange={(e) => setEditedContentAr(e.target.value)}
              dir="rtl"
              className="w-full h-48 p-4 text-sm text-[#666D80] leading-relaxed mb-6 border border-[#DFE1E7] rounded-xl focus:outline-none focus:ring-2 focus:ring-[#301B69]/20 resize-none"
            />
          )}
        </div>
      ) : (
        <p 
          className="text-sm text-[#666D80] leading-relaxed mb-6"
          dir={activeLanguage === "ar" ? "rtl" : "ltr"}
        >
          {displayContent || <span className="text-gray-400 italic">No content</span>}
        </p>
      )}

      {/* Page Image */}
      <div>
        <p className="text-sm font-medium text-[#0D0D12] mb-3">Page image</p>
        {isEditing ? (
          <div className="flex items-center gap-3">
            <span className="text-sm text-[#666D80]">{imageName}</span>
            <button
              onClick={handleUpdateImage}
              className="px-4 py-2 bg-[#301B69] text-white text-sm font-medium rounded-lg hover:bg-[#301B69]/90 transition-colors"
            >
              Update image
            </button>
          </div>
        ) : (
          <div className="relative w-48 h-48 rounded-xl overflow-hidden bg-[#F5F5F5]">
            {imageUrl ? (
              <Image
                src={imageUrl}
                alt={`${title} image`}
                fill
                className="object-cover"
              />
            ) : (
              <div className="w-full h-full bg-gradient-to-br from-[#E8E0F0] to-[#F5F5F5] flex items-center justify-center">
                <span className="text-[#A4ACB9] text-sm">No image</span>
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  )
}
