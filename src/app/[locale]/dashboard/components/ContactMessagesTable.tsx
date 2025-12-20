"use client"

import { useState, useEffect, useCallback } from "react"
import { Loader2, RefreshCw, Eye } from "lucide-react"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "./Table"
import { Badge } from "./Badge"
import { ContactMessageDetailsModal } from "./ContactMessageDetailsModal"
import * as adminApi from "@/lib/adminApi"

interface ContactMessagesTableProps {
  searchQuery?: string
  filters?: {
    status?: string
    priority?: string
  }
}

export function ContactMessagesTable({ searchQuery, filters }: ContactMessagesTableProps) {
  const [messages, setMessages] = useState<adminApi.ContactMessage[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [selectedMessage, setSelectedMessage] = useState<adminApi.ContactMessage | null>(null)
  const [isModalOpen, setIsModalOpen] = useState(false)

  // Pagination state
  const [currentPage, setCurrentPage] = useState(1)
  const [totalPages, setTotalPages] = useState(1)
  const [totalMessages, setTotalMessages] = useState(0)
  const limit = 20

  const fetchMessages = useCallback(async () => {
    setLoading(true)
    setError(null)

    try {
      const params: adminApi.GetContactMessagesParams = {
        page: currentPage,
        limit,
      }

      if (filters?.status) {
        params.status = filters.status
      }

      if (filters?.priority) {
        params.priority = filters.priority
      }

      const response = await adminApi.getContactMessages(params)

      if (response?.data) {
        setMessages(response.data)
        setTotalMessages(response.total || response.data.length)
        setTotalPages(Math.ceil((response.total || response.data.length) / limit))
      }
    } catch (err: any) {
      console.error("Failed to fetch contact messages:", err)
      setError(err?.response?.data?.message || "Failed to load contact messages")
    } finally {
      setLoading(false)
    }
  }, [currentPage, filters])

  useEffect(() => {
    fetchMessages()
  }, [fetchMessages])

  useEffect(() => {
    setCurrentPage(1)
  }, [searchQuery, filters])

  const formatDate = (dateString: string) => {
    const date = new Date(dateString)
    return date.toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    })
  }

  const getStatusBadgeVariant = (status: string) => {
    switch (status) {
      case "resolved":
        return "success"
      case "in_progress":
        return "warning"
      case "pending":
        return "neutral"
      case "closed":
        return "error"
      default:
        return "neutral"
    }
  }

  const getPriorityBadgeVariant = (priority: string) => {
    switch (priority) {
      case "high":
        return "error"
      case "medium":
        return "warning"
      case "low":
        return "neutral"
      default:
        return "neutral"
    }
  }

  const handlePageChange = (page: number) => {
    if (page >= 1 && page <= totalPages) {
      setCurrentPage(page)
    }
  }

  const handleViewMessage = (message: adminApi.ContactMessage) => {
    setSelectedMessage(message)
    setIsModalOpen(true)
  }

  const handleCloseModal = () => {
    setIsModalOpen(false)
    setSelectedMessage(null)
  }

  const renderPaginationButtons = () => {
    const buttons = []
    const maxVisiblePages = 5

    let startPage = Math.max(1, currentPage - Math.floor(maxVisiblePages / 2))
    let endPage = Math.min(totalPages, startPage + maxVisiblePages - 1)

    if (endPage - startPage + 1 < maxVisiblePages) {
      startPage = Math.max(1, endPage - maxVisiblePages + 1)
    }

    for (let i = startPage; i <= endPage; i++) {
      buttons.push(
        <button
          key={i}
          onClick={() => handlePageChange(i)}
          className={`px-3 py-1 rounded-lg text-sm ${
            currentPage === i
              ? "bg-[#301B69] text-white"
              : "border border-[#DFE1E7] text-[#666D80] hover:bg-gray-50"
          } transition-colors`}
        >
          {i}
        </button>
      )
    }

    return buttons
  }

  if (loading) {
    return (
      <div className="bg-white rounded-2xl border border-[#DFE1E7] shadow-sm p-12">
        <div className="flex flex-col items-center justify-center gap-4">
          <Loader2 className="w-8 h-8 animate-spin text-[#301B69]" />
          <p className="text-gray-500">Loading contact messages...</p>
        </div>
      </div>
    )
  }

  if (error) {
    return (
      <div className="bg-white rounded-2xl border border-[#DFE1E7] shadow-sm p-12">
        <div className="flex flex-col items-center justify-center gap-4">
          <div className="w-12 h-12 bg-red-100 rounded-full flex items-center justify-center">
            <svg className="w-6 h-6 text-red-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
            </svg>
          </div>
          <p className="text-red-600 font-medium">Error loading contact messages</p>
          <p className="text-gray-500 text-sm">{error}</p>
          <button
            onClick={fetchMessages}
            className="px-4 py-2 bg-[#301B69] text-white rounded-lg text-sm hover:bg-[#301B69]/90 transition-colors flex items-center gap-2"
          >
            <RefreshCw className="w-4 h-4" />
            Try Again
          </button>
        </div>
      </div>
    )
  }

  return (
    <div className="bg-white rounded-2xl border border-[#DFE1E7] shadow-sm overflow-hidden">
      <div className="px-6 py-5 border-b border-[#DFE1E7] flex items-center justify-between">
        <h2 className="text-base font-semibold text-[#0D0D12]">Contact Messages</h2>
        <div className="flex items-center gap-3">
          <span className="text-sm text-gray-500">{totalMessages} messages total</span>
          <button
            onClick={fetchMessages}
            className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
            title="Refresh"
          >
            <RefreshCw className="w-4 h-4 text-gray-500" />
          </button>
        </div>
      </div>

      <Table>
        <TableHeader>
          <TableRow>
            <TableHead>Name</TableHead>
            <TableHead>Email</TableHead>
            <TableHead>Message</TableHead>
            {/* <TableHead>Status</TableHead>
            <TableHead>Priority</TableHead> */}
            <TableHead>Send At</TableHead>
            <TableHead className="w-32">Actions</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {messages.length === 0 ? (
            <TableRow>
              <TableCell colSpan={5} className="text-center py-8 text-gray-500">
                No contact messages found
              </TableCell>
            </TableRow>
          ) : (
            messages.map((message) => (
              <TableRow key={message.id}>
                <TableCell className="font-medium text-[#0D0D12]">{message.name || "N/A"}</TableCell>
                <TableCell className="text-[#666D80] text-sm">{message.email}</TableCell>
                <TableCell className="text-[#666D80] text-sm max-w-md">
                  <div className="truncate" title={message.message}>
                    {message.message}
                  </div>
                </TableCell>
                {/* <TableCell>
                  <Badge variant={getStatusBadgeVariant(message.status)} showDot>
                    {message.status.charAt(0).toUpperCase() + message.status.slice(1).replace('_', ' ')}
                  </Badge>
                </TableCell>
                <TableCell>
                  <Badge variant={getPriorityBadgeVariant(message.priority)}>
                    {message.priority.charAt(0).toUpperCase() + message.priority.slice(1)}
                  </Badge>
                </TableCell> */}
                <TableCell className="text-[#0D0D12] text-sm">{formatDate(message.createdAt)}</TableCell>
                <TableCell>
                  <button
                    onClick={() => handleViewMessage(message)}
                    className="p-1.5 hover:bg-gray-100 rounded transition-colors"
                    title="View details"
                  >
                    <Eye className="h-4 w-4 text-[#00BFA6]" />
                  </button>
                </TableCell>
              </TableRow>
            ))
          )}
        </TableBody>
      </Table>

      {/* Pagination */}
      <div className="flex items-center justify-between px-6 py-4 border-t border-[#DFE1E7]">
        <p className="text-sm text-[#666D80]">
          Showing {messages.length > 0 ? ((currentPage - 1) * limit) + 1 : 0} to {Math.min(currentPage * limit, totalMessages)} of {totalMessages} results
        </p>

        <div className="flex items-center gap-2">
          <button
            onClick={() => handlePageChange(currentPage - 1)}
            disabled={currentPage === 1}
            className={`px-3 py-1 border border-[#DFE1E7] rounded-lg text-sm transition-colors ${
              currentPage === 1
                ? "text-gray-300 cursor-not-allowed"
                : "text-[#666D80] hover:bg-gray-50"
            }`}
          >
            Previous
          </button>

          {renderPaginationButtons()}

          {totalPages > 5 && currentPage < totalPages - 2 && (
            <>
              <span className="text-gray-400">...</span>
              <button
                onClick={() => handlePageChange(totalPages)}
                className="px-3 py-1 border border-[#DFE1E7] rounded-lg text-sm text-[#666D80] hover:bg-gray-50 transition-colors"
              >
                {totalPages}
              </button>
            </>
          )}

          <button
            onClick={() => handlePageChange(currentPage + 1)}
            disabled={currentPage === totalPages || totalPages === 0}
            className={`px-3 py-1 border border-[#DFE1E7] rounded-lg text-sm transition-colors ${
              currentPage === totalPages || totalPages === 0
                ? "text-gray-300 cursor-not-allowed"
                : "text-[#666D80] hover:bg-gray-50"
            }`}
          >
            Next
          </button>
        </div>
      </div>

      {/* Contact Message Details Modal */}
      <ContactMessageDetailsModal
        message={selectedMessage}
        isOpen={isModalOpen}
        onClose={handleCloseModal}
      />
    </div>
  )
}

