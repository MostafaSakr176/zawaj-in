"use client"

import { useState, useEffect, useCallback } from "react"
import { Eye, Trash2, Edit2, Loader2, Ban, ShieldCheck, Bell, MoreVertical, UserX, RefreshCw } from "lucide-react"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "./Table"
import { Checkbox } from "./Checkbox"
import { Badge } from "./Badge"
import { UserDetailsModal } from "./UserDetailsModal"
import { BanUserModal } from "./BanUserModal"
import { SendNotificationModal } from "./SendNotificationModal"
import { ConfirmModal } from "./ConfirmModal"
import * as adminApi from "@/lib/adminApi"

interface User {
  id: string
  name: string
  phoneNumber: string
  email: string
  joinedIn: string
  status: "Active" | "Suspended" | "Banned" | "Deleted"
  planType: string
  subscription: string
  nationality: string
  nationalityFlag?: string
  placeOfResidence: string
  maritalStatus: string
  age: string
  skinColor: string
  height: string
  weight: string
  hairType: string
  hairColor: string
  eyeColor: string
  educationLevel: string
  occupation: string
  about: string
  partnerPreferences: string
  avatar?: string
  gender: string
  chartNumber: string
  isVerified: boolean
  isBanned: boolean
  rawId: string // Original UUID for API calls
}

interface UsersTableProps {
  searchQuery?: string
  filters?: {
    status?: string
    role?: string
  }
}

