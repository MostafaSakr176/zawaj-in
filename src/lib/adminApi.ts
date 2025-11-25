import api from "./axiosClient"

// Types
export interface AdminUser {
  id: string
  fullName: string
  email: string
  phone: string
  gender: string
  chartNumber: string
  isEmailVerified: boolean
  isPhoneVerified: boolean
  isActive: boolean
  isBanned: boolean
  isVerified: boolean
  isDeleted: boolean
  role: string
  createdAt: string
  updatedAt: string
  dateOfBirth: string | null
  age: number | null
  location: { city: string; country: string } | null
  nationality: string | null
  placeOfResidence: string | null
  maritalStatus: string | null
  profession: string | null
  educationLevel: string | null
  height: string | null
  weight: string | null
  skinColor: string | null
  hairType: string | null
  hairColor: string | null
  eyeColor: string | null
  bio: string | null
  partnerPreferencesBio: string | null
  banType: string | null
  bannedAt: string | null
  bannedUntil: string | null
  bannedReason: string | null
  verifiedAt: string | null
}

export interface GetUsersParams {
  page?: number
  limit?: number
  search?: string
  role?: string
  isBanned?: boolean
  isVerified?: boolean
}

export interface GetUsersResponse {
  success: boolean
  data: {
    users: AdminUser[]
    total: number
    page: number
    totalPages: number
  }
}

export interface BanUserData {
  banType: "temporary" | "permanent"
  reason: string
  bannedUntil?: string // ISO date string for temporary bans
}

export interface UpdateUserData {
  fullName?: string
  isActive?: boolean
  isEmailVerified?: boolean
  isPhoneVerified?: boolean
  // Add other editable fields as needed
}

export interface SendNotificationData {
  subject: string
  message: string
  notificationType?: "push" | "email"
}

export interface ActivityLog {
  id: string
  action: string
  details: string
  createdAt: string
  performedBy: string
}

// API Functions

/**
 * Get all users with optional filters
 */
export async function getUsers(): Promise<GetUsersResponse> {
  const response = await api.get("/admin/users")
  return response.data
}

/**
 * Get all users for stats (with high limit for counting)
 */
export interface UserForStats {
  id: string
  fullName: string
  email: string
  gender: "male" | "female" | string
  createdAt: string
  isOnline: boolean
}

export interface GetUsersForStatsResponse {
  success: boolean
  message: string
  data: {
    users: UserForStats[]
    pagination: {
      total: number
      page: number
      limit: number
      totalPages: number
    }
  }
}

export async function getUsersForStats(): Promise<GetUsersForStatsResponse> {
  const response = await api.get("/users?limit=2000")
  return response.data
}

/**
 * Get a single user by ID
 */
export async function getUserById(userId: string): Promise<{ success: boolean; data: AdminUser }> {
  const response = await api.get(`/admin/users/${userId}`)
  return response.data
}

/**
 * Update user data
 */
export async function updateUser(userId: string, data: UpdateUserData): Promise<{ success: boolean; message: string }> {
  const response = await api.put(`/admin/users/${userId}`, data)
  return response.data
}

/**
 * Ban a user (temporary or permanent)
 */
export async function banUser(userId: string, data: BanUserData): Promise<{ success: boolean; message: string }> {
  const response = await api.post(`/admin/users/${userId}/ban`, data)
  return response.data
}

/**
 * Unban a user
 */
export async function unbanUser(userId: string): Promise<{ success: boolean; message: string }> {
  const response = await api.post(`/admin/users/${userId}/unban`)
  return response.data
}

/**
 * Soft delete a user
 */
export async function deleteUser(userId: string): Promise<{ success: boolean; message: string }> {
  const response = await api.delete(`/admin/users/${userId}`)
  return response.data
}

/**
 * Verify a user's profile
 */
export async function verifyUser(userId: string): Promise<{ success: boolean; message: string }> {
  const response = await api.post(`/admin/users/${userId}/verify`)
  return response.data
}

/**
 * Send notification to a user
 */
export async function sendNotification(userId: string, data: SendNotificationData): Promise<{ success: boolean; message: string }> {
  const response = await api.post(`/admin/users/${userId}/send-notification`, data)
  return response.data
}

/**
 * Send email to a user
 */
export async function sendEmail(userId: string, data: SendNotificationData): Promise<{ success: boolean; message: string }> {
  const response = await api.post(`/admin/users/${userId}/send-email`, data)
  return response.data
}

/**
 * Get user activity logs
 */
