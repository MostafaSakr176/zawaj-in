"use client"

import { useState, useEffect } from "react"
import { Trash2, Edit2, ChevronUp, ChevronDown } from "lucide-react"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "./Table"
import { Checkbox } from "./Checkbox"
import { Badge } from "./Badge"
import { Toggle } from "./Toggle"
import {
  Admin,
  getAdmins,
  removeAdmin,
  promoteToSuperAdmin,
  demoteToAdmin,
  updateAdminRoles,
  ADMIN_PERMISSIONS
} from "@/lib/adminApi"
import toast from "react-hot-toast"
import { EditPermissionsModal } from "./EditPermissionsModal"

interface RolesTableProps {
  onAddNew?: () => void
}

export function RolesTable({ onAddNew }: RolesTableProps) {
  const [admins, setAdmins] = useState<Admin[]>([])
  const [selectedAdmins, setSelectedAdmins] = useState<string[]>([])
  const [selectAll, setSelectAll] = useState(false)
  const [loading, setLoading] = useState(true)
  const [editingAdmin, setEditingAdmin] = useState<Admin | null>(null)
  const [actionLoading, setActionLoading] = useState<string | null>(null)

  // Pagination
  const [currentPage, setCurrentPage] = useState(1)
  const [totalPages, setTotalPages] = useState(1)
  const [total, setTotal] = useState(0)
  const limit = 20

  const fetchAdmins = async () => {
    try {
      setLoading(true)
      const response = await getAdmins()
      if (response.success) {
        setAdmins(response.data.admins)
        setTotalPages(response.data.totalPages)
        setTotal(response.data.total)
      }
    } catch (error) {
      console.error("Failed to fetch admins:", error)
      toast.error("Failed to load admins")
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    fetchAdmins()
  }, [currentPage])

  const handleSelectAll = (e: React.ChangeEvent<HTMLInputElement>) => {
    const checked = e.target.checked
    if (checked) {
      setSelectedAdmins(admins.map(admin => admin.id))
    } else {
      setSelectedAdmins([])
    }
    setSelectAll(checked)
  }

  const handleSelectAdmin = (id: string) => {
    setSelectedAdmins(prev =>
      prev.includes(id)
        ? prev.filter(adminId => adminId !== id)
        : [...prev, id]
    )
  }

  const handlePromote = async (admin: Admin) => {
    try {
      setActionLoading(admin.id)
      const response = await promoteToSuperAdmin(admin.id)
      if (response.success) {
        toast.success("Admin promoted to Super Admin")
        fetchAdmins()
      }
    } catch (error) {
      console.error("Failed to promote admin:", error)
      toast.error("Failed to promote admin")
    } finally {
      setActionLoading(null)
    }
  }

  const handleDemote = async (admin: Admin) => {
    try {
      setActionLoading(admin.id)
      const response = await demoteToAdmin(admin.id)
      if (response.success) {
        toast.success("Admin demoted successfully")
        fetchAdmins()
      }
    } catch (error) {
      console.error("Failed to demote admin:", error)
      toast.error("Failed to demote admin")
    } finally {
      setActionLoading(null)
    }
  }

  const handleDelete = async (admin: Admin) => {
    if (!confirm(`Are you sure you want to remove admin privileges from ${admin.fullName}?`)) {
      return
    }

    try {
      setActionLoading(admin.id)
      const response = await removeAdmin(admin.id)
      if (response.success) {
        toast.success("Admin removed successfully")
        fetchAdmins()
      }
    } catch (error) {
      console.error("Failed to remove admin:", error)
      toast.error("Failed to remove admin")
    } finally {
      setActionLoading(null)
    }
  }

  const handleEditPermissions = (admin: Admin) => {
    setEditingAdmin(admin)
  }

  const handleSavePermissions = async (permissions: string[]) => {
    if (!editingAdmin) return

    try {
      const response = await updateAdminRoles(editingAdmin.id, { permissions })
      if (response.success) {
        toast.success("Permissions updated successfully")
        fetchAdmins()
        setEditingAdmin(null)
      }
    } catch (error) {
      console.error("Failed to update permissions:", error)
      toast.error("Failed to update permissions")
    }
  }

  const getRoleBadgeVariant = (role: string) => {
    return role === "super_admin" ? "primary" : "default"
  }

  const getStatusBadgeVariant = (isActive: boolean) => {
    return isActive ? "success" : "warning"
  }

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString("en-US", {
      weekday: "short",
      month: "short",
      day: "2-digit",
      year: "numeric"
    })
  }

  const formatRole = (role: string) => {
    if (role === "super_admin") return "Super Admin"
    if (role === "admin") return "Admin"
    return role
  }

  if (loading) {
    return (
      <div className="bg-white rounded-2xl border border-[#DFE1E7] shadow-sm p-8">
        <div className="flex items-center justify-center">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-[#301B69]"></div>
          <span className="ml-3 text-[#666D80]">Loading admins...</span>
        </div>
      </div>
    )
  }

  return (
    <>
      <div className="bg-white rounded-2xl border border-[#DFE1E7] shadow-sm overflow-hidden">
        {/* Header */}
        <div className="flex items-center justify-between px-6 py-5 border-b border-[#DFE1E7]">
          <div>
            <h2 className="text-lg font-semibold text-[#0D0D12]">Admins</h2>
            <p className="text-sm text-[#666D80]">{total} total admins</p>
          </div>
          <button
            onClick={onAddNew}
            className="px-4 py-2 bg-[#301B69] text-white text-sm font-medium rounded-lg hover:bg-[#301B69]/90 transition-colors"
          >
            Add New
          </button>
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
              <TableHead>No</TableHead>
              <TableHead>Name</TableHead>
              <TableHead>Phone number</TableHead>
              <TableHead>Email</TableHead>
              <TableHead>Created At</TableHead>
              <TableHead>Role</TableHead>
              <TableHead>Status</TableHead>
              <TableHead className="w-32">Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {admins.length === 0 ? (
              <TableRow>
                <TableCell colSpan={9} className="text-center py-8 text-[#666D80]">
                  No admins found
                </TableCell>
              </TableRow>
            ) : (
              admins.map((admin, index) => (
                <TableRow key={admin.id}>
                  <TableCell>
                    <Checkbox
                      checked={selectedAdmins.includes(admin.id)}
                      onChange={() => handleSelectAdmin(admin.id)}
                    />
                  </TableCell>
                  <TableCell className="text-[#666D80]">
                    {(currentPage - 1) * limit + index + 1}
                  </TableCell>
                  <TableCell className="font-medium text-[#0D0D12]">{admin.fullName}</TableCell>
                  <TableCell className="text-[#666D80]">{admin.phone}</TableCell>
                  <TableCell className="text-[#666D80]">{admin.email}</TableCell>
                  <TableCell className="text-[#666D80]">{formatDate(admin.createdAt)}</TableCell>
                  <TableCell>
                    <Badge variant={getRoleBadgeVariant(admin.role)}>
                      {formatRole(admin.role)}
                    </Badge>
                  </TableCell>
                  <TableCell>
                    <Badge variant={getStatusBadgeVariant(admin.isActive)} showDot>
                      {admin.isActive ? "Active" : "Inactive"}
                    </Badge>
                  </TableCell>
                  <TableCell>
                    <div className="flex items-center gap-2">
                      {/* Edit Permissions */}
                      <button
                        onClick={() => handleEditPermissions(admin)}
                        className="p-1.5 hover:bg-gray-100 rounded transition-colors"
                        title="Edit Permissions"
                        disabled={actionLoading === admin.id}
                      >
                        <Edit2 className="h-4 w-4 text-[#666D80]" />
                      </button>

                      {/* Promote/Demote */}
                      {admin.role === "admin" ? (
                        <button
                          onClick={() => handlePromote(admin)}
                          className="p-1.5 hover:bg-gray-100 rounded transition-colors"
                          title="Promote to Super Admin"
                          disabled={actionLoading === admin.id}
                        >
                          <ChevronUp className="h-4 w-4 text-[#22C55E]" />
                        </button>
                      ) : (
                        <button
                          onClick={() => handleDemote(admin)}
                          className="p-1.5 hover:bg-gray-100 rounded transition-colors"
                          title="Demote to Admin"
                          disabled={actionLoading === admin.id}
                        >
                          <ChevronDown className="h-4 w-4 text-[#F59E0B]" />
                        </button>
                      )}

                      {/* Delete */}
                      <button
                        onClick={() => handleDelete(admin)}
                        className="p-1.5 hover:bg-gray-100 rounded transition-colors"
                        title="Remove Admin"
                        disabled={actionLoading === admin.id}
                      >
                        <Trash2 className="h-4 w-4 text-[#DF1C41]" />
                      </button>
                    </div>
                  </TableCell>
                </TableRow>
              ))
            )}
          </TableBody>
        </Table>

        {/* Pagination */}
        {totalPages > 1 && (
          <div className="flex items-center justify-between px-6 py-4 border-t border-[#DFE1E7]">
            <p className="text-sm text-[#666D80]">
              Showing {(currentPage - 1) * limit + 1} to {Math.min(currentPage * limit, total)} of {total} admins
            </p>
            <div className="flex items-center gap-2">
              <button
                onClick={() => setCurrentPage(prev => Math.max(1, prev - 1))}
                disabled={currentPage === 1}
                className="px-3 py-1.5 text-sm border border-[#DFE1E7] rounded-lg hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed"
              >
                Previous
              </button>
              <span className="text-sm text-[#666D80]">
                Page {currentPage} of {totalPages}
              </span>
              <button
                onClick={() => setCurrentPage(prev => Math.min(totalPages, prev + 1))}
                disabled={currentPage === totalPages}
                className="px-3 py-1.5 text-sm border border-[#DFE1E7] rounded-lg hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed"
              >
                Next
              </button>
            </div>
          </div>
        )}
      </div>

      {/* Edit Permissions Modal */}
      {editingAdmin && (
        <EditPermissionsModal
          admin={editingAdmin}
          onSave={handleSavePermissions}
          onClose={() => setEditingAdmin(null)}
        />
      )}
    </>
  )
}
