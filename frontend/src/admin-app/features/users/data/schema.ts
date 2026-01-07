import { z } from 'zod'

const userStatusSchema = z.union([
  z.literal('active'),
  z.literal('inactive'),
  z.literal('invited'),
  z.literal('suspended'),
])
export type UserStatus = z.infer<typeof userStatusSchema>

const userRoleSchema = z.union([
  z.literal('ADMIN'),
  z.literal('CREATOR'),
  z.literal('DONOR'),
])

const userSchema = z.object({
  id: z.string(),
  account_no: z.string(),
  email: z.string(),
  full_name: z.string().optional(),
  phone_number: z.string().optional(),
  role: z.array(userRoleSchema),
  is_verified: z.boolean().optional(),
  status: userStatusSchema.optional(),
  created_at: z.coerce.date(),
  updated_at: z.coerce.date(),
  // Legacy fields for backward compatibility with UI
  firstName: z.string().optional(),
  lastName: z.string().optional(),
  username: z.string().optional(),
  phoneNumber: z.string().optional(),
  createdAt: z.coerce.date().optional(),
  updatedAt: z.coerce.date().optional(),
})
export type User = z.infer<typeof userSchema>

export const userListSchema = z.array(userSchema)