export async function getUserActivityLogs(
  userId: string,
  page: number = 1,
  limit: number = 50
): Promise<{ success: boolean; data: { logs: ActivityLog[]; total: number } }> {
  const response = await api.get(`/admin/users/${userId}/activity-logs`, {
    params: { page, limit }
  })
  return response.data
}

// ==================== Admin Role Management ====================

export interface Admin {
  id: string
  fullName: string
  email: string
  phone: string
  gender: string
  role: "admin" | "super_admin"
  permissions: string[]
  isActive: boolean
  createdAt: string
  updatedAt: string
}

export interface GetAdminsParams {
  page?: number
  limit?: number
}

export interface GetAdminsResponse {
  success: boolean
  data: {
    admins: Admin[]
    total: number
    page: number
    totalPages: number
  }
}

export interface CreateAdminData {
  fullName: string
  email: string
  phone: string
  gender: string
  password: string
  permissions: string[]
}

export interface UpdateAdminRolesData {
  permissions: string[]
}

// Available permissions
export const ADMIN_PERMISSIONS = [
  { key: "manage_users", label: "Manage Users", description: "View, edit, ban, and delete users" },
  { key: "manage_reports", label: "Manage Reports", description: "View and resolve user reports" },
  { key: "view_analytics", label: "View Analytics", description: "Access dashboard analytics and statistics" },
  { key: "send_notifications", label: "Send Notifications", description: "Send notifications to users" },
  { key: "manage_content", label: "Manage Content", description: "Manage app content and settings" },
  { key: "manage_subscriptions", label: "Manage Subscriptions", description: "View and manage user subscriptions" },
] as const

/**
 * Get all admin users
 */
export async function getAdmins(): Promise<GetAdminsResponse> {
  const response = await api.get("/admin/admins")
  return response.data
}

/**
 * Create a new admin user
 */
export async function createAdmin(data: CreateAdminData): Promise<{ success: boolean; data: Admin; message: string }> {
  const response = await api.post("/admin/admins", data)
  return response.data
}

/**
 * Update admin roles/permissions
 */
export async function updateAdminRoles(
  adminId: string,
  data: UpdateAdminRolesData
): Promise<{ success: boolean; message: string }> {
  const response = await api.put(`/admin/admins/${adminId}/roles`, data)
  return response.data
}

/**
 * Promote admin to super admin
 */
export async function promoteToSuperAdmin(adminId: string): Promise<{ success: boolean; message: string }> {
  const response = await api.put(`/admin/admins/${adminId}/promote`)
  return response.data
}

/**
 * Demote super admin to regular admin
 */
export async function demoteToAdmin(adminId: string): Promise<{ success: boolean; message: string }> {
  const response = await api.put(`/admin/admins/${adminId}/demote`)
  return response.data
}

/**
 * Remove admin privileges (delete admin)
 */
export async function removeAdmin(adminId: string): Promise<{ success: boolean; message: string }> {
  const response = await api.delete(`/admin/admins/${adminId}`)
  return response.data
}

// ==================== Subscription Plans Management ====================

export interface SubscriptionPlan {
  id: string
  name: string
  priceMonthly: number
  priceYearly: number
  features: string[]
  maxLikesPerDay: number | null // null means unlimited
  canSendMessages: boolean
  canViewLikes: boolean
  canSeeWhoLikedYou: boolean
  prioritySupport: boolean
  profileBadge: string | null
  displayOrder: number
  isActive: boolean
  createdAt: string
  updatedAt: string
}

export interface GetPlansResponse {
  success: boolean
  data: SubscriptionPlan[]
}

export interface CreatePlanData {
  name: string
  priceMonthly: number
  priceYearly: number
  features: string[]
  maxLikesPerDay: number | null
  canSendMessages: boolean
  canViewLikes: boolean
  canSeeWhoLikedYou: boolean
  prioritySupport: boolean
  profileBadge: string | null
  displayOrder: number
}

export interface UpdatePlanData extends Partial<CreatePlanData> {}

/**
 * Get all subscription plans
 */
export async function getPlans(): Promise<GetPlansResponse> {
  const response = await api.get("/admin/subscriptions/plans")
  return response.data
}

/**
 * Create a new subscription plan
 */
export async function createPlan(data: CreatePlanData): Promise<{ success: boolean; data: SubscriptionPlan; message: string }> {
  const response = await api.post("/admin/subscriptions/plans", data)
  return response.data
}

