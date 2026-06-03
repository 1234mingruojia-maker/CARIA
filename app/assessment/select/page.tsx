'use client'

import Image from 'next/image'
import { useRouter } from 'next/navigation'
import TabNav from '../../../components/TabNav'

const NAV_TABS = [
    { key: 'home', label: 'หน้าหลัก', path: '/' },
    { key: 'assessment', label: 'แบบทดสอบ', path: '/assessment/select' },
    { key: 'result', label: 'สรุปผล', path: '/result' },
    { key: 'profile', label: 'โปรไฟล์', path: '/profile' },
]

export default function SelectSectorPage() {
    const router = useRouter()

    return (
        <main
            style={{
                minHeight: '100vh',
                background: '#ececec',
                fontFamily: "'Noto Sans Thai', sans-serif",
            }}
        >
        <TabNav/>
            {/* Content */}
            <div
                style={{
                    display: 'flex',
                    flexDirection: 'column',
                    alignItems: 'center',
                    justifyContent: 'center',
                    padding: '3rem 1.5rem',
                    gap: '2.5rem',
                    maxWidth: 700,
                    margin: '0 auto',
                }}
            >
                <div
                    style={{
                        display: 'flex',
                        gap: '2rem',
                        width: '100%',
                        justifyContent: 'center',
                        flexWrap: 'wrap',
                    }}
                >
                    {/* Digital Technology */}
                    <div
                        style={{
                            flex: 1,
                            minWidth: 250,
                            display: 'flex',
                            flexDirection: 'column',
                            alignItems: 'center',
                            gap: '1rem',
                        }}
                    >
                        <Image
                            src="/DT/DT.png"
                            alt="Digital Technology"
                            width={260}
                            height={320}
                            priority
                            style={{
                                width: '100%',
                                maxWidth: '260px',
                                height: 'auto',
                                objectFit: 'contain',
                            }}
                        />

                        <div
                            style={{
                                fontFamily: "'Caveat', cursive",
                                fontSize: '1.2rem',
                                color: '#4a6fa5',
                                textDecoration: 'underline',
                                textDecorationColor: '#7ec8a4',
                                textUnderlineOffset: '4px',
                                textDecorationStyle: 'wavy',
                            }}
                        >
                            Digital Technology
                        </div>

                        <button
                            onClick={() => router.push('/assessment?sector=DT')}
                            style={{
                                width: '100%',
                                maxWidth: '220px',
                                padding: '0.75rem',
                                background: '#f5f0eb',
                                border: '2px solid #2c2927',
                                borderRadius: '999px',
                                fontSize: '0.9rem',
                                fontWeight: 600,
                                cursor: 'pointer',
                                transition: 'all 0.2s ease',
                            }}
                            onMouseEnter={(e) => {
                                e.currentTarget.style.background = '#2c2927'
                                e.currentTarget.style.color = '#fff'
                            }}
                            onMouseLeave={(e) => {
                                e.currentTarget.style.background = '#f5f0eb'
                                e.currentTarget.style.color = '#2c2927'
                            }}
                        >
                            START
                        </button>
                    </div>

                    {/* Digital Communication */}
                    <div
                        style={{
                            flex: 1,
                            minWidth: 250,
                            display: 'flex',
                            flexDirection: 'column',
                            alignItems: 'center',
                            gap: '1rem',
                        }}
                    >
                        <Image
                            src="/DC/DC.png"
                            alt="Digital Communication"
                            width={260}
                            height={320}
                            priority
                            style={{
                                width: '100%',
                                maxWidth: '260px',
                                height: 'auto',
                                objectFit: 'contain',
                            }}
                        />

                        <div
                            style={{
                                fontFamily: "'Caveat', cursive",
                                fontSize: '1.2rem',
                                color: '#4a6fa5',
                                textDecoration: 'underline',
                                textDecorationColor: '#e87c7c',
                                textUnderlineOffset: '4px',
                                textDecorationStyle: 'wavy',
                            }}
                        >
                            Digital Communication
                        </div>

                        <button
                            onClick={() => router.push('/assessment?sector=DC')}
                            style={{
                                width: '100%',
                                maxWidth: '220px',
                                padding: '0.75rem',
                                background: '#f5f0eb',
                                border: '2px solid #2c2927',
                                borderRadius: '999px',
                                fontSize: '0.9rem',
                                fontWeight: 600,
                                cursor: 'pointer',
                                transition: 'all 0.2s ease',
                            }}
                            onMouseEnter={(e) => {
                                e.currentTarget.style.background = '#2c2927'
                                e.currentTarget.style.color = '#fff'
                            }}
                            onMouseLeave={(e) => {
                                e.currentTarget.style.background = '#f5f0eb'
                                e.currentTarget.style.color = '#2c2927'
                            }}
                        >
                            START
                        </button>
                    </div>
                </div>
            </div>
        </main>
    )
}