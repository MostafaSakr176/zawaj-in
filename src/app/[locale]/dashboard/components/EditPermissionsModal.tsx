"use client"

import { useState } from "react"
import { X } from "lucide-react"
import { Admin, ADMIN_PERMISSIONS } from "@/lib/adminApi"

interface EditPermissionsModalProps {
  admin: Admin
  onSave: (permissions: string[]) => void
  onClose: () => void
}

export function EditPermissionsModal({ admin, onSave, onClose }: EditPermissionsModalProps) {
  const [selectedPermissions, setSelectedPermissions] = useState<string[]>(admin.permissions || [])
  const [saving, setSaving] = useState(false)

  const handleTogglePermission = (permissionKey: string) => {
    setSelectedPermissions(prev =>
      prev.includes(permissionKey)
        ? prev.filter(p => p !== permissionKey)
        : [...prev, permissionKey]
    )
  }

  const handleSelectAll = () => {
    if (selectedPermissions.length === ADMIN_PERMISSIONS.length) {
      setSelectedPermissions([])
    } else {
      setSelectedPermissions(ADMIN_PERMISSIONS.map(p => p.key))
    }
  }

  const handleSave = async () => {
    setSaving(true)
    await onSave(selectedPermissions)
    setSaving(false)
  }

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center">
      {/* Backdrop */}
      <div
        className="absolute inset-0 bg-black/50"
        onClick={onClose}
      />

      {/* Modal */}
      <div className="relative bg-white rounded-2xl shadow-xl w-full max-w-lg mx-4 overflow-hidden">
        {/* Header */}
        <div className="flex items-center justify-between px-6 py-4 border-b border-[#DFE1E7]">
          <div>
            <h2 className="text-lg font-semibold text-[#0D0D12]">Edit Permissions</h2>
            <p className="text-sm text-[#666D80]">{admin.fullName}</p>
          </div>
          <button
            onClick={onClose}
            className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
          >
            <X className="h-5 w-5 text-[#666D80]" />
          </button>
        </div>

        {/* Content */}
        <div className="px-6 py-4 max-h-[400px] overflow-y-auto">
          {/* Select All */}
          <div className="flex items-center justify-between mb-4 pb-4 border-b border-[#DFE1E7]">
            <span className="text-sm font-medium text-[#0D0D12]">Select All Permissions</span>
            <button
              onClick={handleSelectAll}
              className="text-sm text-[#301B69] hover:underline"
            >
              {selectedPermissions.length === ADMIN_PERMISSIONS.length ? "Deselect All" : "Select All"}
            </button>
          </div>

          {/* Permissions List */}
          <div className="space-y-3">
            {ADMIN_PERMISSIONS.map((permission) => (
              <label
                key={permission.key}
                className="flex items-start gap-3 p-3 rounded-lg border border-[#DFE1E7] cursor-pointer hover:bg-gray-50 transition-colors"
              >
                <input
                  type="checkbox"
                  checked={selectedPermissions.includes(permission.key)}
                  onChange={() => handleTogglePermission(permission.key)}
                  className="mt-0.5 h-4 w-4 rounded border-[#DFE1E7] text-[#301B69] focus:ring-[#301B69]"
                />
                <div className="flex-1">
                  <p className="text-sm font-medium text-[#0D0D12]">{permission.label}</p>
                  <p className="text-xs text-[#666D80]">{permission.description}</p>
                </div>
              </label>
            ))}
          </div>
        </div>

        {/* Footer */}
        <div className="flex items-center justify-end gap-3 px-6 py-4 border-t border-[#DFE1E7] bg-gray-50">
          <button
            onClick={onClose}
            className="px-4 py-2 text-sm font-medium text-[#0D0D12] border border-[#DFE1E7] rounded-lg hover:bg-white transition-colors"
          >
            Cancel
          </button>
          <button
            onClick={handleSave}
            disabled={saving}
            className="px-4 py-2 text-sm font-medium text-white bg-[#301B69] rounded-lg hover:bg-[#301B69]/90 transition-colors disabled:opacity-50"
          >
            {saving ? "Saving..." : "Save Changes"}
          </button>
        </div>
      </div>
    </div>
  )
}
