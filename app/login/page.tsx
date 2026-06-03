'use client'
import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { validateEmail, signIn } from '@/lib/auth'

const inputStyle = {
  width: '100%',
  padding: '0.65rem 1rem',
  borderRadius: '10px',
  border: '1px solid var(--light)',
  background: 'var(--card)',
  fontSize: '0.9rem',
  fontFamily: 'var(--font-body)',
  outline: 'none',
  color: 'var(--dark)',
} as React.CSSProperties

function EyeIcon({ open }: { open: boolean }) {
  return open ? (
    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <path d="M17.94 17.94A10.07 10.07 0 0 1 12 20c-7 0-11-8-11-8a18.45 18.45 0 0 1 5.06-5.94"/>
      <path d="M9.9 4.24A9.12 9.12 0 0 1 12 4c7 0 11 8 11 8a18.5 18.5 0 0 1-2.16 3.19"/>
      <line x1="1" y1="1" x2="23" y2="23"/>
    </svg>
  ) : (
    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z"/>
      <circle cx="12" cy="12" r="3"/>
    </svg>
  )
}

export default function LoginPage() {
  const router = useRouter()
  const [email, setEmail]       = useState('')
  const [password, setPassword] = useState('')
  const [showPw, setShowPw]     = useState(false)
  const [error, setError]       = useState('')
  const [loading, setLoading]   = useState(false)

  async function handleLogin() {
    setError('')
    const emailErr = validateEmail(email)
    if (emailErr) return setError(emailErr)
    if (!password) return setError('กรุณากรอกรหัสผ่าน')
    setLoading(true)
    const { error: signInError } = await signIn(email, password)
    setLoading(false)
    if (signInError) {
      if (signInError.message.includes('Invalid login')) return setError('อีเมลหรือรหัสผ่านไม่ถูกต้อง')
      if (signInError.message.includes('Email not confirmed')) return setError('กรุณายืนยันอีเมลก่อนเข้าใช้งาน')
      return setError(signInError.message)
    }
    router.push('/')
  }

  return (
    <main style={{ minHeight: '100vh', background: 'var(--bg)', display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', padding: '1.5rem', fontFamily: 'var(--font-body)' }}>
      <style>{`input[type="password"]::-ms-reveal,input[type="password"]::-ms-clear,input::-webkit-credentials-auto-fill-button,input::-webkit-strong-password-auto-fill-button{display:none!important}`}</style>

      

      <div style={{ background: 'var(--card)', borderRadius: '20px', padding: '2rem', width: '100%', maxWidth: 400, boxShadow: '0 4px 20px rgba(44,41,39,0.08)' }}>
        <h1 style={{ fontFamily: 'var(--font-hand)', fontSize: '2rem', textAlign: 'center', marginBottom: '1.5rem', color: 'var(--dark)' }}>Login</h1>
        <div style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem' }}>
          <input style={inputStyle} placeholder="Email" value={email} onChange={e => setEmail(e.target.value)} type="email"/>
          <div style={{ position: 'relative' }}>
            <input style={{ ...inputStyle, paddingRight: '2.5rem' }} placeholder="Password" value={password} onChange={e => setPassword(e.target.value)} type={showPw ? 'text' : 'password'} autoComplete="current-password"/>
            <button onClick={() => setShowPw(!showPw)} style={{ position: 'absolute', right: 10, top: '50%', transform: 'translateY(-50%)', background: 'none', border: 'none', cursor: 'pointer', color: 'var(--mid)', display: 'flex', alignItems: 'center', padding: 0 }}>
              <EyeIcon open={showPw}/>
            </button>
          </div>
          <p style={{ textAlign: 'right', fontSize: '0.75rem', color: 'var(--accent-dt)', cursor: 'pointer', margin: 0 }} onClick={() => router.push('/forgot-password')}>ลืมรหัสผ่าน?</p>
          {error && <p style={{ color: '#e05c5c', fontSize: '0.8rem', textAlign: 'center' }}>{error}</p>}
          <button
  onClick={handleLogin}
  disabled={loading}
  style={{
    background: '#F0DC62',
    color: '#2c2927',
    border: 'none',
    borderRadius: '999px',
    padding: '0.65rem',
    cursor: loading ? 'default' : 'pointer',
    fontFamily: 'var(--font-hand)',
    fontSize: '1.1rem',
    opacity: loading ? 0.6 : 1,
    marginTop: '0.5rem'
  }}
>
  {loading ? 'กำลังเข้าสู่ระบบ...' : 'Enter'}
</button>
          <p style={{ textAlign: 'center', fontSize: '0.78rem', color: 'var(--mid)', cursor: 'pointer' }} onClick={() => router.push('/register')}>
            ยังไม่มีบัญชี? <span style={{ color: 'var(--accent-dt)' }}>สมัครสมาชิก</span>
          </p>
        </div>
      </div>
    </main>
  )
}