import { createClient } from '@/lib/supabase'

export const supabase = createClient()

export function isCustomer(role: string | null | undefined) {
  return role === 'customer'
}
export function isSitter(role: string | null | undefined) {
  return role === 'sitter'
}
export function isAdmin(role: string | null | undefined) {
  return role === 'admin'
}
