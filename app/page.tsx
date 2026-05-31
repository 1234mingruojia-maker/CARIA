'use client'
import { useRouter } from 'next/navigation'

export default function Home() {
  const router = useRouter()

  return (
    <main style={{
      minHeight: '100vh',
      background: '#f5f0eb',
      display: 'flex',
      flexDirection: 'column',
      alignItems: 'center',
      justifyContent: 'center',
      padding: '2rem',
    }}>
      {/* Topbar */}
      <div style={{
        position: 'fixed', top: '1rem', left: '50%',
        transform: 'translateX(-50%)',
        background: '#2c2927', borderRadius: '999px',
        padding: '0.4rem 1.5rem',
        fontFamily: "'Caveat', cursive",
        fontSize: '1.1rem', color: '#f5f0eb',
        letterSpacing: '1px', zIndex: 10,
      }}>CARIA↗</div>

      {/* Cards */}
      <div style={{ display: 'flex', gap: '2.5rem', marginTop: '2rem', flexWrap: 'wrap', justifyContent: 'center' }}>
        {[
          {
            sector: 'DT', label: 'Digital Technology',
            color: '#3a5ca8', underline: '#3a5ca8',
            svg: <DTAvatar />,
          },
          {
            sector: 'DC', label: 'Digital Communication',
            color: '#0f6e56', underline: '#e05c5c',
            svg: <DCAvatar />,
          },
        ].map(({ sector, label, color, svg }) => (
          <div key={sector} style={{
            background: '#f5f0eb',
            borderRadius: '20px',
            padding: '2rem 1.5rem 1.5rem',
            display: 'flex', flexDirection: 'column',
            alignItems: 'center', gap: '1.2rem',
            width: '200px',
            boxShadow: '0 2px 12px rgba(44,41,39,0.06)',
          }}>
            <div style={{ width: 100, height: 110 }}>{svg}</div>
            <div style={{
              fontFamily: "'Caveat', cursive",
              fontSize: '1.15rem', color,
              textAlign: 'center', lineHeight: 1.3,
            }}>{label}</div>
            <button
              onClick={() => router.push(`/assessment?sector=${sector}`)}
              style={{
                background: 'transparent',
                border: '1.5px solid #2c2927',
                borderRadius: '999px',
                padding: '0.4rem 2rem',
                fontSize: '0.9rem',
                cursor: 'pointer',
                color: '#2c2927',
                fontFamily: "'Noto Sans Thai', sans-serif",
                width: '100%',
                transition: 'background 0.15s',
              }}
              onMouseEnter={e => (e.currentTarget.style.background = '#e8e3de')}
              onMouseLeave={e => (e.currentTarget.style.background = 'transparent')}
            >START</button>
          </div>
        ))}
      </div>
    </main>
  )
}

function DTAvatar() {
  return (
    <svg viewBox="0 0 100 115" fill="none" xmlns="http://www.w3.org/2000/svg" width="100" height="115">
      <ellipse cx="50" cy="35" rx="22" ry="24" fill="#c8b8a8" stroke="#2c2927" strokeWidth="1.5"/>
      <circle cx="42" cy="32" r="2.2" fill="#2c2927"/>
      <circle cx="58" cy="32" r="2.2" fill="#2c2927"/>
      <path d="M44 42 Q50 47 56 42" stroke="#2c2927" strokeWidth="1.5" fill="none" strokeLinecap="round"/>
      <rect x="30" y="56" width="8" height="3.5" rx="1.5" fill="#2c2927"/>
      <rect x="62" y="56" width="8" height="3.5" rx="1.5" fill="#2c2927"/>
      <path d="M22 62 Q14 68 12 88 Q10 105 24 108 Q50 114 76 108 Q90 105 88 88 Q86 68 78 62 Q66 57 50 57 Q34 57 22 62Z" fill="#6b4f3a" stroke="#2c2927" strokeWidth="1.5"/>
      <ellipse cx="50" cy="59" rx="13" ry="7" fill="#c8b8a8"/>
    </svg>
  )
}

function DCAvatar() {
  return (
    <svg viewBox="0 0 100 115" fill="none" xmlns="http://www.w3.org/2000/svg" width="100" height="115">
      <ellipse cx="50" cy="33" rx="21" ry="23" fill="#c8b8a8" stroke="#2c2927" strokeWidth="1.5"/>
      <circle cx="43" cy="31" r="2.2" fill="#2c2927"/>
      <circle cx="57" cy="31" r="2.2" fill="#2c2927"/>
      <path d="M45 40 Q50 44 55 40" stroke="#2c2927" strokeWidth="1.5" fill="none" strokeLinecap="round"/>
      <path d="M29 22 Q34 7 50 10 Q66 7 71 22 Q73 30 71 24 Q64 12 50 14 Q36 12 29 24Z" fill="#2c2927"/>
      <path d="M29 22 Q25 28 27 35" stroke="#2c2927" strokeWidth="3" fill="none"/>
      <path d="M71 22 Q75 28 73 35" stroke="#2c2927" strokeWidth="3" fill="none"/>
      <path d="M22 62 Q14 68 12 88 Q10 105 24 108 Q50 114 76 108 Q90 105 88 88 Q86 68 78 62 Q66 57 50 57 Q34 57 22 62Z" fill="#6b4f3a" stroke="#2c2927" strokeWidth="1.5"/>
      <ellipse cx="50" cy="59" rx="12" ry="6" fill="#c8b8a8"/>
    </svg>
  )
}