"use client"

import { useState, useEffect } from "react"
import { Trash2, Edit2, Eye, EyeOff, Star, Crown, Zap, MessageCircle, Heart, Shield } from "lucide-react"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "./Table"
import { Checkbox } from "./Checkbox"
import { Badge } from "./Badge"
import { ConfirmModal } from "./ConfirmModal"
import {
  SubscriptionPlan,
  getPlans,
  deletePlan
} from "@/lib/adminApi"
import toast from "react-hot-toast"

interface PlansTableProps {
  onAddNew?: () => void
  onEdit?: (plan: SubscriptionPlan) => void
  refreshKey?: number
}

export function PlansTable({ onAddNew, onEdit, refreshKey }: PlansTableProps) {
  const [plans, setPlans] = useState<SubscriptionPlan[]>([])
  const [selectedPlans, setSelectedPlans] = useState<string[]>([])
  const [selectAll, setSelectAll] = useState(false)
  const [loading, setLoading] = useState(true)
  const [actionLoading, setActionLoading] = useState<string | null>(null)
  const [deleteModal, setDeleteModal] = useState<{ isOpen: boolean; plan: SubscriptionPlan | null }>({
    isOpen: false,
    plan: null
  })

  const fetchPlans = async () => {
    try {
      setLoading(true)
      const response = await getPlans()
      if (response.success) {
        // Sort by displayOrder
        const sortedPlans = [...response.data].sort((a, b) => a.displayOrder - b.displayOrder)
        setPlans(sortedPlans)
      }
    } catch (error) {
      console.error("Failed to fetch plans:", error)
      toast.error("Failed to load subscription plans")
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    fetchPlans()
  }, [refreshKey])

  const handleSelectAll = (e: React.ChangeEvent<HTMLInputElement>) => {
    const checked = e.target.checked
    if (checked) {
      setSelectedPlans(plans.map(plan => plan.id))
    } else {
      setSelectedPlans([])
    }
    setSelectAll(checked)
  }

  const handleSelectPlan = (id: string) => {
    setSelectedPlans(prev =>
      prev.includes(id)
        ? prev.filter(planId => planId !== id)
        : [...prev, id]
    )
  }

  const handleDeleteClick = (plan: SubscriptionPlan) => {
    setDeleteModal({ isOpen: true, plan })
  }

  const handleDeleteConfirm = async () => {
    if (!deleteModal.plan) return

    try {
      setActionLoading(deleteModal.plan.id)
      const response = await deletePlan(deleteModal.plan.id)
      if (response.success) {
        toast.success("Plan deactivated successfully")
        fetchPlans()
        setDeleteModal({ isOpen: false, plan: null })
      }
    } catch (error) {
      console.error("Failed to deactivate plan:", error)
      toast.error("Failed to deactivate plan")
    } finally {
      setActionLoading(null)
    }
  }

  const formatPrice = (price: number) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD'
    }).format(price)
  }

  const getPlanIcon = (plan: SubscriptionPlan, index: number) => {
    // Use badge name to determine icon, or fallback to index
    const name = plan.name.toLowerCase()
    if (name.includes('platinum') || name.includes('vip')) {
      return <Crown className="w-5 h-5 text-purple-500" />
    }
    if (name.includes('gold') || name.includes('premium')) {
      return <Star className="w-5 h-5 text-yellow-500" />
    }
    if (name.includes('silver') || name.includes('plus')) {
      return <Shield className="w-5 h-5 text-gray-400" />
    }
    const icons = [
      <Zap key="zap" className="w-5 h-5 text-blue-500" />,
      <Star key="star" className="w-5 h-5 text-yellow-500" />,
      <Crown key="crown" className="w-5 h-5 text-purple-500" />
    ]
    return icons[index % icons.length]
  }

  const getPlanColor = (plan: SubscriptionPlan) => {
    const name = plan.name.toLowerCase()
    if (name.includes('platinum') || name.includes('vip')) return 'from-purple-100 to-purple-50'
    if (name.includes('gold') || name.includes('premium')) return 'from-yellow-100 to-yellow-50'
    if (name.includes('silver')) return 'from-gray-100 to-gray-50'
    return 'from-[#F4F2FF] to-[#EAE8F0]'
  }

  if (loading) {
    return (
      <div className="bg-white rounded-2xl border border-[#DFE1E7] shadow-sm p-8">
        <div className="flex items-center justify-center">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-[#301B69]"></div>
          <span className="ml-3 text-[#666D80]">Loading plans...</span>
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
            <h2 className="text-lg font-semibold text-[#0D0D12]">Subscription Plans</h2>
            <p className="text-sm text-[#666D80]">{plans.length} total plans</p>
          </div>
          <button
            onClick={onAddNew}
            className="px-4 py-2 bg-[#301B69] text-white text-sm font-medium rounded-lg hover:bg-[#301B69]/90 transition-colors"
          >
            Add New Plan
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
              <TableHead>Plan</TableHead>
              <TableHead>Monthly Price</TableHead>
              <TableHead>Yearly Price</TableHead>
              <TableHead>Features</TableHead>
              <TableHead>Permissions</TableHead>
              <TableHead>Badge</TableHead>
              <TableHead>Status</TableHead>
              <TableHead className="w-24">Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {plans.length === 0 ? (
              <TableRow>
                <TableCell colSpan={9} className="text-center py-12">
                  <div className="flex flex-col items-center gap-3">
                    <div className="w-16 h-16 bg-[#F4F2FF] rounded-full flex items-center justify-center">
                      <Crown className="w-8 h-8 text-[#301B69]" />
                    </div>
                    <p className="text-[#666D80] font-medium">No subscription plans found</p>
                    <p className="text-sm text-[#A4ACB9]">Create your first plan to get started</p>
                    <button
                      onClick={onAddNew}
                      className="mt-2 px-4 py-2 bg-[#301B69] text-white text-sm font-medium rounded-lg hover:bg-[#301B69]/90 transition-colors"
                    >
                      Create Plan
                    </button>
                  </div>
                </TableCell>
              </TableRow>
            ) : (
              plans.map((plan, index) => (
                <TableRow key={plan.id}>
                  <TableCell>
                    <Checkbox
                      checked={selectedPlans.includes(plan.id)}
                      onChange={() => handleSelectPlan(plan.id)}
                    />
                  </TableCell>
                  <TableCell>
                    <div className="flex items-center gap-3">
                      <div className={`w-10 h-10 bg-gradient-to-br ${getPlanColor(plan)} rounded-xl flex items-center justify-center`}>
                        {getPlanIcon(plan, index)}
                      </div>
                      <div>
                        <p className="font-semibold text-[#0D0D12]">{plan.name}</p>
                        <p className="text-xs text-[#666D80]">Order: {plan.displayOrder}</p>
                      </div>
                    </div>
                  </TableCell>
                  <TableCell>
                    <span className="font-semibold text-[#0D0D12]">{formatPrice(plan.priceMonthly)}</span>
                    <span className="text-xs text-[#666D80]">/mo</span>
                  </TableCell>
                  <TableCell>
                    <span className="font-semibold text-[#0D0D12]">{formatPrice(plan.priceYearly)}</span>
                    <span className="text-xs text-[#666D80]">/yr</span>
                  </TableCell>
                  <TableCell>
                    <div className="flex flex-wrap gap-1 max-w-[180px]">
                      {plan.features.slice(0, 2).map((feature, idx) => (
                        <Badge key={idx} variant="neutral" className="text-xs">
                          {feature.length > 12 ? `${feature.substring(0, 12)}...` : feature}
                        </Badge>
                      ))}
                      {plan.features.length > 2 && (
                        <Badge variant="neutral" className="text-xs">
                          +{plan.features.length - 2}
                        </Badge>
                      )}
                    </div>
                  </TableCell>
                  <TableCell>
                    <div className="flex gap-1.5">
                      {plan.canSendMessages && (
                        <div className="w-6 h-6 rounded-full bg-blue-100 flex items-center justify-center" title="Can send messages">
                          <MessageCircle className="w-3.5 h-3.5 text-blue-600" />
                        </div>
                      )}
                      {plan.canViewLikes && (
                        <div className="w-6 h-6 rounded-full bg-pink-100 flex items-center justify-center" title="Can view likes">
                          <Heart className="w-3.5 h-3.5 text-pink-600" />
                        </div>
                      )}
                      {plan.canSeeWhoLikedYou && (
                        <div className="w-6 h-6 rounded-full bg-purple-100 flex items-center justify-center" title="See who liked you">
                          <Eye className="w-3.5 h-3.5 text-purple-600" />
                        </div>
                      )}
                      {plan.prioritySupport && (
                        <div className="w-6 h-6 rounded-full bg-green-100 flex items-center justify-center" title="Priority support">
                          <Shield className="w-3.5 h-3.5 text-green-600" />
                        </div>
                      )}
                    </div>
                  </TableCell>
                  <TableCell>
                    {plan.profileBadge ? (
                      <Badge variant="gold" className="text-xs">
                        {plan.profileBadge}
                      </Badge>
                    ) : (
                      <span className="text-[#A4ACB9] text-sm">—</span>
                    )}
                  </TableCell>
                  <TableCell>
                    <Badge variant={plan.isActive ? "success" : "warning"} showDot>
                      {plan.isActive ? "Active" : "Inactive"}
                    </Badge>
                  </TableCell>
                  <TableCell>
                    <div className="flex items-center gap-2">
                      {/* Edit */}
                      <button
                        onClick={() => onEdit?.(plan)}
                        className="p-1.5 hover:bg-gray-100 rounded transition-colors"
                        title="Edit Plan"
                        disabled={actionLoading === plan.id}
                      >
                        <Edit2 className="h-4 w-4 text-[#666D80]" />
                      </button>

                      {/* Delete/Deactivate */}
                      <button
                        onClick={() => handleDeleteClick(plan)}
                        className="p-1.5 hover:bg-gray-100 rounded transition-colors"
                        title="Deactivate Plan"
                        disabled={actionLoading === plan.id}
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
      </div>

      {/* Delete Confirmation Modal */}
      <ConfirmModal
        isOpen={deleteModal.isOpen}
        onClose={() => setDeleteModal({ isOpen: false, plan: null })}
        onConfirm={handleDeleteConfirm}
        title="Deactivate Plan"
        message={`Are you sure you want to deactivate "${deleteModal.plan?.name}"? Users with this plan will keep their subscription until it expires.`}
        confirmText="Deactivate"
        cancelText="Cancel"
        variant="danger"
        loading={actionLoading === deleteModal.plan?.id}
      />
    </>
  )
}
