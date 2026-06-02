'use client'
import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { validatePassword, passwordStrength } from '@/lib/auth'
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

export default function ResetPasswordPage() {
  const router = useRouter()
  const [password, setPassword] = useState('')
  const [confirm, setConfirm] = useState('')
  const [showPw, setShowPw] = useState(false)
  const [showConfirm, setShowConfirm] = useState(false)
  const [error, setError] = useState('')
  const [loading, setLoading] = useState(false)

  const pwStrength = passwordStrength(password)

  async function handleReset() {
    setError('')
    const pwErr = validatePassword(password)
    if (pwErr) return setError(pwErr)
    if (password !== confirm) return setError('รหัสผ่านไม่ตรงกัน')

    setLoading(true)
    const { error: updateError } = await supabase.auth.updateUser({ password })
    setLoading(false)

    if (updateError) return setError('เกิดข้อผิดพลาด กรุณาลองใหม่')
    router.push('/login')
  }

  return (
    <main style={{ minHeight: '100vh', background: '#f5f0eb', display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', padding: '1.5rem', fontFamily: "'Noto Sans Thai', sans-serif" }}>
      <div style={{ position: 'fixed', top: '1rem', left: '50%', transform: 'translateX(-50%)', background: '#2c2927', borderRadius: '999px', padding: '0.4rem 1.5rem', fontFamily: "'Caveat', cursive", fontSize: '1rem', color: '#f5f0eb', zIndex: 10 }}>CARIA↗</div>

      <div style={{ background: '#faf7f4', borderRadius: '20px', padding: '2.5rem 2rem', width: '100%', maxWidth: 380, boxShadow: '0 4px 20px rgba(44,41,39,0.08)' }}>
        <h1 style={{ fontFamily: "'Caveat', cursive", fontSize: '2rem', textAlign: 'center', marginBottom: '1.75rem', color: '#2c2927' }}>Reset Password</h1>

        <div style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem' }}>
          <div style={{ position: 'relative' }}>
            <input
              style={inputStyle}
              placeholder="Password"
              type={showPw ? 'text' : 'password'}
              value={password}
              onChange={e => setPassword(e.target.value)}
            />
            <button onClick={() => setShowPw(!showPw)} style={{ position: 'absolute', right: 10, top: '50%', transform: 'translateY(-50%)', background: 'none', border: 'none', cursor: 'pointer', color: '#8a7f78' }}>👁</button>
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

          <div style={{ position: 'relative' }}>
            <input
              style={inputStyle}
              placeholder="Confirm Password"
              type={showConfirm ? 'text' : 'password'}
              value={confirm}
              onChange={e => setConfirm(e.target.value)}
            />
            <button onClick={() => setShowConfirm(!showConfirm)} style={{ position: 'absolute', right: 10, top: '50%', transform: 'translateY(-50%)', background: 'none', border: 'none', cursor: 'pointer', color: '#8a7f78' }}>👁</button>
          </div>

          {error && <p style={{ color: '#e05c5c', fontSize: '0.8rem', textAlign: 'center' }}>{error}</p>}

          <button
            onClick={handleReset}
            disabled={loading}
            style={{ background: '#2c2927', color: '#f5f0eb', border: 'none', borderRadius: '999px', padding: '0.65rem', cursor: loading ? 'default' : 'pointer', fontFamily: "'Caveat', cursive", fontSize: '1.1rem', opacity: loading ? 0.6 : 1, marginTop: '0.5rem' }}
          >{loading ? 'กำลังบันทึก...' : 'Enter'}</button>
        </div>
      </div>
    </main>
  )
}