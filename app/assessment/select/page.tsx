'use client'
import { useRouter } from 'next/navigation'

function DTAvatar() {
    return (
        <svg viewBox="0 0 100 115" fill="none" xmlns="http://www.w3.org/2000/svg" width="90" height="105">
            <ellipse cx="50" cy="35" rx="22" ry="24" fill="#c8b8a8" stroke="#2c2927" strokeWidth="1.5" />
            <circle cx="42" cy="32" r="2.2" fill="#2c2927" />
            <circle cx="58" cy="32" r="2.2" fill="#2c2927" />
            <path d="M44 42 Q50 47 56 42" stroke="#2c2927" strokeWidth="1.5" fill="none" strokeLinecap="round" />
            <rect x="30" y="56" width="8" height="3.5" rx="1.5" fill="#2c2927" />
            <rect x="62" y="56" width="8" height="3.5" rx="1.5" fill="#2c2927" />
            <path d="M22 62 Q14 68 12 88 Q10 105 24 108 Q50 114 76 108 Q90 105 88 88 Q86 68 78 62 Q66 57 50 57 Q34 57 22 62Z" fill="#6b4f3a" stroke="#2c2927" strokeWidth="1.5" />
            <ellipse cx="50" cy="59" rx="13" ry="7" fill="#c8b8a8" />
            {/* แว่น */}
            <circle cx="43" cy="32" r="6" stroke="#2c2927" strokeWidth="1.2" fill="none" />
            <circle cx="57" cy="32" r="6" stroke="#2c2927" strokeWidth="1.2" fill="none" />
            <path d="M49 32 h2" stroke="#2c2927" strokeWidth="1.2" />
            <path d="M37 32 h-3" stroke="#2c2927" strokeWidth="1.2" />
            <path d="M63 32 h3" stroke="#2c2927" strokeWidth="1.2" />
        </svg>
    )
}

function DCAvatar() {
    return (
        <svg viewBox="0 0 100 115" fill="none" xmlns="http://www.w3.org/2000/svg" width="90" height="105">
            <ellipse cx="50" cy="33" rx="21" ry="23" fill="#c8b8a8" stroke="#2c2927" strokeWidth="1.5" />
            <circle cx="43" cy="31" r="2.2" fill="#2c2927" />
            <circle cx="57" cy="31" r="2.2" fill="#2c2927" />
            <path d="M45 40 Q50 44 55 40" stroke="#2c2927" strokeWidth="1.5" fill="none" strokeLinecap="round" />
            <path d="M29 22 Q34 7 50 10 Q66 7 71 22 Q73 30 71 24 Q64 12 50 14 Q36 12 29 24Z" fill="#2c2927" />
            <path d="M29 22 Q25 28 27 35" stroke="#2c2927" strokeWidth="3" fill="none" />
            <path d="M71 22 Q75 28 73 35" stroke="#2c2927" strokeWidth="3" fill="none" />
            <path d="M22 62 Q14 68 12 88 Q10 105 24 108 Q50 114 76 108 Q90 105 88 88 Q86 68 78 62 Q66 57 50 57 Q34 57 22 62Z" fill="#6b4f3a" stroke="#2c2927" strokeWidth="1.5" />
            <ellipse cx="50" cy="59" rx="12" ry="6" fill="#c8b8a8" />
            {/* headphones */}
            <path d="M31 30 Q31 10 50 10 Q69 10 69 30" stroke="#2c2927" strokeWidth="2" fill="none" />
            <rect x="27" y="30" width="7" height="11" rx="3" fill="#2c2927" />
            <rect x="66" y="30" width="7" height="11" rx="3" fill="#2c2927" />
        </svg>
    )
}

const NAV_TABS = [
    { key: 'home', label: 'หน้าหลัก', path: '/' },
    { key: 'assessment', label: 'แบบทดสอบ', path: '/assessment/select' },
    { key: 'result', label: 'สรุปผล', path: '/result' },
    { key: 'profile', label: 'โปรไฟล์', path: '/profile' },
]

