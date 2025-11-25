"use client"

import { useState } from "react"
import { MoreVertical, Eye, Edit, Trash2 } from "lucide-react"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "./Table"
import { Checkbox } from "./Checkbox"
import { Badge } from "./Badge"
import Image from "next/image"

interface Subscription {
  id: string
  userName: string
  price: string
  email: string
  planType: "Gold package" | "Onetime package" | "Silver package"
  status: "Active" | "Expired" | "Cancelled"
  subscribedOn: string
  renewalDate: string
}

const mockSubscriptions: Subscription[] = [
  {
    id: "#12345",
    userName: "Olivia Smith",
    price: "$2,745",
    email: "example@gmail.com",
    planType: "Gold package",
    status: "Active",
    subscribedOn: "May 8, 2025",
    renewalDate: "May 8, 2025"
  },
  {
    id: "#12345",
    userName: "Sophia Bennett",
    price: "$8,361",
    email: "example@gmail.com",
    planType: "Onetime package",
    status: "Expired",
    subscribedOn: "May 15, 2025",
    renewalDate: "May 15, 2025"
  },
  {
    id: "#12345",
    userName: "Lucas Martinez",
    price: "$4,029",
    email: "example@gmail.com",
    planType: "Gold package",
    status: "Cancelled",
    subscribedOn: "May 27, 2025",
    renewalDate: "May 27, 2025"
  },
  {
    id: "#12345",
    userName: "Liam Johnson",
    price: "$1,597",
    email: "example@gmail.com",
    planType: "Silver package",
    status: "Expired",
    subscribedOn: "May 15, 2025",
    renewalDate: "May 15, 2025"
  },
  {
    id: "#12345",
    userName: "Emma Brown",
    price: "$4,823",
    email: "example@gmail.com",
    planType: "Gold package",
    status: "Active",
    subscribedOn: "May 15, 2025",
    renewalDate: "May 15, 2025"
  },
  {
    id: "#12345",
    userName: "Aiden Davis",
    price: "$7,184",
    email: "example@gmail.com",
    planType: "Onetime package",
    status: "Cancelled",
    subscribedOn: "May 22, 2025",
    renewalDate: "May 22, 2025"
  },
  {
    id: "#12345",
    userName: "Noah Williams",
    price: "$5,630",
    email: "example@gmail.com",
    planType: "Silver package",
    status: "Active",
    subscribedOn: "May 15, 2025",
    renewalDate: "May 15, 2025"
  },
  {
    id: "#12345",
    userName: "Isabella Garcia",
    price: "$2,498",
    email: "example@gmail.com",
    planType: "Gold package",
    status: "Cancelled",
    subscribedOn: "May 15, 2025",
    renewalDate: "May 15, 2025"
  },
  {
    id: "#12345",
    userName: "Mia Rodriguez",
    price: "$3,157",
    email: "example@gmail.com",
    planType: "Silver package",
    status: "Active",
    subscribedOn: "May 3, 2025",
    renewalDate: "May 3, 2025"
  },
]

export function SubscriptionsTable() {
  const [selectedSubscriptions, setSelectedSubscriptions] = useState<string[]>([])
  const [selectAll, setSelectAll] = useState(false)

  const handleSelectAll = () => {
    if (selectAll) {
      setSelectedSubscriptions([])
    } else {
      setSelectedSubscriptions(mockSubscriptions.map((_, idx) => idx.toString()))
    }
    setSelectAll(!selectAll)
  }

  const handleSelectSubscription = (idx: string) => {
    setSelectedSubscriptions(prev =>
      prev.includes(idx)
        ? prev.filter(subIdx => subIdx !== idx)
        : [...prev, idx]
    )
  }

  const getStatusBadgeVariant = (status: string) => {
    switch (status) {
      case "Active":
        return "success"
      case "Expired":
        return "warning"
      case "Cancelled":
        return "error"
      default:
        return "neutral"
    }
  }

  return (
    <div className="bg-white rounded-2xl border border-[#DFE1E7] shadow-sm overflow-hidden">
      <div className="px-6 py-5 border-b border-[#DFE1E7]">
        <h2 className="text-base font-semibold text-[#0D0D12]">Plans Subscribers Table</h2>
      </div>

      <Table>
        <TableHeader>
          <TableRow>
            <TableHead className="w-12">No</TableHead>
            <TableHead>Name</TableHead>
            <TableHead>Price</TableHead>
            <TableHead>Email / Username</TableHead>
            <TableHead>Plan Type</TableHead>
            <TableHead>Status</TableHead>
            <TableHead>Subscribed On</TableHead>
            <TableHead>Renewal Date</TableHead>
            <TableHead className="w-20">Actions</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {mockSubscriptions.map((subscription, idx) => (
            <TableRow key={idx}>
              <TableCell className="font-medium text-[#0D0D12]">{subscription.id}</TableCell>
              <TableCell className="font-medium text-[#0D0D12]">{subscription.userName}</TableCell>
              <TableCell className="font-medium text-[#0D0D12]">{subscription.price}</TableCell>
              <TableCell className="text-[#666D80]">{subscription.email}</TableCell>
              <TableCell>
                <span className="text-[#0D0D12]">{subscription.planType}</span>
              </TableCell>
              <TableCell>
                <Badge variant={getStatusBadgeVariant(subscription.status)} showDot>
                  {subscription.status}
                </Badge>
              </TableCell>
              <TableCell className="text-[#0D0D12]">{subscription.subscribedOn}</TableCell>
              <TableCell className="text-[#0D0D12]">{subscription.renewalDate}</TableCell>
              <TableCell>
                <div className="flex items-center gap-2">
                  <button className="p-1.5 hover:bg-gray-100 rounded transition-colors">
                    <Eye className="h-4 w-4 text-[#00BFA6]" />
                  </button>
                  <button className="p-1.5 hover:bg-gray-100 rounded transition-colors">
                    <Trash2 className="h-4 w-4 text-[#DF1C41]" />
                  </button>
                </div>
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>

      {/* Pagination */}
      <div className="flex items-center justify-between px-6 py-4 border-t border-[#DFE1E7]">
        <p className="text-sm text-[#666D80]">
          Showing {mockSubscriptions.length} of {mockSubscriptions.length} subscriptions
        </p>

        <div className="flex items-center gap-2">
          <button className="px-3 py-1 border border-[#DFE1E7] rounded-lg text-sm hover:bg-gray-50 transition-colors">
            Previous
          </button>
          <button className="px-3 py-1 bg-[#301B69] text-white rounded-lg text-sm">
            1
          </button>
          <button className="px-3 py-1 border border-[#DFE1E7] rounded-lg text-sm hover:bg-gray-50 transition-colors">
            2
          </button>
          <button className="px-3 py-1 border border-[#DFE1E7] rounded-lg text-sm hover:bg-gray-50 transition-colors">
            3
          </button>
          <button className="px-3 py-1 border border-[#DFE1E7] rounded-lg text-sm hover:bg-gray-50 transition-colors">
            Next
          </button>
        </div>
      </div>
    </div>
  )
}