/**
 * Update a subscription plan
 */
export async function updatePlan(planId: string, data: UpdatePlanData): Promise<{ success: boolean; data: SubscriptionPlan; message: string }> {
  const response = await api.put(`/admin/subscriptions/plans/${planId}`, data)
  return response.data
}

/**
 * Deactivate/Delete a subscription plan
 */
export async function deletePlan(planId: string): Promise<{ success: boolean; message: string }> {
  const response = await api.delete(`/admin/subscriptions/plans/${planId}`)
  return response.data
}

// ==================== Chat Management ====================

export interface ChatParticipant {
  id: string
  fullName: string
  email?: string
  avatar?: string
  isOnline?: boolean
  subscriptionPlan?: string
}

export interface ChatMessage {
  id: string
  conversationId: string
  senderId: string
  content: string
  messageType: "text" | "audio" | "image" // API uses messageType
  type?: "text" | "audio" | "image" // For backwards compatibility
  isDeleted: boolean
  isReported?: boolean
  createdAt: string
  updatedAt: string
  audioDuration?: number // For audio messages (in seconds)
  fileUrl?: string // For audio/image messages
  status?: "sent" | "delivered" | "read"
  sender?: ChatParticipant
}

export interface Conversation {
  id: string
  participant1Id: string
  participant2Id: string
  participant1?: ChatParticipant
  participant2?: ChatParticipant
  lastMessage?: string
  lastMessagePreview?: string // API uses this field
  lastMessageAt?: string
  messageCount?: number
  reportCount?: number
  isActive?: boolean
  isClosed?: boolean
  matchId?: string | null
  createdAt: string
  updatedAt: string
}

export interface GetConversationsParams {
  page?: number
  limit?: number
  search?: string
  startDate?: string
  endDate?: string
  isReported?: boolean
  status?: "active" | "closed" | "reported"
}

export interface GetConversationsResponse {
  success: boolean
  message?: string
  data: {
    conversations: Conversation[]
    pagination: {
      total: number
      page: number
      limit: number
      totalPages: number
    }
  }
}

export interface GetConversationResponse {
  success: boolean
  message?: string
  // API returns conversation data directly in data (not data.conversation)
  data: Conversation & {
    messages: ChatMessage[]
    reports?: Array<{
      id: string
      reason: string
      reporterId: string
      createdAt: string
    }>
  }
}

export interface GetMessagesParams {
  page?: number
  limit?: number
}

export interface GetMessagesResponse {
  success: boolean
  message?: string
  data: {
    messages: ChatMessage[]
    pagination: {
      total: number
      page: number
      limit: number
      totalPages: number
    }
  }
}

export interface ChatStatistics {
  totalConversations: number
  activeConversations: number
  totalMessages: number
  deletedMessages: number
  reportedConversations: number
}

export interface GetChatStatisticsResponse {
  success: boolean
  message?: string
  data: ChatStatistics
}

export interface SearchMessagesParams {
  query: string
  page?: number
  limit?: number
}

export interface SearchMessagesResponse {
  success: boolean
  message?: string
  data: {
    messages: (ChatMessage & { conversation?: Conversation })[]
    pagination: {
      total: number
      page: number
      limit: number
      totalPages: number
    }
  }
}

export interface CloseConversationData {
  reason?: string
}

export interface DeleteMessageData {
  reason?: string
}

/**
 * Get all conversations with optional filters
 */
export async function getConversations(
  params?: GetConversationsParams
): Promise<GetConversationsResponse> {
  const response = await api.get("/admin/chats/conversations", { params })
  return response.data
}

/**
 * Get reported conversations only
 */
export async function getReportedConversations(
  params?: { page?: number; limit?: number }
): Promise<GetConversationsResponse> {
  const response = await api.get("/admin/chats/conversations/reported", { params })
  return response.data
}

/**
 * Get a single conversation by ID with all messages
 */
export async function getConversationById(
  conversationId: string
): Promise<GetConversationResponse> {
  const response = await api.get(`/admin/chats/conversations/${conversationId}`)
  return response.data
}

/**
 * Get messages from a conversation (paginated)
 */
export async function getConversationMessages(
  conversationId: string,
  params?: GetMessagesParams
): Promise<GetMessagesResponse> {
  const response = await api.get(`/admin/chats/conversations/${conversationId}/messages`, { params })
  return response.data
}

/**
 * Delete a specific message
 */
