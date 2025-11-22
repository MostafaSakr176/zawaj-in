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
