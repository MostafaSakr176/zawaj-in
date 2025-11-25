"use client"

import { DashboardHeader } from "../components/DashboardHeader"
import { DashboardSidebar } from "../components/DashboardSidebar"
import { Breadcrumb } from "../components/Breadcrumb"
import { ContentCard } from "../components/ContentCard"

const contentItems = [
  {
    id: "1",
    title: "Terms of Use",
    status: "Active" as const,
    content: "Lorem Ipsum is simply dummy text of the printing and typesetting industry. Lorem Ipsum has been the industry's standard dummy text ever since the 1500s, when an unknown printer took a galley of type and scrambled it to make a type specimen book. It has survived not only five centuries, but also the leap into electronic typesetting, remaining essentially unchanged. It was popularised in the 1960s with the release of Letraset sheets containing Lorem Ipsum passages, and more recently with desktop publishing software like Aldus PageMaker including versions of Lorem Ipsum.",
    imageUrl: undefined
  },
  {
    id: "2",
    title: "About",
    status: "Active" as const,
    content: "Lorem Ipsum is simply dummy text of the printing and typesetting industry. Lorem Ipsum has been the industry's standard dummy text ever since the 1500s, when an unknown printer took a galley of type and scrambled it to make a type specimen book. It has survived not only five centuries, but also the leap into electronic typesetting, remaining essentially unchanged. It was popularised in the 1960s with the release of Letraset sheets containing Lorem Ipsum passages, and more recently with desktop publishing software like Aldus PageMaker including versions of Lorem Ipsum.",
    imageUrl: undefined
  },
  {
    id: "3",
    title: "Privacy",
    status: "Active" as const,
    content: "Lorem Ipsum is simply dummy text of the printing and typesetting industry. Lorem Ipsum has been the industry's standard dummy text ever since the 1500s, when an unknown printer took a galley of type and scrambled it to make a type specimen book. It has survived not only five centuries, but also the leap into electronic typesetting, remaining essentially unchanged. It was popularised in the 1960s with the release of Letraset sheets containing Lorem Ipsum passages, and more recently with desktop publishing software like Aldus PageMaker including versions of Lorem Ipsum.",
    imageUrl: undefined
  }
]

export default function ContentPage() {
  const handleDelete = (id: string) => {
    console.log(`Deleting content: ${id}`)
  }

  const handleSave = (id: string, content: string) => {
    console.log(`Saving content for ${id}:`, content)
  }

  return (
    <div className="flex h-screen bg-gray-50">
      <DashboardSidebar />

      <div className="flex-1 flex flex-col overflow-hidden">
        <DashboardHeader />

        <main className="flex-1 overflow-y-auto p-8">
          <div className="max-w-5xl mx-auto space-y-6">
            {/* Breadcrumb */}
            <Breadcrumb
              items={[
                { label: "Management", href: "/dashboard" },
                { label: "Content" }
              ]}
            />

            {/* Content Cards */}
            <div className="space-y-6">
              {contentItems.map((item) => (
                <ContentCard
                  key={item.id}
                  title={item.title}
                  status={item.status}
                  content={item.content}
                  imageUrl={item.imageUrl}
                  onDelete={() => handleDelete(item.id)}
                  onSave={(content) => handleSave(item.id, content)}
                />
              ))}
            </div>
          </div>
        </main>
      </div>
    </div>
  )
}