export async function deleteMessage(
  messageId: string,
  data?: DeleteMessageData
): Promise<{ success: boolean; message: string }> {
  const response = await api.delete(`/admin/chats/messages/${messageId}`, { data })
  return response.data
}

/**
 * Close/delete a conversation
 */
export async function closeConversation(
  conversationId: string,
  data?: CloseConversationData
): Promise<{ success: boolean; message: string }> {
  const response = await api.delete(`/admin/chats/conversations/${conversationId}`, { data })
  return response.data
}

/**
 * Get chat statistics overview
 */
export async function getChatStatistics(): Promise<GetChatStatisticsResponse> {
  const response = await api.get("/admin/chats/statistics")
  return response.data
}

/**
 * Search messages across all conversations
 */
export async function searchMessages(
  params: SearchMessagesParams
): Promise<SearchMessagesResponse> {
  const response = await api.get("/admin/chats/messages/search", { params })
  return response.data
}

// ==================== System Settings Management ====================

export interface SystemSetting {
  id: string
  key: string
  valueEn: string
  valueAr: string
  type: "text" | "html" | "json" | "boolean" | "number"
  description: string | null
  isActive: boolean
  createdAt: string
  updatedAt: string
}

export interface CreateSystemSettingData {
  key: string
  valueEn: string
  valueAr: string
  type: "text" | "html" | "json" | "boolean" | "number"
  description?: string
}

export interface UpdateSystemSettingData {
  valueEn?: string
  valueAr?: string
  type?: "text" | "html" | "json" | "boolean" | "number"
  description?: string
  isActive?: boolean
}

export interface GetSettingsResponse {
  success: boolean
  message?: string
  data: SystemSetting[]
}

export interface GetSettingResponse {
  success: boolean
  message?: string
  data: SystemSetting
}

/**
 * Get all system settings (admin)
 */
export async function getSystemSettings(): Promise<GetSettingsResponse> {
  const response = await api.get("/admin/settings")
  return response.data
}

/**
 * Get a specific system setting by key (admin)
 */
export async function getSystemSettingByKey(key: string): Promise<GetSettingResponse> {
  const response = await api.get(`/admin/settings/${key}`)
  return response.data
}

/**
 * Create a new system setting
 */
export async function createSystemSetting(
  data: CreateSystemSettingData
): Promise<{ success: boolean; data: SystemSetting; message: string }> {
  const response = await api.post("/admin/settings", data)
  return response.data
}

/**
 * Update a system setting by key
 */
export async function updateSystemSetting(
  key: string,
  data: UpdateSystemSettingData
): Promise<{ success: boolean; data: SystemSetting; message: string }> {
  const response = await api.put(`/admin/settings/${key}`, data)
  return response.data
}

/**
 * Delete a system setting
 */
export async function deleteSystemSetting(
  key: string
): Promise<{ success: boolean; message: string }> {
  const response = await api.delete(`/admin/settings/${key}`)
  return response.data
}

/**
 * Initialize default system settings
 */
export async function initializeDefaultSettings(): Promise<{ success: boolean; message: string; data?: SystemSetting[] }> {
  const response = await api.post("/admin/settings/initialize")
  return response.data
}

// ==================== Analytics - Country Heatmap ====================

export interface CityData {
  name: string
  users: string
}

export interface CountryHeatmapData {
  name: string
  users: string
  coordinates: [number, number]
  color: string
  flag: string
  cities: CityData[]
}

export interface GetVisitorsByCountryParams {
  region?: "all" | "middle_east" | "europe" | "asia" | "africa" | "americas"
  period?: "all" | "week" | "month" | "year"
}

export interface GetVisitorsByCountryResponse {
  success: boolean
  data: {
    countries: CountryHeatmapData[]
  }
}

export interface TopCountryData {
  rank: number
  country: string
  flag: string
  users: number
  percentage: number
  growth: number
  revenue: number
}

export interface GetTopCountriesResponse {
  success: boolean
  data: {
    countries: TopCountryData[]
    totalUsers: number
    totalRevenue: number
  }
}

/**
 * Get visitors by country for map visualization (heatmap)
 */
export async function getVisitorsByCountry(
  params?: GetVisitorsByCountryParams
): Promise<GetVisitorsByCountryResponse> {
  const response = await api.get("/admin/analytics/visitors-by-country", { params })
  return response.data
}

/**
 * Get top countries ranked by user count
 */
export async function getTopCountries(): Promise<GetTopCountriesResponse> {
  const response = await api.get("/admin/analytics/top-countries")
  return response.data
}
