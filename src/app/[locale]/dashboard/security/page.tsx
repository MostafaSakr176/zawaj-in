"use client"

import { useState } from "react"
import { DashboardHeader } from "../components/DashboardHeader"
import { DashboardSidebar } from "../components/DashboardSidebar"
import { Breadcrumb } from "../components/Breadcrumb"
import { SecuritySettingRow } from "../components/SecuritySettingRow"

export default function SecurityPrivacyPage() {
  const [twoFactorEnabled, setTwoFactorEnabled] = useState(true)
  const [twoFactorMethod, setTwoFactorMethod] = useState("email_otp")
  const [captchaEnabled, setCaptchaEnabled] = useState(false)

  const twoFactorOptions = [
    { label: "Email OTP", value: "email_otp" },
    { label: "SMS OTP", value: "sms_otp" },
    { label: "Authenticator App", value: "authenticator" }
  ]

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
                { label: "Security & Privacy" }
              ]}
            />
          </div>

          {/* Security & Privacy Section */}
          <div className="px-8 py-6">
            <div className="flex gap-16">
              {/* Left Column - Section Header */}
              <div className="w-56 flex-shrink-0">
                <h2 className="text-base font-semibold text-[#0D0D12] mb-2">Security & Privacy</h2>
                <p className="text-sm text-[#666D80] leading-relaxed">
                  Lorem Ipsum is simply dummy text of the printing and typesetting industry. Lorem Ipsum
                </p>
              </div>

              {/* Right Column - Settings */}
              <div className="flex-1">
                {/* Two-Factor Authentication */}
                <SecuritySettingRow
                  title="Two-Factor Authentication (2FA)"
                  description="Add an extra layer of protection to admin accounts using SMS, Email, or Authenticator App"
                  enabled={twoFactorEnabled}
                  onToggle={setTwoFactorEnabled}
                  preferredMethod={{
                    label: "Preferred Method",
                    value: twoFactorMethod,
                    options: twoFactorOptions,
                    onChange: setTwoFactorMethod
                  }}
                />

                {/* CAPTCHA Protection */}
                <SecuritySettingRow
                  title="CAPTCHA Protection"
                  description="Prevent automated bots from spamming login or registration forms."
                  enabled={captchaEnabled}
                  onToggle={setCaptchaEnabled}
                />
              </div>
            </div>
          </div>
        </main>
      </div>
    </div>
  )
}
