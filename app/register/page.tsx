'use client'
import { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import { validateEmail, validatePassword, passwordStrength, signUp, saveProfile } from '@/lib/auth'
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

export default function RegisterPage() {
  const router = useRouter()
  const [step, setStep] = useState<'account' | 'profile' | 'otp'>('account')

  // Step 1
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [confirm, setConfirm] = useState('')
  const [showPw, setShowPw] = useState(false)
  const [agreed, setAgreed] = useState(false)

  // Step 2
  const [username, setUsername] = useState('')
  const [gender, setGender] = useState('')
  const [age, setAge] = useState('')
  const [gpax, setGpax] = useState('')
  const [major, setMajor] = useState('')
  const [sector, setSector] = useState('')
  const [careers, setCareers] = useState<{ id: string; name: string; sector: string }[]>([])

  // OTP
  const [otp, setOtp] = useState(['', '', '', '', '', ''])
  const [otpError, setOtpError] = useState('')

  const [error, setError] = useState('')
  const [loading, setLoading] = useState(false)

  const pwStrength = passwordStrength(password)

  useEffect(() => {
    supabase
      .from('career_competency')
      .select('id, name, sector')
      .order('id')
      .then(({ data }) => { if (data) setCareers(data) })
  }, [])

  async function handleStep1() {
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
    if (!username || !gender || !age || !gpax || !major || !sector) {
      return setError('กรุณากรอกข้อมูลให้ครบ')
    }
    setLoading(true)
    const { error: signUpError } = await signUp(email, password, username)
    setLoading(false)
    if (signUpError) return setError(signUpError.message)
    setStep('otp')
  }

  async function handleOtp() {
    const token = otp.join('')
    if (token.length < 6) return setOtpError('กรุณากรอก OTP ให้ครบ 6 หลัก')
    setLoading(true)
    setOtpError('')

    const { verifyOtp } = await import('@/lib/auth')
    const { data, error: otpError } = await verifyOtp(email, token)

    if (otpError || !data.user) {
      setLoading(false)
      return setOtpError('OTP ไม่ถูกต้องหรือหมดอายุ')
    }

    const selectedCareer = careers.find(c => c.id === sector)

    await saveProfile(data.user.id, {
      username,
      gender,
      age: Number(age),
      gpax: Number(gpax),
      major,
      preferred_sector: selectedCareer?.sector ?? sector,
    })

    setLoading(false)
    router.push('/')
  }

  function handleOtpInput(val: string, idx: number) {
    const newOtp = [...otp]
    newOtp[idx] = val.slice(-1)
    setOtp(newOtp)
    if (val && idx < 5) {
      document.getElementById(`otp-${idx + 1}`)?.focus()
    }
  }

  return (
    <main style={{ minHeight: '100vh', background: '#f5f0eb', display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', padding: '1.5rem', fontFamily: "'Noto Sans Thai', sans-serif" }}>
      <style>{`
        input[type="password"]::-ms-reveal,
        input[type="password"]::-ms-clear,
        input::-webkit-credentials-auto-fill-button,
        input::-webkit-strong-password-auto-fill-button {
          display: none !important;
        }
      `}</style>

      <div style={{ position: 'fixed', top: '1rem', left: '50%', transform: 'translateX(-50%)', background: '#2c2927', borderRadius: '999px', padding: '0.4rem 1.5rem', fontFamily: "'Caveat', cursive", fontSize: '1rem', color: '#f5f0eb', zIndex: 10 }}>CARIA↗</div>

      {/* STEP 1 — Account */}
      {step === 'account' && (
        <div style={{ background: '#faf7f4', borderRadius: '20px', padding: '2rem', width: '100%', maxWidth: 400, boxShadow: '0 4px 20px rgba(44,41,39,0.08)' }}>
          <h1 style={{ fontFamily: "'Caveat', cursive", fontSize: '2rem', textAlign: 'center', marginBottom: '0.25rem', color: '#2c2927' }}>Register</h1>
          <p style={{ textAlign: 'center', fontSize: '0.75rem', color: '#3a5ca8', marginBottom: '1.5rem', cursor: 'pointer' }} onClick={() => router.push('/login')}>+ มีบัญชีอยู่แล้ว?</p>

          <div style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem' }}>
            <input style={inputStyle} placeholder="Email" value={email} onChange={e => setEmail(e.target.value)} type="email"/>

            <div style={{ position: 'relative' }}>
              <input
                style={{ ...inputStyle, paddingRight: '2.5rem' }}
                placeholder="Password"
                value={password}
                onChange={e => setPassword(e.target.value)}
                type={showPw ? 'text' : 'password'}
                autoComplete="new-password"
              />
              <button onClick={() => setShowPw(!showPw)} style={{ position: 'absolute', right: 10, top: '50%', transform: 'translateY(-50%)', background: 'none', border: 'none', cursor: 'pointer', color: '#8a7f78', display: 'flex', alignItems: 'center', padding: 0 }}>
                <EyeIcon open={showPw} />
              </button>
            </div>

            {/* Password strength */}
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

            {/* Password rules */}
            <div style={{ background: '#f0ebe6', borderRadius: 10, padding: '0.75rem 1rem', fontSize: '0.72rem', color: '#5f5e5a', lineHeight: 1.8 }}>
              <p style={{ fontWeight: 500, marginBottom: 4 }}>รหัสผ่านต้องประกอบด้วย</p>
              {[
                { rule: /^.{12,16}$/, label: '12–16 ตัวอักษร' },
                { rule: /[A-Z]/, label: 'ตัวพิมพ์ใหญ่ (A-Z)' },
                { rule: /[a-z]/, label: 'ตัวพิมพ์เล็ก (a-z)' },
                { rule: /[0-9]/, label: 'ตัวเลข (0-9)' },
                { rule: /[!@#$%^&*]/, label: 'สัญลักษณ์พิเศษ (!@#$%^&*)' },
              ].map(({ rule, label }) => (
                <div key={label} style={{ display: 'flex', gap: 6, alignItems: 'center' }}>
                  <span style={{ color: rule.test(password) ? '#4caf50' : '#c0b8b0' }}>{rule.test(password) ? '✓' : '○'}</span>
                  <span style={{ color: rule.test(password) ? '#2c2927' : '#a09890' }}>{label}</span>
                </div>
              ))}
            </div>

            <input
              style={{ ...inputStyle, paddingRight: '2.5rem' }}
              placeholder="Confirm Password"
              value={confirm}
              onChange={e => setConfirm(e.target.value)}
              type="password"
              autoComplete="new-password"
            />

            <label style={{ display: 'flex', gap: 8, alignItems: 'flex-start', fontSize: '0.75rem', color: '#5f5e5a', cursor: 'pointer' }}>
              <input type="checkbox" checked={agreed} onChange={e => setAgreed(e.target.checked)} style={{ marginTop: 2 }}/>
              ยอมรับ <span style={{ color: '#3a5ca8' }}>ข้อกำหนดการใช้งาน</span> และ <span style={{ color: '#3a5ca8' }}>นโยบายความเป็นส่วนตัว</span>
            </label>

            {error && <p style={{ color: '#e05c5c', fontSize: '0.8rem', textAlign: 'center' }}>{error}</p>}

            <button onClick={handleStep1} style={{ background: '#2c2927', color: '#f5f0eb', border: 'none', borderRadius: '999px', padding: '0.65rem', fontSize: '0.95rem', cursor: 'pointer', fontFamily: "'Caveat', cursive", marginTop: '0.5rem' }}>Next</button>
          </div>
        </div>
      )}

      {/* STEP 2 — Profile */}
      {step === 'profile' && (
        <div style={{ background: '#faf7f4', borderRadius: '20px', padding: '2rem', width: '100%', maxWidth: 400, boxShadow: '0 4px 20px rgba(44,41,39,0.08)' }}>
          <h1 style={{ fontFamily: "'Caveat', cursive", fontSize: '2rem', textAlign: 'center', marginBottom: '1.5rem', color: '#2c2927' }}>Register</h1>

          <div style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem' }}>
            <input style={inputStyle} placeholder="ชื่อผู้ใช้งาน" value={username} onChange={e => setUsername(e.target.value)}/>

            <div style={{ display: 'flex', gap: '0.5rem' }}>
              <select style={{ ...inputStyle, flex: 1 }} value={gender} onChange={e => setGender(e.target.value)}>
                <option value="">เพศ</option>
                <option>ชาย</option>
                <option>หญิง</option>
                <option>ไม่ระบุ</option>
              </select>
              <input style={{ ...inputStyle, flex: 1 }} placeholder="อายุ" type="number" value={age} onChange={e => setAge(e.target.value)}/>
            </div>

            <input style={inputStyle} placeholder="เกรด (GPAX)" type="number" step="0.01" min="0" max="4" value={gpax} onChange={e => setGpax(e.target.value)}/>
            <input style={inputStyle} placeholder="สาขา" value={major} onChange={e => setMajor(e.target.value)}/>

            <select style={inputStyle} value={sector} onChange={e => setSector(e.target.value)}>
              <option value="">อาชีพที่สนใจ</option>
              <optgroup label="Digital Technology">
                {careers.filter(c => c.sector === 'DT').map(c => (
                  <option key={c.id} value={c.id}>{c.name}</option>
                ))}
              </optgroup>
              <optgroup label="Digital Communication">
                {careers.filter(c => c.sector === 'DC').map(c => (
                  <option key={c.id} value={c.id}>{c.name}</option>
                ))}
              </optgroup>
            </select>

            {error && <p style={{ color: '#e05c5c', fontSize: '0.8rem', textAlign: 'center' }}>{error}</p>}

            <button onClick={handleStep2} disabled={loading} style={{ background: '#2c2927', color: '#f5f0eb', border: 'none', borderRadius: '999px', padding: '0.65rem', cursor: loading ? 'default' : 'pointer', fontFamily: "'Caveat', cursive", fontSize: '1.1rem', opacity: loading ? 0.6 : 1, marginTop: '0.5rem' }}>
              {loading ? 'กำลังส่ง OTP...' : 'Next'}
            </button>
          </div>
        </div>
      )}

      {/* STEP 3 — OTP */}
      {step === 'otp' && (
        <div style={{ background: '#c4a99a', borderRadius: '20px', padding: '2rem', width: '100%', maxWidth: 360, boxShadow: '0 4px 20px rgba(44,41,39,0.15)', textAlign: 'center' }}>
          <h2 style={{ fontFamily: "'Caveat', cursive", fontSize: '1.6rem', color: '#2c2927', marginBottom: '0.5rem' }}>OTP Verification</h2>
          <p style={{ fontSize: '0.8rem', color: '#5f3e30', marginBottom: '0.25rem' }}>Enter one-time password</p>
          <p style={{ fontSize: '0.75rem', color: '#5f3e30', marginBottom: '0.25rem' }}>a one-time password has been send to</p>
          <p style={{ fontSize: '0.8rem', color: '#2c2927', fontWeight: 500, marginBottom: '0.25rem' }}>{email}</p>
          <p style={{ fontSize: '0.72rem', color: '#5f3e30', marginBottom: '1.5rem' }}>หมดอายุใน 10 นาที</p>

          <div style={{ display: 'flex', gap: '8px', justifyContent: 'center', marginBottom: '1rem' }}>
            {otp.map((v, i) => (
              <input
                key={i}
                id={`otp-${i}`}
                value={v}
                onChange={e => handleOtpInput(e.target.value, i)}
                onKeyDown={e => {
                  if (e.key === 'Backspace' && !v && i > 0) {
                    document.getElementById(`otp-${i - 1}`)?.focus()
                  }
                }}
                maxLength={1}
                style={{ width: 42, height: 48, textAlign: 'center', borderRadius: 10, border: '1px solid rgba(44,41,39,0.2)', background: 'rgba(255,255,255,0.4)', fontSize: '1.2rem', fontFamily: "'Caveat', cursive", color: '#2c2927', outline: 'none' }}
              />
            ))}
          </div>

          {otpError && <p style={{ color: '#e05c5c', fontSize: '0.8rem', marginBottom: '0.75rem' }}>{otpError}</p>}

          <button onClick={handleOtp} disabled={loading} style={{ background: '#2c2927', color: '#f5f0eb', border: 'none', borderRadius: '999px', padding: '0.6rem 2rem', cursor: loading ? 'default' : 'pointer', fontFamily: "'Caveat', cursive", fontSize: '1.1rem', opacity: loading ? 0.6 : 1 }}>
            {loading ? 'กำลังยืนยัน...' : 'Submit'}
          </button>
        </div>
      )}
    </main>
  )
}