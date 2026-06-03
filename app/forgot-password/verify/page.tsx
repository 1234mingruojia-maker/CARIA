'use client'
import { useState, Suspense } from 'react'
import { useRouter, useSearchParams } from 'next/navigation'
import { supabase } from '@/lib/supabase'

function VerifyContent() {
  const router = useRouter()
  const searchParams = useSearchParams()
  const email = searchParams.get('email') || ''
  const [otp, setOtp]         = useState(['', '', '', '', '', ''])
  const [error, setError]     = useState('')
  const [loading, setLoading] = useState(false)

  function handleOtpInput(val: string, idx: number) {
    const newOtp = [...otp]
    newOtp[idx] = val.slice(-1)
    setOtp(newOtp)
    if (val && idx < 5) document.getElementById(`otp-${idx + 1}`)?.focus()
  }

  async function handleSubmit() {
    const token = otp.join('')
    if (token.length < 6) return setError('กรุณากรอก OTP ให้ครบ 6 หลัก')
    setLoading(true)
    setError('')
    const { data, error: verifyError } = await supabase.auth.verifyOtp({ email, token, type: 'recovery' })
    setLoading(false)
    if (verifyError || !data.session) return setError('OTP ไม่ถูกต้องหรือหมดอายุ')
    router.push('/forgot-password/reset')
  }

  return (
    <main style={{ minHeight: '100vh', background: 'var(--bg)', display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', padding: '1.5rem', fontFamily: 'var(--font-body)' }}>
      
      <div style={{ background: '#c4a99a', borderRadius: '20px', padding: '2rem', width: '100%', maxWidth: 360, boxShadow: '0 4px 20px rgba(44,41,39,0.15)', textAlign: 'center' }}>
        <h2 style={{ fontFamily: 'var(--font-hand)', fontSize: '1.6rem', color: 'var(--dark)', marginBottom: '0.5rem' }}>OTP Verification</h2>
        <p style={{ fontSize: '0.8rem', color: '#5f3e30', marginBottom: '0.25rem' }}>Enter one-time password</p>
        <p style={{ fontSize: '0.75rem', color: '#5f3e30', marginBottom: '0.25rem' }}>a one-time password has been sent to</p>
        <p style={{ fontSize: '0.8rem', color: 'var(--dark)', fontWeight: 500, marginBottom: '0.25rem' }}>{email}</p>
        <p style={{ fontSize: '0.72rem', color: '#5f3e30', marginBottom: '1.5rem' }}>หมดอายุใน 10 นาที</p>
        <div style={{ display: 'flex', gap: '8px', justifyContent: 'center', marginBottom: '1rem' }}>
          {otp.map((v, i) => (
            <input key={i} id={`otp-${i}`} value={v} onChange={e => handleOtpInput(e.target.value, i)}
              onKeyDown={e => { if (e.key === 'Backspace' && !v && i > 0) document.getElementById(`otp-${i - 1}`)?.focus() }}
              maxLength={1}
              style={{ width: 42, height: 48, textAlign: 'center', borderRadius: 10, border: '1px solid rgba(44,41,39,0.2)', background: 'rgba(255,255,255,0.4)', fontSize: '1.2rem', fontFamily: 'var(--font-hand)', color: 'var(--dark)', outline: 'none' }}
            />
          ))}
        </div>
        {error && <p style={{ color: '#e05c5c', fontSize: '0.8rem', marginBottom: '0.75rem' }}>{error}</p>}
        <button
  onClick={handleSubmit}
  disabled={loading}
  style={{
    background: '#F0DC62',
    color: '#2c2927',
    border: 'none',
    borderRadius: '999px',
    padding: '0.6rem 2rem',
    cursor: loading ? 'default' : 'pointer',
    fontFamily: 'var(--font-hand)',
    fontSize: '1.1rem',
    opacity: loading ? 0.6 : 1
  }}
>
  {loading ? 'กำลังยืนยัน...' : 'Submit'}
</button>
      </div>
    </main>
  )
}

export default function VerifyPage() {
  return <Suspense><VerifyContent /></Suspense>
}