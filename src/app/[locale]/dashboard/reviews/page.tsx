"use client"

import { useState } from "react"
import { DashboardHeader } from "../components/DashboardHeader"
import { DashboardSidebar } from "../components/DashboardSidebar"
import { Breadcrumb } from "../components/Breadcrumb"
import { ReviewTabs } from "../components/ReviewTabs"
import { ReviewCard } from "../components/ReviewCard"

const tabs = [
  { id: "new", label: "New Requests" },
  { id: "active", label: "Active feedback" },
  { id: "drafts", label: "Drafts feedbacks" }
]

const mockReviews = [
  {
    id: "1",
    rating: 5,
    content: "Flowzy is the best professional project management in the world! He is a great motivator for the beginners in this discipline in organizations and colleagues in Brazil. I've been privileged to work directly with Vargas and learn from him what is to be proactive, organized and creative.",
    author: {
      name: "Marvin McKinney",
      role: "Team Leader"
    }
  },
  {
    id: "2",
    rating: 4,
    content: "Flowzy is the best professional project management in the world! He is a great motivator for the beginners in this discipline in organizations and colleagues in Brazil. I've been privileged to work directly with Vargas and learn from him what is to be proactive, organized and creative.",
    author: {
      name: "Marvin McKinney",
      role: "Team Leader"
    }
  },
  {
    id: "3",
    rating: 4,
    content: "Flowzy is the best professional project management in the world! He is a great motivator for the beginners in this discipline in organizations and colleagues in Brazil. I've been privileged to work directly with Vargas and learn from him what is to be proactive, organized and creative.",
    author: {
      name: "Marvin McKinney",
      role: "Team Leader"
    }
  },
  {
    id: "4",
    rating: 5,
    content: "Flowzy is the best professional project management in the world! He is a great motivator for the beginners in this discipline in organizations and colleagues in Brazil. I've been privileged to work directly with Vargas and learn from him what is to be proactive, organized and creative.",
    author: {
      name: "Marvin McKinney",
      role: "Team Leader"
    }
  }
]

export default function ReviewsFeedbackPage() {
  const [activeTab, setActiveTab] = useState("new")

  const handleApprove = (id: string) => {
    console.log(`Approving review: ${id}`)
  }

  const handleDecline = (id: string) => {
    console.log(`Declining review: ${id}`)
  }

  return (
    <div className="flex h-screen bg-white">
      <DashboardSidebar />

      <div className="flex-1 flex flex-col overflow-hidden">
        <DashboardHeader />

        <main className="flex-1 overflow-y-auto">
          {/* Breadcrumb */}
          <div className="px-8 py-4 border-b border-[#DFE1E7]">
            <Breadcrumb
              items={[
                { label: "Management", href: "/dashboard" },
                { label: "Reviews & Feedback" }
              ]}
            />
          </div>

          {/* Content */}
          <div className="px-8 py-6">
            <div className="flex gap-8">
              {/* Left Sidebar - Tabs */}
              <div className="w-44 flex-shrink-0">
                <ReviewTabs
                  activeTab={activeTab}
                  onTabChange={setActiveTab}
                  tabs={tabs}
                />
              </div>

              {/* Right Content - Review Cards */}
              <div className="flex-1 space-y-4">
                {mockReviews.map((review) => (
                  <ReviewCard
                    key={review.id}
                    id={review.id}
                    rating={review.rating}
                    content={review.content}
                    author={review.author}
                    onApprove={() => handleApprove(review.id)}
                    onDecline={() => handleDecline(review.id)}
                    showActions={activeTab === "new"}
                  />
                ))}
              </div>
            </div>
          </div>
        </main>
      </div>
    </div>
  )
}
