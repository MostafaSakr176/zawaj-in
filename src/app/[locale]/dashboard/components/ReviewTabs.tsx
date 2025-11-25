"use client"

interface ReviewTabsProps {
  activeTab: string
  onTabChange: (tab: string) => void
  tabs: { id: string; label: string }[]
}

export function ReviewTabs({ activeTab, onTabChange, tabs }: ReviewTabsProps) {
  return (
    <div className="flex flex-col gap-2">
      {tabs.map((tab) => (
        <button
          key={tab.id}
          onClick={() => onTabChange(tab.id)}
          className={`px-5 py-3 text-sm font-medium rounded-lg text-left transition-colors ${
            activeTab === tab.id
              ? "bg-[#301B69] text-white"
              : "bg-white text-[#666D80] hover:bg-[#F9FAFB]"
          }`}
        >
          {tab.label}
        </button>
      ))}
    </div>
  )
}
