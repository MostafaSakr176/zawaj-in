"use client"

import { useState, useRef } from "react"
import { Pencil } from "lucide-react"
import Image from "next/image"

interface AvatarUploadProps {
  currentImage?: string
  onImageChange?: (file: File) => void
}

export function AvatarUpload({ currentImage, onImageChange }: AvatarUploadProps) {
  const [preview, setPreview] = useState<string | null>(currentImage || null)
  const fileInputRef = useRef<HTMLInputElement>(null)

  const handleClick = () => {
    fileInputRef.current?.click()
  }

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (file) {
      const reader = new FileReader()
      reader.onloadend = () => {
        setPreview(reader.result as string)
      }
      reader.readAsDataURL(file)
      onImageChange?.(file)
    }
  }

  return (
    <div className="space-y-2">
      <label className="text-sm font-medium text-[#0D0D12]">Avatar</label>
      <p className="text-xs text-[#666D80]">
        Only *.png, *.jpg and *.jpeg image files are accepted
      </p>

      <div className="relative w-32 h-32 mt-3">
        <div className="w-full h-full rounded-lg overflow-hidden bg-[#F5F5F5]">
          {preview ? (
            <Image
              src={preview}
              alt="Avatar"
              fill
              className="object-cover"
            />
          ) : (
            <div className="w-full h-full flex items-center justify-center text-4xl font-semibold text-[#301B69]">
              M
            </div>
          )}
        </div>

        {/* Edit Button */}
        <button
          type="button"
          onClick={handleClick}
          className="absolute -top-2 -right-2 w-8 h-8 bg-white border border-[#DFE1E7] rounded-full flex items-center justify-center shadow-sm hover:bg-gray-50 transition-colors"
        >
          <Pencil className="w-4 h-4 text-[#301B69]" />
        </button>

        <input
          ref={fileInputRef}
          type="file"
          accept=".png,.jpg,.jpeg"
          onChange={handleFileChange}
          className="hidden"
        />
      </div>
    </div>
  )
}