export function UsersTable({ searchQuery, filters }: UsersTableProps) {
  const [users, setUsers] = useState<User[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [selectedUsers, setSelectedUsers] = useState<string[]>([])
  const [selectAll, setSelectAll] = useState(false)
  const [selectedUser, setSelectedUser] = useState<User | null>(null)
  const [isModalOpen, setIsModalOpen] = useState(false)

  // Pagination state
  const [currentPage, setCurrentPage] = useState(1)
  const [totalPages, setTotalPages] = useState(1)
  const [totalUsers, setTotalUsers] = useState(0)
  const limit = 10

  // Action modals
  const [banModalUser, setBanModalUser] = useState<User | null>(null)
  const [notificationModalUser, setNotificationModalUser] = useState<User | null>(null)
  const [confirmModal, setConfirmModal] = useState<{
    isOpen: boolean
    title: string
    message: string
    confirmText: string
    variant: "danger" | "warning" | "info"
    action: () => Promise<void>
  } | null>(null)
  const [actionLoading, setActionLoading] = useState(false)

  // Dropdown menu state
  const [openDropdown, setOpenDropdown] = useState<string | null>(null)

  const formatDate = (dateString: string) => {
    const date = new Date(dateString)
    return date.toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    })
  }

  const mapApiUserToUser = (apiUser: adminApi.AdminUser): User => {
    let status: "Active" | "Suspended" | "Banned" | "Deleted" = "Active"
    if (apiUser.isDeleted) status = "Deleted"
    else if (apiUser.isBanned) status = "Banned"
    else if (!apiUser.isActive) status = "Suspended"

    return {
      id: apiUser.chartNumber || apiUser.id.slice(0, 8),
      name: apiUser.fullName,
      phoneNumber: apiUser.phone || "N/A",
      email: apiUser.email,
      joinedIn: formatDate(apiUser.createdAt),
      status,
      planType: "Free",
      subscription: "Free plan",
      nationality: apiUser.nationality || "N/A",
      placeOfResidence: apiUser.placeOfResidence || apiUser.location?.city || "N/A",
      maritalStatus: apiUser.maritalStatus || "N/A",
      age: apiUser.age ? `${apiUser.age} years` : "N/A",
      skinColor: apiUser.skinColor || "N/A",
      height: apiUser.height ? `${apiUser.height} cm` : "N/A",
      weight: apiUser.weight ? `${apiUser.weight} kg` : "N/A",
      hairType: apiUser.hairType || "N/A",
      hairColor: apiUser.hairColor || "N/A",
      eyeColor: apiUser.eyeColor || "N/A",
      educationLevel: apiUser.educationLevel || "N/A",
      occupation: apiUser.profession || "N/A",
      about: apiUser.bio || "No bio available",
      partnerPreferences: apiUser.partnerPreferencesBio || "No preferences specified",
      gender: apiUser.gender,
      chartNumber: apiUser.chartNumber,
      isVerified: apiUser.isVerified,
      isBanned: apiUser.isBanned,
      rawId: apiUser.id
    }
  }

  const fetchUsers = useCallback(async () => {
    setLoading(true)
    setError(null)

    try {
      const params: adminApi.GetUsersParams = {
        page: currentPage,
        limit,
      }

      if (searchQuery) {
        params.search = searchQuery
      }

      if (filters?.role) {
        params.role = filters.role
      }

      if (filters?.status === "banned") {
        params.isBanned = true
      } else if (filters?.status === "verified") {
        params.isVerified = true
      }

      const response = await adminApi.getUsers()

      if (response?.success) {
        const apiUsers = response.data.users || []
        const mappedUsers = apiUsers.map(mapApiUserToUser)
        setUsers(mappedUsers)
        setTotalUsers(response.data.total || apiUsers.length)
        setTotalPages(response.data.totalPages || Math.ceil((response.data.total || apiUsers.length) / limit))
      }
    } catch (err: any) {
      console.error("Failed to fetch users:", err)
      setError(err?.response?.data?.message || "Failed to load users")
    } finally {
      setLoading(false)
    }
  }, [currentPage, searchQuery, filters])

  useEffect(() => {
    fetchUsers()
  }, [fetchUsers])

  useEffect(() => {
    setCurrentPage(1)
  }, [searchQuery, filters])

  // Close dropdown when clicking outside
  useEffect(() => {
    const handleClick = () => setOpenDropdown(null)
    if (openDropdown) {
      document.addEventListener("click", handleClick)
      return () => document.removeEventListener("click", handleClick)
    }
  }, [openDropdown])

  const handleSelectAll = (e: React.ChangeEvent<HTMLInputElement>) => {
    const checked = e.target.checked
    if (checked) {
      setSelectedUsers(users.map((_, idx) => idx.toString()))
    } else {
      setSelectedUsers([])
    }
    setSelectAll(checked)
  }

  const handleSelectUser = (idx: string) => {
    setSelectedUsers(prev =>
      prev.includes(idx)
        ? prev.filter(userIdx => userIdx !== idx)
        : [...prev, idx]
    )
  }

  const handleViewUser = (user: User) => {
    setSelectedUser(user)
    setIsModalOpen(true)
  }

  const handleCloseModal = () => {
    setIsModalOpen(false)
    setSelectedUser(null)
  }

  // Action handlers
  const handleVerifyUser = (user: User) => {
    setConfirmModal({
      isOpen: true,
      title: "Verify User",
      message: `Are you sure you want to verify ${user.name}'s profile?`,
      confirmText: "Verify",
      variant: "info",
      action: async () => {
        await adminApi.verifyUser(user.rawId)
        fetchUsers()
      }
    })
  }

  const handleUnbanUser = (user: User) => {
    setConfirmModal({
      isOpen: true,
      title: "Unban User",
      message: `Are you sure you want to unban ${user.name}?`,
      confirmText: "Unban",
      variant: "info",
      action: async () => {
        await adminApi.unbanUser(user.rawId)
        fetchUsers()
      }
    })
  }

  const handleDeleteUser = (user: User) => {
    setConfirmModal({
      isOpen: true,
      title: "Delete User",
      message: `Are you sure you want to delete ${user.name}? This action will soft-delete the user account.`,
      confirmText: "Delete",
      variant: "danger",
      action: async () => {
        await adminApi.deleteUser(user.rawId)
        fetchUsers()
      }
    })
  }

  const executeConfirmAction = async () => {
    if (!confirmModal) return
    setActionLoading(true)
    try {
      await confirmModal.action()
      setConfirmModal(null)
    } catch (err: any) {
      alert(err?.response?.data?.message || "Action failed")
    } finally {
      setActionLoading(false)
    }
  }

  const getStatusBadgeVariant = (status: string) => {
    switch (status) {
      case "Active":
        return "success"
      case "Suspended":
        return "warning"
      case "Banned":
      case "Deleted":
        return "error"
      default:
        return "neutral"
    }
  }

  const handlePageChange = (page: number) => {
    if (page >= 1 && page <= totalPages) {
      setCurrentPage(page)
    }
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
          <p className="text-gray-500">Loading users...</p>
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
          <p className="text-red-600 font-medium">Error loading users</p>
          <p className="text-gray-500 text-sm">{error}</p>
          <button
            onClick={fetchUsers}
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
    <>
      <div className="bg-white rounded-2xl border border-[#DFE1E7] shadow-sm overflow-hidden">
        <div className="px-6 py-5 border-b border-[#DFE1E7] flex items-center justify-between">
          <h2 className="text-base font-semibold text-[#0D0D12]">User Table</h2>
          <div className="flex items-center gap-3">
            <span className="text-sm text-gray-500">{totalUsers} users total</span>
            <button
              onClick={fetchUsers}
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
              <TableHead className="w-12">
                <Checkbox
                  checked={selectAll}
                  onChange={handleSelectAll}
                />
              </TableHead>
              <TableHead>Chart #</TableHead>
              <TableHead>Name</TableHead>
              <TableHead>Phone</TableHead>
              <TableHead>Email</TableHead>
              <TableHead>Joined</TableHead>
              <TableHead>Status</TableHead>
              <TableHead>Verified</TableHead>
              <TableHead className="w-32">Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {users.length === 0 ? (
              <TableRow>
                <TableCell colSpan={9} className="text-center py-8 text-gray-500">
                  No users found
                </TableCell>
              </TableRow>
            ) : (
              users.map((user, idx) => (
                <TableRow key={user.rawId}>
                  <TableCell>
                    <Checkbox
                      checked={selectedUsers.includes(idx.toString())}
                      onChange={() => handleSelectUser(idx.toString())}
                    />
                  </TableCell>
                  <TableCell className="font-medium text-[#0D0D12]">{user.chartNumber}</TableCell>
                  <TableCell className="font-medium text-[#0D0D12]">{user.name}</TableCell>
                  <TableCell className="text-[#666D80] text-sm">{user.phoneNumber}</TableCell>
                  <TableCell className="text-[#666D80] text-sm">{user.email}</TableCell>
                  <TableCell className="text-[#0D0D12] text-sm">{user.joinedIn}</TableCell>
                  <TableCell>
                    <Badge variant={getStatusBadgeVariant(user.status)} showDot>
                      {user.status}
                    </Badge>
                  </TableCell>
                  <TableCell>
                    {user.isVerified ? (
                      <Badge variant="success">Verified</Badge>
                    ) : (
                      <Badge variant="neutral">Pending</Badge>
                    )}
                  </TableCell>
                  <TableCell>
                    <div className="flex items-center gap-1">
                      <button
                        onClick={() => handleViewUser(user)}
                        className="p-1.5 hover:bg-gray-100 rounded transition-colors"
                        title="View details"
                      >
                        <Eye className="h-4 w-4 text-[#00BFA6]" />
                      </button>

                      {/* More actions dropdown */}
                      <div className="relative">
                        <button
                          onClick={(e) => {
                            e.stopPropagation()
                            setOpenDropdown(openDropdown === user.rawId ? null : user.rawId)
                          }}
                          className="p-1.5 hover:bg-gray-100 rounded transition-colors"
                          title="More actions"
                        >
                          <MoreVertical className="h-4 w-4 text-gray-500" />
                        </button>

                        {openDropdown === user.rawId && (
                          <div className="absolute right-0 top-full mt-1 w-48 bg-white rounded-lg shadow-lg border border-gray-200 py-1 z-20">
                            {!user.isVerified && (
                              <button
                                onClick={() => {
                                  setOpenDropdown(null)
                                  handleVerifyUser(user)
                                }}
                                className="w-full px-4 py-2 text-left text-sm text-gray-700 hover:bg-gray-50 flex items-center gap-2"
                              >
                                <ShieldCheck className="w-4 h-4 text-green-500" />
                                Verify User
                              </button>
                            )}

                            <button
                              onClick={() => {
                                setOpenDropdown(null)
                                setNotificationModalUser(user)
                              }}
                              className="w-full px-4 py-2 text-left text-sm text-gray-700 hover:bg-gray-50 flex items-center gap-2"
                            >
                              <Bell className="w-4 h-4 text-blue-500" />
                              Send Notification
                            </button>

                            {user.isBanned ? (
                              <button
                                onClick={() => {
                                  setOpenDropdown(null)
                                  handleUnbanUser(user)
                                }}
                                className="w-full px-4 py-2 text-left text-sm text-gray-700 hover:bg-gray-50 flex items-center gap-2"
                              >
                                <UserX className="w-4 h-4 text-green-500" />
                                Unban User
                              </button>
                            ) : (
                              <button
                                onClick={() => {
                                  setOpenDropdown(null)
                                  setBanModalUser(user)
                                }}
                                className="w-full px-4 py-2 text-left text-sm text-gray-700 hover:bg-gray-50 flex items-center gap-2"
                              >
                                <Ban className="w-4 h-4 text-orange-500" />
                                Ban User
                              </button>
                            )}

                            <div className="border-t border-gray-100 my-1" />

                            <button
                              onClick={() => {
                                setOpenDropdown(null)
                                handleDeleteUser(user)
                              }}
                              className="w-full px-4 py-2 text-left text-sm text-red-600 hover:bg-red-50 flex items-center gap-2"
                            >
                              <Trash2 className="w-4 h-4" />
                              Delete User
                            </button>
                          </div>
                        )}
                      </div>
                    </div>
                  </TableCell>
                </TableRow>
              ))
            )}
          </TableBody>
        </Table>

        {/* Pagination */}
        <div className="flex items-center justify-between px-6 py-4 border-t border-[#DFE1E7]">
          <p className="text-sm text-[#666D80]">
            Showing {users.length > 0 ? ((currentPage - 1) * limit) + 1 : 0} to {Math.min(currentPage * limit, totalUsers)} of {totalUsers} results
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
      </div>

      {/* User Details Modal */}
      <UserDetailsModal
        user={selectedUser}
        isOpen={isModalOpen}
        onClose={handleCloseModal}
      />

      {/* Ban User Modal */}
      {banModalUser && (
        <BanUserModal
          isOpen={!!banModalUser}
          onClose={() => setBanModalUser(null)}
          userId={banModalUser.rawId}
          userName={banModalUser.name}
          onSuccess={fetchUsers}
        />
      )}

      {/* Send Notification Modal */}
      {notificationModalUser && (
        <SendNotificationModal
          isOpen={!!notificationModalUser}
          onClose={() => setNotificationModalUser(null)}
          userId={notificationModalUser.rawId}
          userName={notificationModalUser.name}
          userEmail={notificationModalUser.email}
          onSuccess={() => {}}
        />
      )}

      {/* Confirm Modal */}
      {confirmModal && (
        <ConfirmModal
          isOpen={confirmModal.isOpen}
          onClose={() => setConfirmModal(null)}
          onConfirm={executeConfirmAction}
          title={confirmModal.title}
          message={confirmModal.message}
          confirmText={confirmModal.confirmText}
          variant={confirmModal.variant}
          loading={actionLoading}
        />
      )}
    </>
  )
}
