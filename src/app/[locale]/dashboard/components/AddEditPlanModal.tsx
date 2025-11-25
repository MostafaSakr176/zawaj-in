"use client"

import { useState, useEffect } from "react"
import { X, Plus, Trash2, Loader2, Check, Crown, Star, DollarSign } from "lucide-react"
import {
  SubscriptionPlan,
  CreatePlanData,
  createPlan,
  updatePlan
} from "@/lib/adminApi"
import toast from "react-hot-toast"

interface AddEditPlanModalProps {
  isOpen: boolean
  onClose: () => void
  onSuccess: () => void
  plan?: SubscriptionPlan | null
}

export function AddEditPlanModal({ isOpen, onClose, onSuccess, plan }: AddEditPlanModalProps) {
  const isEditing = !!plan
  const [loading, setLoading] = useState(false)
  const [errors, setErrors] = useState<Record<string, string>>({})
  const [newFeature, setNewFeature] = useState("")

  const [formData, setFormData] = useState<CreatePlanData>({
    name: "",
    priceMonthly: 0,
    priceYearly: 0,
    features: [],
    maxLikesPerDay: 10,
    canSendMessages: false,
    canViewLikes: false,
    canSeeWhoLikedYou: false,
    prioritySupport: false,
    profileBadge: null,
    displayOrder: 0,
  })

  useEffect(() => {
    if (plan) {
      setFormData({
        name: plan.name,
        priceMonthly: plan.priceMonthly,
        priceYearly: plan.priceYearly,
        features: plan.features,
        maxLikesPerDay: plan.maxLikesPerDay,
        canSendMessages: plan.canSendMessages,
        canViewLikes: plan.canViewLikes,
        canSeeWhoLikedYou: plan.canSeeWhoLikedYou,
        prioritySupport: plan.prioritySupport,
        profileBadge: plan.profileBadge,
        displayOrder: plan.displayOrder,
      })
    } else {
      setFormData({
        name: "",
        priceMonthly: 0,
        priceYearly: 0,
        features: [],
        maxLikesPerDay: 10,
        canSendMessages: false,
        canViewLikes: false,
        canSeeWhoLikedYou: false,
        prioritySupport: false,
        profileBadge: null,
        displayOrder: 0,
      })
    }
    setErrors({})
    setNewFeature("")
  }, [plan, isOpen])

  const handleChange = (field: keyof CreatePlanData, value: any) => {
    setFormData(prev => ({ ...prev, [field]: value }))
    if (errors[field]) {
      setErrors(prev => ({ ...prev, [field]: "" }))
    }
  }

  const addFeature = () => {
    if (newFeature.trim()) {
      setFormData(prev => ({
        ...prev,
        features: [...prev.features, newFeature.trim()]
      }))
      setNewFeature("")
    }
  }

  const removeFeature = (index: number) => {
    setFormData(prev => ({
      ...prev,
      features: prev.features.filter((_, i) => i !== index)
    }))
  }

  const validateForm = (): boolean => {
    const newErrors: Record<string, string> = {}

    if (!formData.name.trim()) {
      newErrors.name = "Plan name is required"
    }

    if (formData.priceMonthly < 0) {
      newErrors.priceMonthly = "Monthly price must be a positive number"
    }

    if (formData.priceYearly < 0) {
      newErrors.priceYearly = "Yearly price must be a positive number"
    }

    if (formData.features.length === 0) {
      newErrors.features = "At least one feature is required"
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
      if (isEditing && plan) {
        const response = await updatePlan(plan.id, formData)
        if (response.success) {
          toast.success("Plan updated successfully")
          onSuccess()
        }
      } else {
        const response = await createPlan(formData)
        if (response.success) {
          toast.success("Plan created successfully")
          onSuccess()
        }
      }
    } catch (error: any) {
      console.error("Failed to save plan:", error)
      const message = error.response?.data?.message || `Failed to ${isEditing ? 'update' : 'create'} plan`
      toast.error(message)
    } finally {
      setLoading(false)
    }
  }

  const suggestedFeatures = [
    "Unlimited likes",
    "See who liked you",
    "Priority support",
    "Profile boost",
    "Advanced filters",
    "No ads",
  ]

  const addSuggestedFeature = (feature: string) => {
    if (!formData.features.includes(feature)) {
      setFormData(prev => ({
        ...prev,
        features: [...prev.features, feature]
      }))
    }
  }

  if (!isOpen) return null

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center overflow-y-auto p-4">
      {/* Backdrop */}
      <div className="absolute inset-0 bg-black/30" onClick={loading ? undefined : onClose} />

      {/* Modal */}
      <div className="relative bg-white rounded-2xl shadow-xl w-full max-w-2xl max-h-[90vh] overflow-hidden flex flex-col">
        {/* Header */}
        <div className="flex items-center justify-between px-6 py-4 border-b border-gray-100">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 bg-amber-50 rounded-xl flex items-center justify-center">
              <Crown className="w-5 h-5 text-amber-500" />
            </div>
            <div>
              <h2 className="text-lg font-semibold text-gray-900">
                {isEditing ? "Edit Plan" : "Create New Plan"}
              </h2>
              <p className="text-sm text-gray-500">
                {isEditing ? "Update plan details" : "Add a new subscription plan"}
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            disabled={loading}
            className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
          >
            <X className="w-5 h-5 text-gray-400" />
          </button>
        </div>

        {/* Content */}
        <div className="flex-1 overflow-y-auto p-6">
          <form onSubmit={handleSubmit} id="plan-form" className="space-y-6">
            
            {/* Plan Name & Order */}
            <div className="grid grid-cols-3 gap-4">
              <div className="col-span-2">
                <label className="block text-sm font-medium text-gray-700 mb-1.5">
                  Plan Name <span className="text-red-400">*</span>
                </label>
                <input
                  type="text"
                  placeholder="e.g., Premium, Gold"
                  value={formData.name}
                  onChange={(e) => handleChange("name", e.target.value)}
                  className={`w-full px-3.5 py-2.5 border rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-[#301B69]/10 focus:border-[#301B69] transition-all ${
                    errors.name ? "border-red-300 bg-red-50" : "border-gray-200 bg-white"
                  }`}
                />
                {errors.name && <p className="mt-1 text-xs text-red-500">{errors.name}</p>}
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1.5">
                  Display Order
                </label>
                <input
                  type="number"
                  min="0"
                  value={formData.displayOrder}
                  onChange={(e) => handleChange("displayOrder", parseInt(e.target.value) || 0)}
                  className="w-full px-3.5 py-2.5 border border-gray-200 rounded-lg text-sm bg-white focus:outline-none focus:ring-2 focus:ring-[#301B69]/10 focus:border-[#301B69]"
                />
              </div>
            </div>

            {/* Pricing */}
            <div className="bg-gray-50 rounded-xl p-4">
              <div className="flex items-center gap-2 mb-3">
                <DollarSign className="w-4 h-4 text-green-500" />
                <span className="text-sm font-medium text-gray-700">Pricing</span>
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-medium text-gray-500 mb-1.5">
                    Monthly Price (USD)
                  </label>
                  <div className="relative">
                    <span className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 text-sm">$</span>
                    <input
                      type="number"
                      min="0"
                      step="0.01"
                      placeholder="0.00"
                      value={formData.priceMonthly}
                      onChange={(e) => handleChange("priceMonthly", parseFloat(e.target.value) || 0)}
                      className="w-full pl-7 pr-3.5 py-2.5 border border-gray-200 rounded-lg text-sm bg-white focus:outline-none focus:ring-2 focus:ring-[#301B69]/10 focus:border-[#301B69]"
                    />
                  </div>
                </div>
                <div>
                  <label className="block text-xs font-medium text-gray-500 mb-1.5">
                    Yearly Price (USD)
                  </label>
                  <div className="relative">
                    <span className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 text-sm">$</span>
                    <input
                      type="number"
                      min="0"
                      step="0.01"
                      placeholder="0.00"
                      value={formData.priceYearly}
                      onChange={(e) => handleChange("priceYearly", parseFloat(e.target.value) || 0)}
                      className="w-full pl-7 pr-3.5 py-2.5 border border-gray-200 rounded-lg text-sm bg-white focus:outline-none focus:ring-2 focus:ring-[#301B69]/10 focus:border-[#301B69]"
                    />
                  </div>
                  {formData.priceMonthly > 0 && formData.priceYearly > 0 && (
                    <p className="mt-1 text-xs text-green-600">
                      Save {Math.round((1 - formData.priceYearly / (formData.priceMonthly * 12)) * 100)}% yearly
                    </p>
                  )}
                </div>
              </div>
            </div>

            {/* Features */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Features <span className="text-red-400">*</span>
              </label>
              
              {/* Feature List */}
              {formData.features.length > 0 && (
                <div className="space-y-1.5 mb-3">
                  {formData.features.map((feature, index) => (
                    <div key={index} className="flex items-center gap-2 bg-[#F4F2FF] px-3 py-2 rounded-lg group">
                      <Check className="w-4 h-4 text-[#301B69] flex-shrink-0" />
                      <span className="flex-1 text-sm text-gray-700">{feature}</span>
                      <button
                        type="button"
                        onClick={() => removeFeature(index)}
                        className="p-1 hover:bg-[#EAE8F0] rounded transition-colors opacity-50 group-hover:opacity-100"
                      >
                        <X className="w-3.5 h-3.5 text-gray-500" />
                      </button>
                    </div>
                  ))}
                </div>
              )}

              {/* Add Feature */}
              <div className="flex gap-2 mb-2">
                <input
                  type="text"
                  placeholder="Type a feature and press Enter..."
                  value={newFeature}
                  onChange={(e) => setNewFeature(e.target.value)}
                  onKeyPress={(e) => e.key === "Enter" && (e.preventDefault(), addFeature())}
                  className="flex-1 px-3.5 py-2 border border-gray-200 rounded-lg text-sm bg-white focus:outline-none focus:ring-2 focus:ring-[#301B69]/10 focus:border-[#301B69]"
                />
                <button
                  type="button"
                  onClick={addFeature}
                  disabled={!newFeature.trim()}
                  className="px-3 py-2 bg-[#301B69] text-white rounded-lg hover:bg-[#301B69]/90 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  <Plus className="w-4 h-4" />
                </button>
              </div>

              {/* Quick Add */}
              <div className="flex flex-wrap gap-1.5">
                {suggestedFeatures
                  .filter(f => !formData.features.includes(f))
                  .map((feature) => (
                    <button
                      key={feature}
                      type="button"
                      onClick={() => addSuggestedFeature(feature)}
                      className="px-2.5 py-1 text-xs border border-dashed border-gray-300 rounded-full text-gray-500 hover:border-[#301B69] hover:text-[#301B69] hover:bg-[#F4F2FF] transition-all"
                    >
                      + {feature}
                    </button>
                  ))}
              </div>
              {errors.features && <p className="mt-2 text-xs text-red-500">{errors.features}</p>}
            </div>

            {/* Daily Likes */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Daily Likes Limit
              </label>
              <div className="flex items-center gap-4">
                <input
                  type="number"
                  min="1"
                  value={formData.maxLikesPerDay ?? ''}
                  onChange={(e) => handleChange("maxLikesPerDay", e.target.value ? parseInt(e.target.value) : null)}
                  disabled={formData.maxLikesPerDay === null}
                  className="w-24 px-3.5 py-2 border border-gray-200 rounded-lg text-sm bg-white focus:outline-none focus:ring-2 focus:ring-[#301B69]/10 focus:border-[#301B69] disabled:bg-gray-100 disabled:text-gray-400"
                />
                <label className="flex items-center gap-2 cursor-pointer select-none">
                  <input
                    type="checkbox"
                    checked={formData.maxLikesPerDay === null}
                    onChange={(e) => handleChange("maxLikesPerDay", e.target.checked ? null : 10)}
                    className="w-4 h-4 rounded border-gray-300 text-[#301B69] focus:ring-[#301B69]"
                  />
                  <span className="text-sm text-gray-600">Unlimited</span>
                </label>
              </div>
            </div>

            {/* Permissions */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Permissions
              </label>
              <div className="grid grid-cols-2 gap-2">
                {[
                  { key: "canSendMessages", label: "Send Messages" },
                  { key: "canViewLikes", label: "View Likes" },
                  { key: "canSeeWhoLikedYou", label: "See Who Liked" },
                  { key: "prioritySupport", label: "Priority Support" },
                ].map((perm) => (
                  <label
                    key={perm.key}
                    className={`flex items-center gap-3 px-3.5 py-3 rounded-lg border cursor-pointer transition-all ${
                      formData[perm.key as keyof CreatePlanData]
                        ? "border-[#301B69]/30 bg-[#F4F2FF]"
                        : "border-gray-200 bg-white hover:bg-gray-50"
                    }`}
                  >
                    <input
                      type="checkbox"
                      checked={formData[perm.key as keyof CreatePlanData] as boolean}
                      onChange={(e) => handleChange(perm.key as keyof CreatePlanData, e.target.checked)}
                      className="w-4 h-4 rounded border-gray-300 text-[#301B69] focus:ring-[#301B69]"
                    />
                    <span className="text-sm text-gray-700">{perm.label}</span>
                  </label>
                ))}
              </div>
            </div>

            {/* Profile Badge */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1.5">
                Profile Badge
              </label>
              <input
                type="text"
                placeholder="e.g., Premium Member, VIP"
                value={formData.profileBadge || ''}
                onChange={(e) => handleChange("profileBadge", e.target.value || null)}
                className="w-full px-3.5 py-2.5 border border-gray-200 rounded-lg text-sm bg-white focus:outline-none focus:ring-2 focus:ring-[#301B69]/10 focus:border-[#301B69]"
              />
              <p className="mt-1 text-xs text-gray-400">Leave empty for no badge</p>
            </div>
          </form>
        </div>

        {/* Footer */}
        <div className="flex items-center justify-end gap-3 px-6 py-4 border-t border-gray-100 bg-gray-50">
          <button
            type="button"
            onClick={onClose}
            disabled={loading}
            className="px-4 py-2 text-sm font-medium text-gray-600 hover:text-gray-800 transition-colors"
          >
            Cancel
          </button>
          <button
            type="submit"
            form="plan-form"
            disabled={loading}
            className="px-5 py-2 bg-[#301B69] text-white text-sm font-medium rounded-lg hover:bg-[#301B69]/90 transition-colors disabled:opacity-50 flex items-center gap-2"
          >
            {loading ? (
              <>
                <Loader2 className="w-4 h-4 animate-spin" />
                {isEditing ? "Saving..." : "Creating..."}
              </>
            ) : (
              <>
                {isEditing ? "Save Changes" : "Create Plan"}
              </>
            )}
          </button>
        </div>
      </div>
    </div>
  )
}
