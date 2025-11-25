"use client"

import { Star } from "lucide-react"

interface StarRatingProps {
  rating: number
  maxRating?: number
}

export function StarRating({ rating, maxRating = 5 }: StarRatingProps) {
  return (
    <div className="flex items-center gap-0.5">
      {[...Array(maxRating)].map((_, index) => (
        <Star
          key={index}
          className={`w-4 h-4 ${
            index < rating
              ? "fill-[#0D0D12] text-[#0D0D12]"
              : "fill-none text-[#DFE1E7]"
          }`}
        />
      ))}
    </div>
  )
}
