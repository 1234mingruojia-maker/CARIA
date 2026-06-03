'use client'
import { useRouter } from 'next/navigation'
import { useState, useEffect, useRef } from 'react'
import { supabase } from '@/lib/supabase'
import { signOut } from '@/lib/auth'

type Profile = {
  id: string
  username: string
  gender: string
  age: number
  gpax: number
  major: string
  preferred_sector: string
  created_at: string
  avatar_url: string | null
}

type CareerOption = {
  id: string
  name: string
  sector: string
}

const GENDER_OPTIONS = ['ชาย', 'หญิง', 'ไม่ระบุ']
const MAJOR_OPTIONS = ['DT', 'DC']

function Dropdown({
  value, options, onChange, displayFn,
}: {
  value: string
  options: string[]
  onChange: (v: string) => void
  displayFn?: (v: string) => string
}) {
  const [open, setOpen] = useState(false)
  const ref = useRef<HTMLDivElement>(null)

  useEffect(() => {
    function handleClick(e: MouseEvent) {
      if (ref.current && !ref.current.contains(e.target as Node)) setOpen(false)
    }
    document.addEventListener('mousedown', handleClick)
    return () => document.removeEventListener('mousedown', handleClick)
  }, [])

  const display = displayFn ?? ((v: string) => v)

  return (
    <div ref={ref} style={{ position: 'relative', flex: 1, minWidth: 0 }}>
      <div
        onClick={() => setOpen(o => !o)}
        style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', cursor: 'pointer', userSelect: 'none' }}
      >
        <span style={{ fontSize: '0.84rem', color: '#2c2927', fontFamily: "'Noto Sans Thai', sans-serif", overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap', flex: 1, minWidth: 0 }}>
          {display(value)}
        </span>
        <svg width="14" height="14" viewBox="0 0 24 24" fill="none" style={{ flexShrink: 0, marginLeft: '0.4rem', opacity: 0.5, transform: open ? 'rotate(180deg)' : 'rotate(0deg)', transition: 'transform 0.2s' }}>
          <path d="M6 9l6 6 6-6" stroke="#2c2927" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
        </svg>
      </div>
      {open && (
        <div style={{
          position: 'absolute', top: 'calc(100% + 8px)', left: -14, right: -14,
          background: '#fff', border: '0.5px solid #e0dbd4', borderRadius: '12px',
          boxShadow: '0 8px 24px rgba(44,41,39,0.12)', zIndex: 50,
          maxHeight: 220, overflowY: 'auto',
        }}>
          {options.map(opt => (
            <div
              key={opt}
              onClick={() => { onChange(opt); setOpen(false) }}
              style={{
                padding: '0.65rem 1rem', fontSize: '0.82rem',
                color: opt === value ? '#2c2927' : '#5a5350',
                background: opt === value ? '#f5f0eb' : 'transparent',
                fontFamily: "'Noto Sans Thai', sans-serif",
                cursor: 'pointer', transition: 'background 0.15s',
                fontWeight: opt === value ? 600 : 400,
              }}
              onMouseEnter={e => { if (opt !== value) e.currentTarget.style.background = '#faf7f4' }}
              onMouseLeave={e => { if (opt !== value) e.currentTarget.style.background = 'transparent' }}
            >
              {display(opt)}
            </div>
          ))}
        </div>
      )}
    </div>
  )
}

export default function ProfilePage() {
  const router = useRouter()
  const fileRef = useRef<HTMLInputElement>(null)

  const [editing, setEditing] = useState(false)
  const [avatarUrl, setAvatarUrl] = useState<string | null>(null)
  const [loading, setLoading] = useState(true)
  const [saving, setSaving] = useState(false)
  const [uploading, setUploading] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [careers, setCareers] = useState<CareerOption[]>([])

  const [profile, setProfile] = useState<Profile | null>(null)
  const [draft, setDraft] = useState<Profile | null>(null)

  useEffect(() => {
    async function load() {
      const { data: sessionData } = await supabase.auth.getSession()
      if (!sessionData.session) {
        router.replace('/login')
        return
      }
      const userId = sessionData.session.user.id

      // โหลด profile และ careers พร้อมกัน
      const [profileRes, careerRes] = await Promise.all([
        supabase.from('profiles').select('*').eq('id', userId).single(),
        supabase.from('career_competency').select('id, name, sector').order('id'),
      ])

      if (profileRes.error || !profileRes.data) {
        setError('ไม่พบข้อมูลโปรไฟล์')
      } else {
        setProfile(profileRes.data)
        setDraft(profileRes.data)
        if (profileRes.data.avatar_url) setAvatarUrl(profileRes.data.avatar_url)
      }

      if (!careerRes.error && careerRes.data) {
        setCareers(careerRes.data)
      }

      setLoading(false)
    }
    load()
  }, [])

  function handleEdit() {
    setDraft(profile)
    setEditing(true)
  }

  async function handleSave() {
    if (!draft) return
    setSaving(true)
    setError(null)

    const { error } = await supabase
      .from('profiles')
      .update({
        username:         draft.username,
        gender:           draft.gender,
        age:              Number(draft.age),
        gpax:             Number(draft.gpax),
        major:            draft.major,
        preferred_sector: draft.preferred_sector,
      })
      .eq('id', draft.id)

    if (error) {
      setError('บันทึกไม่สำเร็จ กรุณาลองใหม่')
    } else {
      setProfile(draft)
      setEditing(false)
    }
    setSaving(false)
  }

  function handleCancel() {
    setDraft(profile)
    setEditing(false)
    setError(null)
  }

  async function handleAvatarChange(e: React.ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0]
    if (!file || !profile) return
    setUploading(true)
    setError(null)

    const ext = file.name.split('.').pop()
    const path = `${profile.id}.${ext}`

    const { error: uploadError } = await supabase.storage
      .from('avatars')
      .upload(path, file, { upsert: true })

    if (uploadError) {
      setError(`อัปโหลดรูปไม่สำเร็จ: ${uploadError.message}`)
      setUploading(false)
      return
    }

    const { data } = supabase.storage.from('avatars').getPublicUrl(path)
    const publicUrl = `${data.publicUrl}?t=${Date.now()}`

    const { error: updateError } = await supabase
      .from('profiles')
      .update({ avatar_url: publicUrl })
      .eq('id', profile.id)

    if (updateError) {
      setError('บันทึก URL รูปไม่สำเร็จ')
      setUploading(false)
      return
    }

    setAvatarUrl(publicUrl)
    setProfile(p => p ? { ...p, avatar_url: publicUrl } : p)
    setDraft(d => d ? { ...d, avatar_url: publicUrl } : d)
    setUploading(false)
  }

  // career id → name
  const careerIdToName = (id: string) => careers.find(c => c.id === id)?.name ?? id
  const careerIds = careers.map(c => c.id)

  type FieldConfig =
    | { key: keyof Omit<Profile, 'id' | 'created_at' | 'avatar_url'>; label: string; half?: boolean; type: 'text' | 'number' }
    | { key: keyof Omit<Profile, 'id' | 'created_at' | 'avatar_url'>; label: string; half?: boolean; type: 'dropdown'; options: string[]; displayFn?: (v: string) => string }

  const fields: FieldConfig[] = [
    { key: 'username',         label: 'Username',   type: 'text' },
    { key: 'gender',           label: 'เพศ',         half: true, type: 'dropdown', options: GENDER_OPTIONS },
    { key: 'age',              label: 'อายุ',         half: true, type: 'number' },
    { key: 'gpax',             label: 'เกรดเฉลี่ย',  type: 'number' },
    { key: 'major',            label: 'สาขา',         type: 'dropdown', options: MAJOR_OPTIONS },
    { key: 'preferred_sector', label: 'อาชีพที่สนใจ', type: 'dropdown', options: careerIds, displayFn: careerIdToName },
  ]

  return (
    <main style={{ minHeight: '100vh', background: '#f5f0eb', fontFamily: "'Noto Sans Thai', sans-serif" }}>

      {/* Topbar */}
      <div style={{
        background: '#c4a89a', padding: '0.65rem 1.5rem',
        display: 'flex', alignItems: 'center',
        boxShadow: '0 1px 6px rgba(44,41,39,0.10)',
      }}>
        <div
          onClick={() => router.push('/')}
          style={{ fontFamily: "'Caveat', cursive", fontSize: '1.15rem', color: '#f5f0eb', letterSpacing: '1px', cursor: 'pointer', userSelect: 'none' }}
        >CARIA↗</div>
      </div>

      {/* Card */}
      <div style={{ display: 'flex', justifyContent: 'center', padding: '2.5rem 1rem 4rem' }}>
        <div style={{
          background: '#faf7f4', borderRadius: '24px',
          padding: '2.5rem 2rem',
          width: '100%', maxWidth: 440,
          boxShadow: '0 4px 24px rgba(44,41,39,0.08)',
          border: '0.5px solid #e8e2db',
        }}>

          <h1 style={{ fontFamily: "'Caveat', cursive", fontSize: '2rem', color: '#2c2927', textAlign: 'center', margin: '0 0 1.75rem' }}>Profile</h1>

          {/* Avatar */}
          <div style={{ display: 'flex', justifyContent: 'center', marginBottom: '2rem' }}>
            <div style={{ position: 'relative', width: 110, height: 110 }}>
              <div style={{
                width: 110, height: 110, borderRadius: '50%', overflow: 'hidden',
                border: '3px solid #c4a89a',
                boxShadow: '0 4px 16px rgba(196,168,154,0.35)',
                background: '#e8e0d8',
                opacity: uploading ? 0.6 : 1, transition: 'opacity 0.2s',
              }}>
                {avatarUrl ? (
                  <img src={avatarUrl} alt="avatar" style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
                ) : (
                  <div style={{ width: '100%', height: '100%', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                    <svg width="48" height="48" viewBox="0 0 24 24" fill="none">
                      <circle cx="12" cy="8" r="4" fill="#c4a89a"/>
                      <path d="M4 20c0-4 3.6-7 8-7s8 3 8 7" stroke="#c4a89a" strokeWidth="2" strokeLinecap="round"/>
                    </svg>
                  </div>
                )}
              </div>
              <button
                onClick={() => fileRef.current?.click()}
                disabled={uploading}
                style={{
                  position: 'absolute', bottom: 2, right: 2,
                  width: 28, height: 28, borderRadius: '50%',
                  background: '#2c2927', border: '2px solid #faf7f4',
                  cursor: uploading ? 'not-allowed' : 'pointer',
                  display: 'flex', alignItems: 'center', justifyContent: 'center',
                  boxShadow: '0 2px 6px rgba(44,41,39,0.25)',
                }}
              >
                {uploading ? (
                  <svg width="13" height="13" viewBox="0 0 24 24" fill="none" style={{ animation: 'spin 1s linear infinite' }}>
                    <circle cx="12" cy="12" r="10" stroke="#f5f0eb" strokeWidth="2" strokeDasharray="40" strokeDashoffset="10"/>
                  </svg>
                ) : (
                  <svg width="13" height="13" viewBox="0 0 24 24" fill="none">
                    <path d="M23 19a2 2 0 0 1-2 2H3a2 2 0 0 1-2-2V8a2 2 0 0 1 2-2h4l2-3h6l2 3h4a2 2 0 0 1 2 2z" stroke="#f5f0eb" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                    <circle cx="12" cy="13" r="4" stroke="#f5f0eb" strokeWidth="2"/>
                  </svg>
                )}
              </button>
              <input ref={fileRef} type="file" accept="image/*" onChange={handleAvatarChange} style={{ display: 'none' }} />
            </div>
          </div>

          {loading && (
            <div style={{ textAlign: 'center', color: '#8a7f78', fontSize: '0.85rem', padding: '2rem 0' }}>กำลังโหลด...</div>
          )}

          {error && (
            <div style={{ background: '#fdecea', border: '0.5px solid #f5c6c2', borderRadius: '10px', padding: '0.6rem 1rem', fontSize: '0.82rem', color: '#c0392b', marginBottom: '1rem', textAlign: 'center' }}>{error}</div>
          )}

          {!loading && draft && (
            <>
              <div style={{ display: 'flex', flexWrap: 'wrap', gap: '0.75rem' }}>
                {fields.map(f => (
                  <div key={f.key} style={{ flex: f.half ? '1 1 calc(50% - 0.375rem)' : '1 1 100%', minWidth: 0 }}>
                    <div style={{
                      background: '#fff', border: '0.5px solid #e0dbd4',
                      borderRadius: '12px', padding: '0.6rem 0.9rem',
                      display: 'flex', alignItems: 'center',
                      boxShadow: '0 1px 4px rgba(44,41,39,0.04)',
                      position: 'relative', overflow: 'visible',
                    }}>
                      {editing ? (
                        f.type === 'dropdown' ? (
                          <Dropdown
                            value={String(draft[f.key])}
                            options={f.options}
                            onChange={v => setDraft(d => d ? { ...d, [f.key]: v } : d)}
                            displayFn={f.displayFn}
                          />
                        ) : (
                          <>
                            <input
                              type={f.type}
                              value={String(draft[f.key])}
                              onChange={e => setDraft(d => d ? { ...d, [f.key]: e.target.value } : d)}
                              style={{
                                flex: 1, border: 'none', outline: 'none', background: 'transparent',
                                fontSize: '0.84rem', color: '#2c2927',
                                fontFamily: "'Noto Sans Thai', sans-serif", minWidth: 0,
                              }}
                            />
                            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" style={{ flexShrink: 0, marginLeft: '0.4rem', opacity: 0.4 }}>
                              <path d="M11 4H4a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7" stroke="#2c2927" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                              <path d="M18.5 2.5a2.121 2.121 0 0 1 3 3L12 15l-4 1 1-4 9.5-9.5z" stroke="#2c2927" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                            </svg>
                          </>
                        )
                      ) : (
                        <span style={{ fontSize: '0.84rem', color: '#2c2927', flex: 1, minWidth: 0, overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
                          {f.type === 'dropdown' && f.displayFn
                            ? f.displayFn(String(profile![f.key]))
                            : String(profile![f.key])}
                        </span>
                      )}
                    </div>
                  </div>
                ))}
              </div>

              <p style={{ textAlign: 'center', fontSize: '0.72rem', color: '#b0a89e', marginTop: '1rem', marginBottom: 0 }}>
                สมาชิกตั้งแต่ {new Date(profile!.created_at).toLocaleDateString('th-TH', { year: 'numeric', month: 'long', day: 'numeric' })}
              </p>

             <div style={{ display: 'flex', justifyContent: 'center', marginTop: '1.75rem', gap: '0.75rem' }}>
                {editing ? (
                  <>
                    <button
                      onClick={handleCancel}
                      disabled={saving}
                      style={{ background: 'transparent', border: '1.5px solid #2c2927', borderRadius: '999px', padding: '0.55rem 2rem', fontSize: '0.9rem', cursor: 'pointer', color: '#2c2927', fontFamily: "'Noto Sans Thai', sans-serif", transition: 'background 0.15s' }}
                      onMouseEnter={e => (e.currentTarget.style.background = '#e8e3de')}
                      onMouseLeave={e => (e.currentTarget.style.background = 'transparent')}
                    >ยกเลิก</button>
                    <button
                      onClick={handleSave}
                      disabled={saving}
                      style={{ background: '#2c2927', border: '1.5px solid #2c2927', borderRadius: '999px', padding: '0.55rem 2rem', fontSize: '0.9rem', cursor: saving ? 'not-allowed' : 'pointer', color: '#f5f0eb', fontFamily: "'Noto Sans Thai', sans-serif", opacity: saving ? 0.7 : 1 }}
                    >{saving ? 'กำลังบันทึก...' : 'บันทึก'}</button>
                  </>
                ) : (
                  <>
                    <button
                      onClick={handleEdit}
                      style={{ background: '#2c2927', border: '1.5px solid #2c2927', borderRadius: '999px', padding: '0.55rem 2.75rem', fontSize: '0.9rem', cursor: 'pointer', color: '#f5f0eb', fontFamily: "'Noto Sans Thai', sans-serif" }}
                      onMouseEnter={e => (e.currentTarget.style.opacity = '0.85')}
                      onMouseLeave={e => (e.currentTarget.style.opacity = '1')}
                    >แก้ไข</button>
                    <button
                      onClick={async () => { await signOut(); router.push('/login') }}
                      style={{ background: 'transparent', border: '1.5px solid #c0392b', borderRadius: '999px', padding: '0.55rem 1.75rem', fontSize: '0.9rem', cursor: 'pointer', color: '#c0392b', fontFamily: "'Noto Sans Thai', sans-serif" }}
                      onMouseEnter={e => (e.currentTarget.style.opacity = '0.7')}
                      onMouseLeave={e => (e.currentTarget.style.opacity = '1')}
                    >ออกจากระบบ</button>
                  </>
                )}
              </div>
            </>
          )}

        </div>
      </div>

      <style>{`@keyframes spin { to { transform: rotate(360deg); } }`}</style>
    </main>
  )
}