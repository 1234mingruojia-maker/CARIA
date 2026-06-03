'use client'
import { useState, useEffect, useRef, Suspense } from 'react'
import { useRouter, useSearchParams } from 'next/navigation'
import { validateEmail, validatePassword, passwordStrength } from '@/lib/auth'
import { supabase } from '@/lib/supabase'

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

const strengthColors = ['#e0dbd6', '#e05c5c', '#e09c3c', '#8ab8e0', '#4caf50']
const strengthLabels = ['', 'อ่อนมาก', 'อ่อน', 'ปานกลาง', 'แข็งแกร่ง', 'แข็งแกร่งมาก']

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

function RegisterInner() {
  const router = useRouter()
  const searchParams = useSearchParams()
  const initialStep = searchParams.get('step') === 'otp' ? 'otp' : 'account'
  const initialEmail = searchParams.get('email') ?? ''
  const [step, setStep] = useState<'account' | 'profile' | 'otp'>(initialStep)

  const [email, setEmail]       = useState(initialEmail)
  const [password, setPassword] = useState('')
  const [confirm, setConfirm]   = useState('')
  const [showPw, setShowPw]     = useState(false)
  const [agreed, setAgreed]     = useState(false)

  const [username, setUsername] = useState('')
  const [gender, setGender]     = useState('')
  const [age, setAge]           = useState('')
  const [gpax, setGpax]         = useState('')
  const [major, setMajor]       = useState('')
  const [sector, setSector]     = useState('')
  const [careers, setCareers]   = useState<{ id: string; name: string; sector: string }[]>([])

  const [otp, setOtp]           = useState(['', '', '', '', '', ''])
  const [otpError, setOtpError] = useState('')
  const [error, setError]       = useState('')
  const [loading, setLoading]   = useState(false)

  const pwStrength = passwordStrength(password)

  useEffect(() => {
    supabase.from('career_competency').select('id, name, sector').order('id')
      .then(({ data }) => { if (data) setCareers(data) })
  }, [])

  function handleStep1() {
    setError('')
    const emailErr = validateEmail(email)
    if (emailErr) return setError(emailErr)
    const pwErr = validatePassword(password)
    if (pwErr) return setError(pwErr)
    if (password !== confirm) return setError('รหัสผ่านไม่ตรงกัน')
    if (!agreed) return setError('กรุณายอมรับข้อตกลง')
    setStep('profile')
  }

  async function handleStep2() {
    setError('')
    if (!username || !gender || !age || !gpax || !major || !sector)
      return setError('กรุณากรอกข้อมูลให้ครบ')
    setLoading(true)
    try {
      const selectedCareer = careers.find(c => c.id === sector)
      const res = await fetch('/api/checkout', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          email, password, username, gender,
          age: Number(age), gpax: Number(gpax), major,
          preferred_sector: selectedCareer?.sector ?? sector,
        }),
      })
      const result = await res.json()
      if (!res.ok) throw new Error(result.error || 'เกิดข้อผิดพลาด')
      if (result.url) window.location.href = result.url
    } catch (err: any) {
      setError(err.message || 'ระบบขัดข้อง กรุณาลองใหม่')
      setLoading(false)
    }
  }

  async function handleOtp() {
    const token = otp.join('')
    if (token.length < 6) return setOtpError('กรุณากรอก OTP ให้ครบ 6 หลัก')
    setLoading(true)
    setOtpError('')
    const { verifyOtp } = await import('@/lib/auth')
    const { data, error: otpErr } = await verifyOtp(email, token)
    if (otpErr || !data.user) {
      setLoading(false)
      return setOtpError('OTP ไม่ถูกต้องหรือหมดอายุ')
    }
    router.push('/dashboard')
  }

  function handleOtpInput(val: string, idx: number) {
    const newOtp = [...otp]
    newOtp[idx] = val.slice(-1)
    setOtp(newOtp)
    if (val && idx < 5) document.getElementById(`otp-${idx + 1}`)?.focus()
  }

  

  return (
    <main style={{ minHeight: '100vh', background: 'var(--bg)', display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', padding: '1.5rem', fontFamily: 'var(--font-body)' }}>
      <style>{`input[type="password"]::-ms-reveal,input[type="password"]::-ms-clear{display:none!important}`}</style>
      

      {/* ── STEP 1 ── */}
      {step === 'account' && (
        <div style={{ background: 'var(--card)', borderRadius: '20px', padding: '2rem', width: '100%', maxWidth: 400, boxShadow: '0 4px 20px rgba(44,41,39,0.08)' }}>
          <h1 style={{ fontFamily: 'var(--font-hand)', fontSize: '2rem', textAlign: 'center', marginBottom: '0.25rem', color: 'var(--dark)' }}>Register</h1>
          <p style={{ textAlign: 'center', fontSize: '0.75rem', color: 'var(--accent-dt)', marginBottom: '1.5rem', cursor: 'pointer' }} onClick={() => router.push('/login')}>
            มีบัญชีอยู่แล้ว?
          </p>
          <div style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem' }}>
            <input style={inputStyle} placeholder="Email" value={email} onChange={e => setEmail(e.target.value)} type="email"/>
            <div style={{ position: 'relative' }}>
              <input style={{ ...inputStyle, paddingRight: '2.5rem' }} placeholder="Password" value={password} onChange={e => setPassword(e.target.value)} type={showPw ? 'text' : 'password'} autoComplete="new-password"/>
              <button onClick={() => setShowPw(!showPw)} style={{ position: 'absolute', right: 10, top: '50%', transform: 'translateY(-50%)', background: 'none', border: 'none', cursor: 'pointer', color: 'var(--mid)', display: 'flex', alignItems: 'center', padding: 0 }}>
                <EyeIcon open={showPw}/>
              </button>
            </div>
            {password && (
              <div>
                <div style={{ display: 'flex', gap: 4, marginBottom: 4 }}>
                  {[1,2,3,4,5].map(i => (
                    <div key={i} style={{ flex: 1, height: 4, borderRadius: 2, background: i <= pwStrength ? strengthColors[pwStrength] : '#e0dbd6', transition: 'background 0.2s' }}/>
                  ))}
                </div>
                <p style={{ fontSize: '0.7rem', color: strengthColors[pwStrength] }}>{strengthLabels[pwStrength]}</p>
              </div>
            )}
            <div style={{ background: '#f0ebe6', borderRadius: 10, padding: '0.75rem 1rem', fontSize: '0.72rem', color: '#5f5e5a', lineHeight: 1.8 }}>
              <p style={{ fontWeight: 500, marginBottom: 4 }}>รหัสผ่านต้องประกอบด้วย</p>
              {[
                { rule: /^.{12,16}$/, label: '12–16 ตัวอักษร' },
                { rule: /[A-Z]/,      label: 'ตัวพิมพ์ใหญ่ (A-Z)' },
                { rule: /[a-z]/,      label: 'ตัวพิมพ์เล็ก (a-z)' },
                { rule: /[0-9]/,      label: 'ตัวเลข (0-9)' },
                { rule: /[!@#$%^&*]/, label: 'สัญลักษณ์พิเศษ (!@#$%^&*)' },
              ].map(({ rule, label }) => (
                <div key={label} style={{ display: 'flex', gap: 6, alignItems: 'center' }}>
                  <span style={{ color: rule.test(password) ? '#4caf50' : '#c0b8b0' }}>{rule.test(password) ? '✓' : '○'}</span>
                  <span style={{ color: rule.test(password) ? 'var(--dark)' : '#a09890' }}>{label}</span>
                </div>
              ))}
            </div>
            <input style={{ ...inputStyle, paddingRight: '2.5rem' }} placeholder="Confirm Password" value={confirm} onChange={e => setConfirm(e.target.value)} type="password" autoComplete="new-password"/>
            <label style={{ display: 'flex', gap: 8, alignItems: 'flex-start', fontSize: '0.75rem', color: '#5f5e5a', cursor: 'pointer' }}>
              <input type="checkbox" checked={agreed} onChange={e => setAgreed(e.target.checked)} style={{ marginTop: 2 }}/>
              ยอมรับ <span style={{ color: 'var(--accent-dt)' }}>ข้อกำหนดการใช้งาน</span> และ <span style={{ color: 'var(--accent-dt)' }}>นโยบายความเป็นส่วนตัว</span>
            </label>
            {error && <p style={{ color: '#e05c5c', fontSize: '0.8rem', textAlign: 'center' }}>{error}</p>}
          <button
  onClick={handleStep1}
  style={{
    background: '#F0DC62',
    color: '#2c2927',
    border: 'none',
    borderRadius: '999px',
    padding: '0.65rem',
    fontSize: '0.95rem',
    cursor: 'pointer',
    fontFamily: 'var(--font-hand)',
    marginTop: '0.5rem'
  }}
>
  Next
</button>
          </div>
        </div>
      )}

      {/* ── STEP 2 ── */}
      {step === 'profile' && (
        <div style={{ background: 'var(--card)', borderRadius: '20px', padding: '2rem', width: '100%', maxWidth: 400, boxShadow: '0 4px 20px rgba(44,41,39,0.08)' }}>
          <h1 style={{ fontFamily: 'var(--font-hand)', fontSize: '2rem', textAlign: 'center', marginBottom: '1.5rem', color: 'var(--dark)' }}>Register</h1>
          <div style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem' }}>
            <input style={inputStyle} placeholder="ชื่อผู้ใช้งาน" value={username} onChange={e => setUsername(e.target.value)}/>
            <div style={{ display: 'flex', gap: '0.5rem' }}>
              <select style={{ ...inputStyle, flex: 1 }} value={gender} onChange={e => setGender(e.target.value)}>
                <option value="">เพศ</option>
                <option>ชาย</option><option>หญิง</option><option>ไม่ระบุ</option>
              </select>
              <input style={{ ...inputStyle, flex: 1 }} placeholder="อายุ" type="number" value={age} onChange={e => setAge(e.target.value)}/>
            </div>
            <input style={inputStyle} placeholder="เกรด (GPAX)" type="number" step="0.01" min="0" max="4" value={gpax} onChange={e => setGpax(e.target.value)}/>
            <input style={inputStyle} placeholder="สาขา" value={major} onChange={e => setMajor(e.target.value)}/>
            <select style={inputStyle} value={sector} onChange={e => setSector(e.target.value)}>
              <option value="">อาชีพที่สนใจ</option>
              <optgroup label="Digital Technology">
                {careers.filter(c => c.sector === 'DT').map(c => <option key={c.id} value={c.id}>{c.name}</option>)}
              </optgroup>
              <optgroup label="Digital Communication">
                {careers.filter(c => c.sector === 'DC').map(c => <option key={c.id} value={c.id}>{c.name}</option>)}
              </optgroup>
            </select>
            {error && <p style={{ color: '#e05c5c', fontSize: '0.8rem', textAlign: 'center' }}>{error}</p>}
            <button
  onClick={handleStep2}
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
  {loading ? 'กำลังเปิดหน้าชำระเงิน...' : 'Next → ชำระเงิน'}
</button>
          </div>
        </div>
      )}

      {/* ── STEP 3 OTP ── */}
      {step === 'otp' && (
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
          {otpError && <p style={{ color: '#e05c5c', fontSize: '0.8rem', marginBottom: '0.75rem' }}>{otpError}</p>}
          <button onClick={handleOtp} disabled={loading} style={{ background: 'var(--dark)', color: 'var(--bg)', border: 'none', borderRadius: '999px', padding: '0.6rem 2rem', cursor: loading ? 'default' : 'pointer', fontFamily: 'var(--font-hand)', fontSize: '1.1rem', opacity: loading ? 0.6 : 1 }}>
            {loading ? 'กำลังตรวจสอบ...' : 'Verify'}
          </button>
        </div>
      )}
    </main>
  )
}

export default function RegisterPage() {
  return <Suspense><RegisterInner /></Suspense>
}