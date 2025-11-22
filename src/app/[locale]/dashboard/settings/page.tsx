"use client"

import { useState, useRef } from "react"
import { DashboardHeader } from "../components/DashboardHeader"
import { DashboardSidebar } from "../components/DashboardSidebar"
import { Breadcrumb } from "../components/Breadcrumb"
import { FormInput } from "../components/FormInput"
import { FormSelect } from "../components/FormSelect"
import { PhoneInput } from "../components/PhoneInput"
import { PasswordInput } from "../components/PasswordInput"
import { ChangePasswordModal } from "../components/ChangePasswordModal"
import { Pencil } from "lucide-react"
import Image from "next/image"

const roleOptions = [
  { value: "super_admin", label: "Super Admin" },
  { value: "admin", label: "Admin" },
  { value: "moderator", label: "Moderator" },
  { value: "user", label: "User" },
]

const languageOptions = [
  { value: "en_us", label: "English ( USA )" },
  { value: "en_uk", label: "English ( UK )" },
  { value: "ar", label: "Arabic" },
  { value: "fr", label: "French" },
]

const alertOptions = [
  { value: "email", label: "Via Email" },
  { value: "sms", label: "Via SMS" },
  { value: "push", label: "Push Notification" },
  { value: "none", label: "None" },
]

export default function SettingsPage() {
  const [formData, setFormData] = useState({
    fullName: "Mohamed Mostafa",
    role: "super_admin",
    phoneNumber: "+9667666554165",
    language: "en_us",
    alertMethod: "email",
  })
  const [avatarPreview, setAvatarPreview] = useState<string | null>(null)
  const [isPasswordModalOpen, setIsPasswordModalOpen] = useState(false)
  const fileInputRef = useRef<HTMLInputElement>(null)

  const handleChangePassword = () => {
    setIsPasswordModalOpen(true)
  }

  const handleSavePassword = (currentPassword: string, newPassword: string) => {
    console.log("Password changed:", { currentPassword, newPassword })
    // Handle password update logic here
  }

  const handleAvatarClick = () => {
    fileInputRef.current?.click()
  }

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (file) {
      const reader = new FileReader()
      reader.onloadend = () => {
        setAvatarPreview(reader.result as string)
      }
      reader.readAsDataURL(file)
    }
  }

  return (
    <div className="flex h-screen bg-gray-50">
      <DashboardSidebar />

      <div className="flex-1 flex flex-col overflow-hidden">
        <DashboardHeader />

        <main className="flex-1 overflow-y-auto p-8">
          <div className="max-w-4xl mx-auto space-y-6">
            {/* Breadcrumb */}
            <Breadcrumb
              items={[
                { label: "Other", href: "/dashboard" },
                { label: "Settings" }
              ]}
            />

            {/* General Settings Card */}
            <div className="bg-white rounded-xl border-2 border-dashed border-[#301B69] p-8">
              {/* Header and Avatar Row */}
              <div className="flex justify-between items-start mb-8">
                <div>
                  <h2 className="text-base font-semibold text-[#0D0D12]">General Settings</h2>
                  <p className="text-sm text-[#666D80] mt-1">
                    Your users will use this information to contact<br />you.
                  </p>

                  {/* Avatar Section */}
                  <div className="mt-6">
                    <p className="text-sm font-medium text-[#0D0D12]">Avatar</p>
                    <p className="text-xs text-[#666D80] mt-1">
                      Only *.png, *.jpg and *.jpeg image files<br />are accepted
                    </p>
                  </div>
                </div>

                {/* Avatar Image on Right */}
                <div className="relative">
                  <div className="w-24 h-28 rounded-lg overflow-hidden bg-[#c4e538]">
                    {avatarPreview ? (
                      <Image
                        src={avatarPreview}
                        alt="Avatar"
                        fill
                        className="object-cover"
                      />
                    ) : (
                      <div className="w-full h-full flex items-end justify-center">
                        <div className="w-16 h-20 rounded-t-full bg-[#f5e6d3] flex flex-col items-center">
                          <div className="w-10 h-10 rounded-full bg-[#f5e6d3] mt-2" />
                        </div>
                      </div>
                    )}
                  </div>
                  <button
                    type="button"
                    onClick={handleAvatarClick}
                    className="absolute -top-2 -right-2 w-7 h-7 bg-white border border-[#DFE1E7] rounded-full flex items-center justify-center shadow-sm hover:bg-gray-50 transition-colors"
                  >
                    <Pencil className="w-3.5 h-3.5 text-[#301B69]" />
                  </button>
                  <input
                    ref={fileInputRef}
                    type="file"
                    accept=".png,.jpg,.jpeg"
                    onChange={handleFileChange}
                    className="hidden"
                  />
                </div>
              </div>

              <form className="space-y-6">
                {/* Name and Role Row */}
                <div className="grid grid-cols-2 gap-6">
                  <FormInput
                    label="Full Name"
                    value={formData.fullName}
                    onChange={(e) => setFormData({ ...formData, fullName: e.target.value })}
                    placeholder="Enter full name"
                  />
                  <FormSelect
                    label="Role"
                    options={roleOptions}
                    value={formData.role}
                    onChange={(value) => setFormData({ ...formData, role: value })}
                  />
                </div>

                {/* Phone and Language Row */}
                <div className="grid grid-cols-2 gap-6">
                  <PhoneInput
                    label="Phone Number"
                    value={formData.phoneNumber}
                    onChange={(value) => setFormData({ ...formData, phoneNumber: value })}
                    required
                  />
                  <FormSelect
                    label="Language"
                    options={languageOptions}
                    value={formData.language}
                    onChange={(value) => setFormData({ ...formData, language: value })}
                  />
                </div>

                {/* Alert and Password Row */}
                <div className="grid grid-cols-2 gap-6">
                  <FormSelect
                    label="New Message Alert"
                    options={alertOptions}
                    value={formData.alertMethod}
                    onChange={(value) => setFormData({ ...formData, alertMethod: value })}
                  />
                  <PasswordInput
                    label="Password"
                    onChangePassword={handleChangePassword}
                  />
                </div>
              </form>
            </div>
          </div>
        </main>
      </div>

      {/* Change Password Modal */}
      <ChangePasswordModal
        isOpen={isPasswordModalOpen}
        onClose={() => setIsPasswordModalOpen(false)}
        onSave={handleSavePassword}
      />
    </div>
  )
}
