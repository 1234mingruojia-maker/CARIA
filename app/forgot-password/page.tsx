'use client'
import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { validateEmail } from '@/lib/auth'
import { supabase } from '@/lib/supabase'

const inputStyle = {
  width: '100%',
  padding: '0.65rem 1rem',
  borderRadius: '10px',
  border: '1px solid #d6cfc8',
  background: '#faf7f4',
  fontSize: '0.9rem',
  fontFamily: "'Noto Sans Thai', sans-serif",
  outline: 'none',
  color: '#2c2927',
}

export default function ForgotPasswordPage() {
  const router = useRouter()
  const [email, setEmail] = useState('')
  const [error, setError] = useState('')
  const [loading, setLoading] = useState(false)

  async function handleSubmit() {
    setError('')
    const emailErr = validateEmail(email)
    if (emailErr) return setError(emailErr)

    setLoading(true)
    const { error: otpError } = await supabase.auth.signInWithOtp({
      email,
      options: { shouldCreateUser: false },
    })
    setLoading(false)

    if (otpError) return setError('ไม่พบบัญชีนี้ในระบบ')

    // ส่งต่อไปหน้า OTP พร้อม email
    router.push(`/forgot-password/verify?email=${encodeURIComponent(email)}`)
  }

  return (
    <main style={{ minHeight: '100vh', background: '#f5f0eb', display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', padding: '1.5rem', fontFamily: "'Noto Sans Thai', sans-serif" }}>
      <div style={{ position: 'fixed', top: '1rem', left: '50%', transform: 'translateX(-50%)', background: '#2c2927', borderRadius: '999px', padding: '0.4rem 1.5rem', fontFamily: "'Caveat', cursive", fontSize: '1rem', color: '#f5f0eb', zIndex: 10 }}>CARIA↗</div>

      <div style={{ background: '#faf7f4', borderRadius: '20px', padding: '2.5rem 2rem', width: '100%', maxWidth: 380, boxShadow: '0 4px 20px rgba(44,41,39,0.08)' }}>
        <h1 style={{ fontFamily: "'Caveat', cursive", fontSize: '2rem', textAlign: 'center', marginBottom: '1.75rem', color: '#2c2927' }}>Forgot Password</h1>

        <div style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem' }}>
          <input
            style={inputStyle}
            placeholder="Email"
            type="email"
            value={email}
            onChange={e => setEmail(e.target.value)}
            onKeyDown={e => e.key === 'Enter' && handleSubmit()}
          />

          {error && <p style={{ color: '#e05c5c', fontSize: '0.8rem', textAlign: 'center' }}>{error}</p>}

          <button
            onClick={handleSubmit}
            disabled={loading}
            style={{ background: '#2c2927', color: '#f5f0eb', border: 'none', borderRadius: '999px', padding: '0.65rem', cursor: loading ? 'default' : 'pointer', fontFamily: "'Caveat', cursive", fontSize: '1.1rem', opacity: loading ? 0.6 : 1, marginTop: '0.5rem' }}
          >{loading ? 'กำลังส่ง OTP...' : 'Enter'}</button>

          <p style={{ textAlign: 'center', fontSize: '0.78rem', color: '#8a7f78', cursor: 'pointer', marginTop: '0.25rem' }} onClick={() => router.push('/login')}>
            กลับไป <span style={{ color: '#3a5ca8' }}>เข้าสู่ระบบ</span>
          </p>
        </div>
      </div>
    </main>
  )
}