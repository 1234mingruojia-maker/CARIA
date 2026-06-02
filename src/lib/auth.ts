import { supabase } from './supabase'

export function validateEmail(email: string): string | null {
  if (!email.includes('@') || !email.includes('.')) {
    return 'กรุณากรอกอีเมลให้ถูกต้อง'
  }
  return null
}
// validate password
export function validatePassword(password: string): string | null {
  if (password.length < 12 || password.length > 16) {
    return 'รหัสผ่านต้องมี 12–16 ตัวอักษร'
  }
  if (!/[A-Z]/.test(password)) return 'ต้องมีตัวพิมพ์ใหญ่ (A-Z) อย่างน้อย 1 ตัว'
  if (!/[a-z]/.test(password)) return 'ต้องมีตัวพิมพ์เล็ก (a-z) อย่างน้อย 1 ตัว'
  if (!/[0-9]/.test(password)) return 'ต้องมีตัวเลข (0-9) อย่างน้อย 1 ตัว'
  if (!/[!@#$%^&*]/.test(password)) return 'ต้องมีสัญลักษณ์พิเศษ (!@#$%^&*) อย่างน้อย 1 ตัว'
  return null
}

// password strength 0-4
export function passwordStrength(password: string): number {
  let score = 0
  if (password.length >= 12) score++
  if (/[A-Z]/.test(password)) score++
  if (/[a-z]/.test(password)) score++
  if (/[0-9]/.test(password)) score++
  if (/[!@#$%^&*]/.test(password)) score++
  return score
}

export async function signUp(
  email: string,
  password: string,
  username: string
) {
  const { data, error } = await supabase.auth.signUp({
    email,
    password,
    options: {
      data: { username },
      emailRedirectTo: undefined,
    },
  })
  return { data, error }
}

export async function verifyOtp(email: string, token: string) {
  const { data, error } = await supabase.auth.verifyOtp({
    email,
    token,
    type: 'signup',
  })
  return { data, error }
}

export async function signIn(email: string, password: string) {
  const { data, error } = await supabase.auth.signInWithPassword({
    email,
    password,
  })
  return { data, error }
}

export async function signOut() {
  await supabase.auth.signOut()
}

export async function saveProfile(userId: string, profile: {
  username: string
  gender: string
  age: number
  gpax: number
  major: string
  preferred_sector: string
}) {
  const { error } = await supabase
    .from('profiles')
    .upsert({ id: userId, ...profile })
  return { error }
}