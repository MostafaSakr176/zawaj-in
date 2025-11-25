"use client"

import { useState } from "react"
import { ChevronDown, Eye, EyeOff } from "lucide-react"
import { createAdmin, ADMIN_PERMISSIONS, CreateAdminData } from "@/lib/adminApi"
import toast from "react-hot-toast"

interface AddAdminFormProps {
  onSave?: () => void
  onCancel?: () => void
}

const genders = [
  { value: "male", label: "Male" },
  { value: "female", label: "Female" }
]

export function AddAdminForm({ onSave, onCancel }: AddAdminFormProps) {
  const [formData, setFormData] = useState<CreateAdminData>({
    fullName: "",
    email: "",
    password: "",
    phone: "",
    gender: "male",
    permissions: []
  })
  const [isGenderDropdownOpen, setIsGenderDropdownOpen] = useState(false)
  const [showPassword, setShowPassword] = useState(false)
  const [loading, setLoading] = useState(false)
  const [errors, setErrors] = useState<Record<string, string>>({})

  const handleChange = (field: keyof CreateAdminData, value: string | string[]) => {
    setFormData(prev => ({ ...prev, [field]: value }))
    // Clear error when user starts typing
    if (errors[field]) {
      setErrors(prev => ({ ...prev, [field]: "" }))
    }
  }

  const handleTogglePermission = (permissionKey: string) => {
    setFormData(prev => ({
      ...prev,
      permissions: prev.permissions.includes(permissionKey)
        ? prev.permissions.filter(p => p !== permissionKey)
        : [...prev.permissions, permissionKey]
    }))
  }

  const handleSelectAllPermissions = () => {
    if (formData.permissions.length === ADMIN_PERMISSIONS.length) {
      setFormData(prev => ({ ...prev, permissions: [] }))
    } else {
      setFormData(prev => ({ ...prev, permissions: ADMIN_PERMISSIONS.map(p => p.key) }))
    }
  }

  const validateForm = (): boolean => {
    const newErrors: Record<string, string> = {}

    if (!formData.fullName.trim()) {
      newErrors.fullName = "Full name is required"
    }

    if (!formData.email.trim()) {
      newErrors.email = "Email is required"
    } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email)) {
      newErrors.email = "Invalid email format"
    }

    if (!formData.password) {
      newErrors.password = "Password is required"
    } else if (formData.password.length < 8) {
      newErrors.password = "Password must be at least 8 characters"
    }

    if (!formData.phone.trim()) {
      newErrors.phone = "Phone number is required"
    }

    if (formData.permissions.length === 0) {
      newErrors.permissions = "At least one permission is required"
    }

    setErrors(newErrors)
    return Object.keys(newErrors).length === 0
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()

    if (!validateForm()) {
      return
    }

    try {
      setLoading(true)
      const response = await createAdmin(formData)
      if (response.success) {
        toast.success("Admin created successfully")
        onSave?.()
      }
    } catch (error: any) {
      console.error("Failed to create admin:", error)
      const message = error.response?.data?.message || "Failed to create admin"
      toast.error(message)
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="bg-white rounded-2xl border border-[#DFE1E7] p-6 shadow-sm">
      <form onSubmit={handleSubmit}>
        <div className="grid grid-cols-2 gap-6">
          {/* Full Name */}
          <div>
            <label className="block text-sm font-medium text-[#0D0D12] mb-2">
              Full Name <span className="text-[#DF1C41]">*</span>
            </label>
            <input
              type="text"
              placeholder="Enter Name"
              value={formData.fullName}
              onChange={(e) => handleChange("fullName", e.target.value)}
              className={`w-full px-4 py-3 border rounded-lg text-sm text-[#0D0D12] placeholder:text-[#A4ACB9] focus:outline-none focus:ring-2 focus:ring-[#301B69]/20 ${
                errors.fullName ? "border-[#DF1C41]" : "border-[#DFE1E7]"
              }`}
            />
            {errors.fullName && (
              <p className="mt-1 text-xs text-[#DF1C41]">{errors.fullName}</p>
            )}
          </div>

          {/* Email Address */}
          <div>
            <label className="block text-sm font-medium text-[#0D0D12] mb-2">
              Email Address <span className="text-[#DF1C41]">*</span>
            </label>
            <input
              type="email"
              placeholder="Enter Email"
              value={formData.email}
              onChange={(e) => handleChange("email", e.target.value)}
              className={`w-full px-4 py-3 border rounded-lg text-sm text-[#0D0D12] placeholder:text-[#A4ACB9] focus:outline-none focus:ring-2 focus:ring-[#301B69]/20 ${
                errors.email ? "border-[#DF1C41]" : "border-[#DFE1E7]"
              }`}
            />
            {errors.email && (
              <p className="mt-1 text-xs text-[#DF1C41]">{errors.email}</p>
            )}
          </div>

          {/* Password */}
          <div>
            <label className="block text-sm font-medium text-[#0D0D12] mb-2">
              Password <span className="text-[#DF1C41]">*</span>
            </label>
            <div className="relative">
              <input
                type={showPassword ? "text" : "password"}
                placeholder="Enter Password"
                value={formData.password}
                onChange={(e) => handleChange("password", e.target.value)}
                className={`w-full px-4 py-3 pr-12 border rounded-lg text-sm text-[#0D0D12] placeholder:text-[#A4ACB9] focus:outline-none focus:ring-2 focus:ring-[#301B69]/20 ${
                  errors.password ? "border-[#DF1C41]" : "border-[#DFE1E7]"
                }`}
              />
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className="absolute right-3 top-1/2 -translate-y-1/2 text-[#666D80] hover:text-[#0D0D12]"
              >
                {showPassword ? <EyeOff className="h-5 w-5" /> : <Eye className="h-5 w-5" />}
              </button>
            </div>
            {errors.password && (
              <p className="mt-1 text-xs text-[#DF1C41]">{errors.password}</p>
            )}
          </div>

          {/* Phone Number */}
          <div>
            <label className="block text-sm font-medium text-[#0D0D12] mb-2">
              Phone Number <span className="text-[#DF1C41]">*</span>
            </label>
            <input
              type="tel"
              placeholder="+966xxxxxxxxx"
              value={formData.phone}
              onChange={(e) => handleChange("phone", e.target.value)}
              className={`w-full px-4 py-3 border rounded-lg text-sm text-[#0D0D12] placeholder:text-[#A4ACB9] focus:outline-none focus:ring-2 focus:ring-[#301B69]/20 ${
                errors.phone ? "border-[#DF1C41]" : "border-[#DFE1E7]"
              }`}
            />
            {errors.phone && (
              <p className="mt-1 text-xs text-[#DF1C41]">{errors.phone}</p>
            )}
          </div>

          {/* Gender */}
          <div>
            <label className="block text-sm font-medium text-[#0D0D12] mb-2">
              Gender <span className="text-[#DF1C41]">*</span>
            </label>
            <div className="relative">
              <button
                type="button"
                onClick={() => setIsGenderDropdownOpen(!isGenderDropdownOpen)}
                className="w-full flex items-center justify-between px-4 py-3 border border-[#DFE1E7] rounded-lg text-sm text-[#0D0D12] bg-white focus:outline-none focus:ring-2 focus:ring-[#301B69]/20"
              >
                <span>{genders.find(g => g.value === formData.gender)?.label}</span>
                <ChevronDown className={`w-4 h-4 text-[#666D80] transition-transform ${isGenderDropdownOpen ? "rotate-180" : ""}`} />
              </button>

              {isGenderDropdownOpen && (
                <>
                  <div
                    className="fixed inset-0 z-10"
                    onClick={() => setIsGenderDropdownOpen(false)}
                  />
                  <div className="absolute top-full left-0 right-0 mt-1 bg-white border border-[#DFE1E7] rounded-lg shadow-lg z-20 overflow-hidden">
                    {genders.map((gender) => (
                      <button
                        key={gender.value}
                        type="button"
                        onClick={() => {
                          handleChange("gender", gender.value)
                          setIsGenderDropdownOpen(false)
                        }}
                        className={`w-full px-4 py-2.5 text-sm text-left hover:bg-[#F9FAFB] transition-colors ${
                          formData.gender === gender.value ? "bg-[#F9FAFB] text-[#301B69] font-medium" : "text-[#0D0D12]"
                        }`}
                      >
                        {gender.label}
                      </button>
                    ))}
                  </div>
                </>
              )}
            </div>
          </div>
        </div>

        {/* Permissions Section */}
        <div className="mt-8">
          <div className="flex items-center justify-between mb-4">
            <label className="text-sm font-medium text-[#0D0D12]">
              Permissions <span className="text-[#DF1C41]">*</span>
            </label>
            <button
              type="button"
              onClick={handleSelectAllPermissions}
              className="text-sm text-[#301B69] hover:underline"
            >
              {formData.permissions.length === ADMIN_PERMISSIONS.length ? "Deselect All" : "Select All"}
            </button>
          </div>

          {errors.permissions && (
            <p className="mb-3 text-xs text-[#DF1C41]">{errors.permissions}</p>
          )}

          <div className="grid grid-cols-2 gap-3">
            {ADMIN_PERMISSIONS.map((permission) => (
              <label
                key={permission.key}
                className={`flex items-start gap-3 p-3 rounded-lg border cursor-pointer hover:bg-gray-50 transition-colors ${
                  formData.permissions.includes(permission.key)
                    ? "border-[#301B69] bg-[#301B69]/5"
                    : "border-[#DFE1E7]"
                }`}
              >
                <input
                  type="checkbox"
                  checked={formData.permissions.includes(permission.key)}
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

        {/* Actions */}
        <div className="flex items-center justify-end gap-3 mt-8">
          <button
            type="submit"
            disabled={loading}
            className="px-6 py-2.5 bg-[#301B69] text-white text-sm font-medium rounded-lg hover:bg-[#301B69]/90 transition-colors disabled:opacity-50"
          >
            {loading ? "Creating..." : "Create Admin"}
          </button>
          <button
            type="button"
            onClick={onCancel}
            disabled={loading}
            className="px-6 py-2.5 bg-white border border-[#DFE1E7] text-[#0D0D12] text-sm font-medium rounded-lg hover:bg-[#F9FAFB] transition-colors"
          >
            Cancel
          </button>
        </div>
      </form>
    </div>
  )
}
