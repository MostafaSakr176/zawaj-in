"use client"

import { useState } from "react"
import { Badge } from "./Badge"
import Image from "next/image"

interface ContentCardProps {
  title: string
  status: "Active" | "Inactive"
  content: string
  imageUrl?: string
  imageName?: string
  onDelete?: () => void
  onSave?: (content: string) => void
}

export function ContentCard({
  title,
  status,
  content: initialContent,
  imageUrl,
  imageName = "Image1121234346",
  onDelete,
  onSave
}: ContentCardProps) {
  const [isEditing, setIsEditing] = useState(false)
  const [editedContent, setEditedContent] = useState(initialContent)

  const handleEdit = () => {
    setIsEditing(true)
    setEditedContent(initialContent)
  }

  const handleCancel = () => {
    setIsEditing(false)
    setEditedContent(initialContent)
  }

  const handleApply = () => {
    onSave?.(editedContent)
    setIsEditing(false)
  }

  const handleUpdateImage = () => {
    console.log("Update image clicked")
  }

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
                className="px-4 py-2 bg-[#301B69] text-white text-sm font-medium rounded-lg hover:bg-[#301B69]/90 transition-colors"
              >
                Apply
              </button>
              <button
                onClick={handleCancel}
                className="px-4 py-2 bg-white border border-[#DFE1E7] text-[#0D0D12] text-sm font-medium rounded-lg hover:bg-[#F9FAFB] transition-colors"
              >
                Cancel
              </button>
            </>
          ) : (
            <>
              <button
                onClick={onDelete}
                className="px-4 py-2 bg-[#DF1C41] text-white text-sm font-medium rounded-lg hover:bg-[#DF1C41]/90 transition-colors"
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

      {/* Content */}
      {isEditing ? (
        <textarea
          value={editedContent}
          onChange={(e) => setEditedContent(e.target.value)}
          className="w-full h-48 p-4 text-sm text-[#666D80] leading-relaxed mb-6 border border-[#DFE1E7] rounded-xl focus:outline-none focus:ring-2 focus:ring-[#301B69]/20 resize-none"
        />
      ) : (
        <p className="text-sm text-[#666D80] leading-relaxed mb-6">
          {initialContent}
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