export default function SelectSectorPage() {
    const router = useRouter()

    return (
        <main style={{ minHeight: '100vh', background: '#f5f0eb', fontFamily: "'Noto Sans Thai', sans-serif" }}>

            {/* Topbar */}
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '0.75rem 1rem 0.4rem' }}>
                <div style={{ width: 24 }} />
                <div style={{
                    background: '#2c2927', borderRadius: '999px', padding: '0.3rem 1.25rem',
                    fontFamily: "'Caveat', cursive", fontSize: '1rem', color: '#f5f0eb',
                    letterSpacing: '1px',
                }}>CARIA↗</div>
                <div style={{ width: 24 }} />
            </div>

            {/* Tab Nav */}
            <div style={{
                width: '100%', background: '#c9b8ae',
                display: 'flex', alignItems: 'flex-end',
                paddingLeft: '0.75rem',
                position: 'sticky', top: 0, zIndex: 100, height: 44,
            }}>
                {NAV_TABS.map((tab) => {
                    const isActive = tab.key === 'assessment'
                    return (
                        <button key={tab.key} onClick={() => router.push(tab.path)} style={{
                            background: '#f5f0eb', border: 'none', cursor: 'pointer', padding: '0',
                            width: 'calc(25% - 0.5rem)',
                            fontFamily: "'Noto Sans Thai', sans-serif", fontSize: '0.75rem', color: '#2c2927',
                            clipPath: 'polygon(12px 0%, calc(100% - 12px) 0%, 100% 100%, 0% 100%)',
                            marginRight: '-2px',
                            opacity: isActive ? 1 : 0.6,
                            fontWeight: isActive ? 600 : 400,
                            height: 34, position: 'relative', zIndex: isActive ? 2 : 1,
                        }}>
                            {tab.label}
                        </button>
                    )
                })}
            </div>

            {/* Content */}
            <div style={{
                display: 'flex', flexDirection: 'column', alignItems: 'center',
                justifyContent: 'center',
                padding: '3rem 1.5rem',
                gap: '2.5rem',
                maxWidth: 480, margin: '0 auto',
            }}>

                {/* Cards row */}
                <div style={{ display: 'flex', gap: '2rem', width: '100%', justifyContent: 'center' }}>

                    {/* DT */}
                    <div style={{ flex: 1, display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '1rem' }}>
                        <DTAvatar />
                        <div style={{
                            fontFamily: "'Caveat', cursive", fontSize: '1.05rem',
                            color: '#4a6fa5', textDecoration: 'underline', textDecorationColor: '#7ec8a4',
                            textUnderlineOffset: '3px', textDecorationStyle: 'wavy',
                        }}>Digital Technology</div>
                        <button
                            onClick={() => router.push('/assessment?sector=DT')}
                            style={{
                                width: '100%', padding: '0.55rem 0',
                                background: '#f5f0eb', border: '1.5px solid #2c2927',
                                borderRadius: '999px', fontSize: '0.85rem',
                                fontFamily: "'Noto Sans Thai', sans-serif",
                                cursor: 'pointer', color: '#2c2927',
                                fontWeight: 500, letterSpacing: '0.05em',
                                transition: 'background 0.15s, color 0.15s',
                            }}
                            onMouseEnter={e => { e.currentTarget.style.background = '#2c2927'; e.currentTarget.style.color = '#f5f0eb' }}
                            onMouseLeave={e => { e.currentTarget.style.background = '#f5f0eb'; e.currentTarget.style.color = '#2c2927' }}
                        >START</button>
                    </div>

                    {/* DC */}
                    <div style={{ flex: 1, display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '1rem' }}>
                        <DCAvatar />
                        <div style={{
                            fontFamily: "'Caveat', cursive", fontSize: '1.05rem',
                            color: '#4a6fa5', textDecoration: 'underline', textDecorationColor: '#e87c7c',
                            textUnderlineOffset: '3px', textDecorationStyle: 'wavy',
                        }}>Digital Communication</div>
                        <button
                            onClick={() => router.push('/assessment?sector=DC')}
                            style={{
                                width: '100%', padding: '0.55rem 0',
                                background: '#f5f0eb', border: '1.5px solid #2c2927',
                                borderRadius: '999px', fontSize: '0.85rem',
                                fontFamily: "'Noto Sans Thai', sans-serif",
                                cursor: 'pointer', color: '#2c2927',
                                fontWeight: 500, letterSpacing: '0.05em',
                                transition: 'background 0.15s, color 0.15s',
                            }}
                            onMouseEnter={e => { e.currentTarget.style.background = '#2c2927'; e.currentTarget.style.color = '#f5f0eb' }}
                            onMouseLeave={e => { e.currentTarget.style.background = '#f5f0eb'; e.currentTarget.style.color = '#2c2927' }}
                        >START</button>
                    </div>

                </div>
            </div>
        </main>
    )
}