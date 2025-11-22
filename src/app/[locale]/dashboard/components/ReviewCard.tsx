"use client"

import { Star } from "lucide-react"
import Image from "next/image"

interface Author {
  name: string
  role: string
  avatar?: string
}

interface ReviewCardProps {
  id: string
  rating: number
  content: string
  author: Author
  onApprove?: () => void
  onDecline?: () => void
  showActions?: boolean
}

export function ReviewCard({
  id,
  rating,
  content,
  author,
  onApprove,
  onDecline,
  showActions = true
}: ReviewCardProps) {
  return (
    <div className="bg-white rounded-2xl border border-[#DFE1E7] p-8 shadow-sm">
      {/* Stars */}
      <div className="flex items-center gap-1.5 mb-5">
        {[...Array(5)].map((_, i) => (
          <Star
            key={i}
            className={`w-6 h-6 ${
              i < rating ? "fill-[#301B69] text-[#301B69]" : "fill-gray-200 text-gray-200"
            }`}
          />
        ))}
      </div>

      {/* Review Content */}
      <p className="text-base text-[#666D80] leading-relaxed mb-8">
        {content}
      </p>

      {/* Author and Actions */}
      <div className="flex items-center justify-between">
        {/* Author */}
        <div className="flex items-center gap-4">
          <div className="relative w-12 h-12 rounded-full overflow-hidden bg-[#F5F5F5]">
            {author.avatar ? (
              <Image
                src={author.avatar}
                alt={author.name}
                fill
                className="object-cover"
              />
            ) : (
              <div className="w-full h-full flex items-center justify-center text-base font-semibold text-[#301B69]">
                {author.name.charAt(0)}
              </div>
            )}
          </div>
          <div>
            <p className="text-base font-semibold text-[#0D0D12]">{author.name}</p>
            <p className="text-sm text-[#666D80]">{author.role}</p>
          </div>
        </div>

        {/* Actions */}
        {showActions && (
          <div className="flex items-center gap-3">
            <button
              onClick={onApprove}
              className="px-6 py-2.5 bg-[#301B69] text-white text-sm font-medium rounded-lg hover:bg-[#301B69]/90 transition-colors"
            >
              Approve
            </button>
            <button
              onClick={onDecline}
              className="px-6 py-2.5 bg-white border border-[#DF1C41] text-[#DF1C41] text-sm font-medium rounded-lg hover:bg-red-50 transition-colors"
            >
              Decline
            </button>
          </div>
        )}
      </div>
    </div>
  )
}
