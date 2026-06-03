'use client'

import { useRouter, usePathname } from 'next/navigation'

const NAV_TABS = [
    { key: 'home', label: 'หน้าหลัก', path: '/' },
    { key: 'assessment', label: 'แบบทดสอบ', path: '/assessment/select' },
    { key: 'result', label: 'สรุปผล', path: '/result' },
    { key: 'profile', label: 'โปรไฟล์', path: '/profile' },
]

export default function TabNav() {
    const router = useRouter()
    const pathname = usePathname()

    return (
        <div
            style={{
                width: '100%',
                background: '#F0DC62',
                display: 'flex',
                alignItems: 'flex-end',
                paddingLeft: '0.75rem',
                position: 'sticky',
                top: 0,
                zIndex: 100,
                height: 44,
            }}
        >
            {NAV_TABS.map((tab) => {
                const isActive =
                    tab.path === '/'
                        ? pathname === '/'
                        : pathname.startsWith(tab.path)

                return (
                    <button
                        key={tab.key}
                        onClick={() => router.push(tab.path)}
                        style={{
                            background: isActive ? '#ececec' : '#ececec',
                            border: 'none',
                            cursor: 'pointer',
                            padding: '0',
                            width: 'calc(25% - 0.5rem)',
                            fontFamily: "'Noto Sans Thai', sans-serif",
                            fontSize: '1rem',
                            color: '#2c2927',
                            clipPath:
                                'polygon(0% 100%, 10px 25%, 13px 12%, 18px 4%, 24px 0%, calc(100% - 24px) 0%, calc(100% - 18px) 4%, calc(100% - 13px) 12%, calc(100% - 10px) 25%, 100% 100%)',
                            borderRadius: '12px 12px 0 0',
                            marginRight: '0px',
                            opacity: isActive ? 1 : 0.6,
                            fontWeight: isActive ? 700 : 400,
                            transition: 'all 0.2s ease',
                            height: isActive ? 38 : 34,
                            position: 'relative',
                            zIndex: isActive ? 2 : 1,
                            boxShadow: isActive
                                ? '0 -2px 8px rgba(0,0,0,0.12)'
                                : 'none',
                        }}
                    >
                        {tab.label}
                    </button>
                )
            })}
        </div>
    )
}