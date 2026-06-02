'use client'
import { useRouter } from 'next/navigation'
import { useState, useEffect } from 'react'
import { supabase } from '@/lib/supabase'
import { signOut } from '@/lib/auth'

const STATS = [
  { value: '177K',   label: 'แบบทดสอบ' },
  { value: '21M',    label: 'การทดสอบ\nในประเทศไทย' },
  { value: '1,223M', label: 'จำนวนการ\nทดสอบทั้งหมด' },
  { value: '91.2%',  label: 'การให้คะแนน\nใช้งานเว็บไซต์' },
]

const CAREERS = [
  { sector: 'DT', title: 'Software Developer / Engineer', desc: 'พัฒนาแอปพลิเคชัน เว็บไซต์ และระบบซอฟต์แวร์ ต้องการทักษะ Programming, Problem-solving และ System Design', tags: ['Frontend', 'Backend', 'Full-Stack', 'Mobile'] },
  { sector: 'DT', title: 'Data Scientist / Data Analyst', desc: 'วิเคราะห์ข้อมูลขนาดใหญ่ สร้างโมเดล ML และแปลงข้อมูลเป็น Insight เพื่อสนับสนุนการตัดสินใจทางธุรกิจ', tags: ['Machine Learning', 'SQL', 'Python', 'Visualization'] },
  { sector: 'DT', title: 'Cybersecurity Specialist', desc: 'ป้องกันระบบและข้อมูลจากการโจมตีทางไซเบอร์ ดูแลความปลอดภัยของโครงสร้างพื้นฐานดิจิทัลขององค์กร', tags: ['Penetration Testing', 'Network Security', 'SOC', 'Cloud'] },
  { sector: 'DT', title: 'UX/UI Designer', desc: 'ออกแบบประสบการณ์ผู้ใช้และอินเทอร์เฟซที่ใช้งานง่าย สวยงาม โดยใช้ข้อมูลและ User Research เป็นพื้นฐาน', tags: ['Figma', 'User Research', 'Prototyping', 'Design System'] },
  { sector: 'DT', title: 'Cloud / DevOps Engineer', desc: 'บริหารจัดการโครงสร้างพื้นฐานคลาวด์ สร้าง CI/CD Pipeline และทำให้การ Deploy ซอฟต์แวร์รวดเร็วและมีเสถียรภาพ', tags: ['AWS', 'Kubernetes', 'Docker', 'Terraform'] },
  { sector: 'DC', title: 'Digital Marketing Specialist', desc: 'วางแผนและดำเนินกลยุทธ์การตลาดออนไลน์ผ่านช่องทางต่างๆ เพื่อเพิ่ม Brand Awareness และยอดขาย', tags: ['SEO/SEM', 'Social Media', 'Analytics', 'Content'] },
  { sector: 'DC', title: 'Content Creator / Strategist', desc: 'สร้างและวางแผนเนื้อหาดิจิทัลที่ดึงดูดกลุ่มเป้าหมาย ตั้งแต่บทความ วิดีโอ ไปจนถึง Podcast', tags: ['Video Production', 'Copywriting', 'Storytelling', 'Social'] },
  { sector: 'DC', title: 'PR & Communications Manager', desc: 'บริหารภาพลักษณ์องค์กรในโลกดิจิทัล สื่อสารกับสื่อมวลชน และจัดการ Crisis Communication', tags: ['Media Relations', 'Brand', 'Crisis Mgmt', 'Press'] },
  { sector: 'DC', title: 'E-Commerce / Business Dev', desc: 'พัฒนาธุรกิจออนไลน์ บริหารแพลตฟอร์ม E-Commerce วิเคราะห์ตลาด และสร้างพันธมิตรทางธุรกิจ', tags: ['Shopee/Lazada', 'Growth Hacking', 'CRM', 'Analytics'] },
  { sector: 'DC', title: 'Graphic / Motion Designer', desc: 'สร้างสรรค์งานภาพและ Motion Graphic สำหรับสื่อดิจิทัล ทั้ง Social Media, โฆษณา และ Branding', tags: ['Adobe Suite', 'After Effects', 'Branding', 'Animation'] },
]

const NAV_TABS = [
  { key: 'home',       label: 'หน้าหลัก',  path: '/' },
  { key: 'id',         label: 'ID CARI',    path: '/id-cari' },
  { key: 'assessment', label: 'แบบทดสอบ',  path: '/assessment' },
  { key: 'result',     label: 'สรุปผล',     path: '/result' },
]

function TabNav({ active, router }: { active: string; router: ReturnType<typeof useRouter> }) {
  return (
    <div style={{
      width: '100%',
      background: '#c9b8ae',
      display: 'flex',
      alignItems: 'flex-end',
      paddingLeft: '2rem',
      position: 'sticky',
      top: 0,
      zIndex: 100,
      height: 48,
    }}>
      {NAV_TABS.map((tab) => {
        const isActive = active === tab.key
        return (
          <button
            key={tab.key}
            onClick={() => router.push(tab.path)}
            style={{
              background: '#f5f0eb',
              border: 'none',
              cursor: 'pointer',
              padding: '0.55rem 0',
              width: `calc(25% - 0.5rem)`,   // ← แบ่งเท่ากัน 4 แท็บ
              fontFamily: "'Noto Sans Thai', sans-serif",
              fontSize: '0.85rem',
              color: '#2c2927',
              clipPath: 'polygon(16px 0%, calc(100% - 16px) 0%, 100% 100%, 0% 100%)',
              marginRight: '-2px',
              opacity: isActive ? 1 : 0.65,
              fontWeight: isActive ? 600 : 400,
              transition: 'opacity 0.15s',
              height: 38,
              position: 'relative',
              zIndex: isActive ? 2 : 1,
            }}
            onMouseEnter={e => { if (!isActive) e.currentTarget.style.opacity = '0.85' }}
            onMouseLeave={e => { if (!isActive) e.currentTarget.style.opacity = '0.65' }}
          >
            {tab.label}
          </button>
        )
      })}
    </div>
  )
}

function StatCards() {
  const [active, setActive] = useState(0)
  const total = STATS.length
  const rotations = [-6, -2, 2, 6]
  const offsets = [{ x: -8, y: 6 }, { x: -3, y: 3 }, { x: 3, y: 0 }, { x: 8, y: -3 }]

  return (
    <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '2rem' }}>
      <div style={{ position: 'relative', width: 200, height: 150 }}>
        {STATS.map((s, i) => {
          const isTop = i === active
          const zIdx = i === active ? total : i
          return (
            <div key={i} onClick={() => setActive(i)} style={{
              position: 'absolute', top: 0, left: 0, width: 180,
              padding: '1.25rem 1.5rem',
              background: '#f5f0eb',
              border: '1px solid #e0dbd4',
              borderRadius: '16px',
              boxShadow: isTop ? '0 8px 24px rgba(44,41,39,0.14)' : '0 2px 8px rgba(44,41,39,0.06)',
              transform: `rotate(${rotations[i]}deg) translate(${offsets[i].x}px, ${offsets[i].y}px) ${isTop ? 'scale(1.04)' : 'scale(1)'}`,
              transition: 'transform 0.3s cubic-bezier(.34,1.56,.64,1), box-shadow 0.3s',
              cursor: 'pointer', zIndex: zIdx,
            }}>
              <div style={{ fontFamily: "'Caveat', cursive", fontSize: '2rem', fontWeight: 700, color: '#2c2927', lineHeight: 1, marginBottom: '0.3rem' }}>{s.value}</div>
              <div style={{ fontSize: '0.72rem', color: '#8a7f78', lineHeight: 1.5, fontFamily: "'Noto Sans Thai', sans-serif", whiteSpace: 'pre-line' }}>{s.label}</div>
            </div>
          )
        })}
      </div>
      <div style={{ display: 'flex', gap: 6, marginTop: 60 }}>
        {STATS.map((_, i) => (
          <div key={i} onClick={() => setActive(i)} style={{ width: i === active ? 18 : 6, height: 6, borderRadius: 3, background: i === active ? '#2c2927' : '#ccc', cursor: 'pointer', transition: 'all 0.3s' }} />
        ))}
      </div>
    </div>
  )
}

function CareerCarousel() {
  const [page, setPage] = useState(0)
  const perPage = 3
  const maxPage = Math.ceil(CAREERS.length / perPage) - 1
  const visible = CAREERS.slice(page * perPage, page * perPage + perPage)
  const sectorColor = (s: string) => s === 'DT' ? '#3a5ca8' : '#0f6e56'
  const sectorBg = (s: string) => s === 'DT' ? '#e8edf8' : '#e0f2ec'

  return (
    <div style={{ width: '100%' }}>
      <div style={{ display: 'flex', gap: '1rem', marginBottom: '1.25rem', flexWrap: 'wrap' }}>
        {visible.map((c, i) => (
          <div key={i} style={{ flex: '1 1 260px', background: '#fff', border: '0.5px solid #e0dbd6', borderRadius: '16px', padding: '1.25rem', boxShadow: '0 2px 10px rgba(44,41,39,0.05)' }}>
            <span style={{ display: 'inline-block', background: sectorBg(c.sector), color: sectorColor(c.sector), fontSize: '0.65rem', fontWeight: 700, padding: '2px 10px', borderRadius: '999px', marginBottom: '0.6rem', letterSpacing: '0.04em' }}>
              {c.sector === 'DT' ? 'Digital Technology' : 'Digital Communication'}
            </span>
            <h3 style={{ fontSize: '0.92rem', fontWeight: 700, color: '#2c2927', margin: '0 0 0.5rem', lineHeight: 1.3 }}>{c.title}</h3>
            <p style={{ fontSize: '0.76rem', color: '#7a7068', lineHeight: 1.65, margin: '0 0 0.75rem' }}>{c.desc}</p>
            <div style={{ display: 'flex', flexWrap: 'wrap', gap: 4 }}>
              {c.tags.map(t => (
                <span key={t} style={{ fontSize: '0.65rem', background: '#f0ebe6', color: '#5f5e5a', padding: '2px 8px', borderRadius: '999px', border: '0.5px solid #ddd8d2' }}>{t}</span>
              ))}
            </div>
          </div>
        ))}
      </div>
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '1rem' }}>
        <button onClick={() => setPage(p => Math.max(0, p - 1))} disabled={page === 0} style={{ width: 36, height: 36, borderRadius: '50%', border: '1.5px solid #2c2927', background: page === 0 ? '#f0ebe6' : '#2c2927', color: page === 0 ? '#ccc' : '#f5f0eb', cursor: page === 0 ? 'default' : 'pointer', fontSize: '1rem', display: 'flex', alignItems: 'center', justifyContent: 'center', transition: 'all 0.2s' }}>←</button>
        <span style={{ fontSize: '0.78rem', color: '#8a7f78' }}>{page + 1} / {maxPage + 1}</span>
        <button onClick={() => setPage(p => Math.min(maxPage, p + 1))} disabled={page === maxPage} style={{ width: 36, height: 36, borderRadius: '50%', border: '1.5px solid #2c2927', background: page === maxPage ? '#f0ebe6' : '#2c2927', color: page === maxPage ? '#ccc' : '#f5f0eb', cursor: page === maxPage ? 'default' : 'pointer', fontSize: '1rem', display: 'flex', alignItems: 'center', justifyContent: 'center', transition: 'all 0.2s' }}>→</button>
      </div>
    </div>
  )
}

function UserMenu({ onSignOut, router }: { onSignOut: () => void; router: ReturnType<typeof useRouter> }) {
  const [open, setOpen] = useState(false)

  return (
    <div style={{ position: 'relative' }}>
      <button
        onClick={() => setOpen(o => !o)}
        style={{
          width: 36, height: 36, borderRadius: '50%',
          background: '#2c2927', border: 'none',
          cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center',
          boxShadow: '0 2px 8px rgba(44,41,39,0.2)',
          transition: 'opacity 0.15s',
        }}
        onMouseEnter={e => (e.currentTarget.style.opacity = '0.85')}
        onMouseLeave={e => (e.currentTarget.style.opacity = '1')}
      >
        <svg width="18" height="18" viewBox="0 0 24 24" fill="none">
          <circle cx="12" cy="8" r="4" fill="#f5f0eb"/>
          <path d="M4 20c0-4 3.6-7 8-7s8 3 8 7" stroke="#f5f0eb" strokeWidth="2" strokeLinecap="round"/>
        </svg>
      </button>

      {open && (
        <>
          <div onClick={() => setOpen(false)} style={{ position: 'fixed', inset: 0, zIndex: 200 }} />
          <div style={{
            position: 'absolute', top: 'calc(100% + 8px)', right: 0,
            background: '#fff', border: '0.5px solid #e0dbd4',
            borderRadius: '14px', padding: '0.4rem',
            boxShadow: '0 8px 24px rgba(44,41,39,0.12)',
            minWidth: 160, zIndex: 201,
          }}>
            <button
              onClick={() => { setOpen(false); router.push('/profile') }}
              style={{ width: '100%', textAlign: 'left', background: 'none', border: 'none', padding: '0.55rem 0.9rem', borderRadius: '10px', fontSize: '0.82rem', color: '#2c2927', cursor: 'pointer', fontFamily: "'Noto Sans Thai', sans-serif", display: 'flex', alignItems: 'center', gap: '0.5rem' }}
              onMouseEnter={e => (e.currentTarget.style.background = '#f5f0eb')}
              onMouseLeave={e => (e.currentTarget.style.background = 'none')}
            >
              <svg width="14" height="14" viewBox="0 0 24 24" fill="none"><circle cx="12" cy="8" r="4" stroke="#2c2927" strokeWidth="2"/><path d="M4 20c0-4 3.6-7 8-7s8 3 8 7" stroke="#2c2927" strokeWidth="2" strokeLinecap="round"/></svg>
              โปรไฟล์
            </button>
            <div style={{ height: '0.5px', background: '#e0dbd4', margin: '0.3rem 0.5rem' }} />
            <button
              onClick={() => { setOpen(false); onSignOut() }}
              style={{ width: '100%', textAlign: 'left', background: 'none', border: 'none', padding: '0.55rem 0.9rem', borderRadius: '10px', fontSize: '0.82rem', color: '#c0392b', cursor: 'pointer', fontFamily: "'Noto Sans Thai', sans-serif", display: 'flex', alignItems: 'center', gap: '0.5rem' }}
              onMouseEnter={e => (e.currentTarget.style.background = '#fdf0ee')}
              onMouseLeave={e => (e.currentTarget.style.background = 'none')}
            >
              <svg width="14" height="14" viewBox="0 0 24 24" fill="none"><path d="M15 3h4a2 2 0 0 1 2 2v14a2 2 0 0 1-2 2h-4M10 17l5-5-5-5M15 12H3" stroke="#c0392b" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/></svg>
              ออกจากระบบ
            </button>
          </div>
        </>
      )}
    </div>
  )
}

export default function Home() {
  const router = useRouter()
  const [user, setUser] = useState<any>(null)
  const [loadingAuth, setLoadingAuth] = useState(true)

  useEffect(() => {
    supabase.auth.getSession().then(({ data }) => {
      setUser(data.session?.user ?? null)
      setLoadingAuth(false)
    })
    const { data: listener } = supabase.auth.onAuthStateChange((_e, session) => {
      setUser(session?.user ?? null)
    })
    return () => listener.subscription.unsubscribe()
  }, [])

  async function handleSignOut() {
    await signOut()
    setUser(null)
  }

  return (
    <main style={{ minHeight: '100vh', background: '#f5f0eb', fontFamily: "'Noto Sans Thai', sans-serif" }}>

      {/* Topbar with logo + auth */}
<div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '1rem 2rem 0.5rem' }}>
  ...        <div style={{ background: '#2c2927', borderRadius: '999px', padding: '0.4rem 1.75rem', fontFamily: "'Caveat', cursive", fontSize: '1.1rem', color: '#f5f0eb', letterSpacing: '1px', boxShadow: '0 2px 12px rgba(44,41,39,0.18)' }}>CARIA↗</div>

        {!loadingAuth && (
          user ? (
            <UserMenu onSignOut={handleSignOut} router={router} />
          ) : (
            <div style={{ display: 'flex', gap: '0.5rem' }}>
              <button
                onClick={() => router.push('/login')}
                style={{ background: 'transparent', border: '1.5px solid #2c2927', borderRadius: '999px', padding: '0.35rem 1.25rem', fontSize: '0.8rem', cursor: 'pointer', color: '#2c2927', fontFamily: "'Noto Sans Thai', sans-serif", transition: 'background 0.15s' }}
                onMouseEnter={e => (e.currentTarget.style.background = '#e8e3de')}
                onMouseLeave={e => (e.currentTarget.style.background = 'transparent')}
              >เข้าสู่ระบบ</button>
              <button
                onClick={() => router.push('/register')}
                style={{ background: '#2c2927', border: '1.5px solid #2c2927', borderRadius: '999px', padding: '0.35rem 1.25rem', fontSize: '0.8rem', cursor: 'pointer', color: '#f5f0eb', fontFamily: "'Noto Sans Thai', sans-serif", transition: 'opacity 0.15s' }}
                onMouseEnter={e => (e.currentTarget.style.opacity = '0.85')}
                onMouseLeave={e => (e.currentTarget.style.opacity = '1')}
              >สมัครสมาชิก</button>
            </div>
          )
        )}
      </div>

      {/* Tab Navigation */}
      <TabNav active="home" router={router} />

      <div style={{ maxWidth: 860, margin: '0 auto', padding: '2rem 1.5rem 4rem' }}>

        {/* Hero */}
        <div style={{ display: 'flex', gap: '2.5rem', justifyContent: 'center', marginBottom: '4rem', flexWrap: 'wrap' }}>
          {[
            { sector: 'DT', label: 'Digital Technology', color: '#3a5ca8', svg: <DTAvatar /> },
            { sector: 'DC', label: 'Digital Communication', color: '#0f6e56', svg: <DCAvatar /> },
          ].map(({ sector, label, color, svg }) => (
            <div key={sector} style={{ background: '#f5f0eb', borderRadius: '20px', padding: '2rem 1.5rem 1.5rem', display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '1.2rem', width: 200, boxShadow: '0 2px 12px rgba(44,41,39,0.06)', border: '0.5px solid #e0dbd4' }}>
              <div style={{ width: 100, height: 110 }}>{svg}</div>
              <div style={{ fontFamily: "'Caveat',cursive", fontSize: '1.1rem', color, textAlign: 'center', lineHeight: 1.3 }}>{label}</div>
              <button
                onClick={() => router.push(`/assessment?sector=${sector}`)}
                style={{ background: 'transparent', border: '1.5px solid #2c2927', borderRadius: '999px', padding: '0.4rem 2rem', fontSize: '0.875rem', cursor: 'pointer', color: '#2c2927', fontFamily: "'Noto Sans Thai', sans-serif", width: '100%', transition: 'background 0.15s' }}
                onMouseEnter={e => (e.currentTarget.style.background = '#e8e3de')}
                onMouseLeave={e => (e.currentTarget.style.background = 'transparent')}
              >START</button>
            </div>
          ))}
        </div>

        {/* Stats */}
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '3rem', marginBottom: '5rem', flexWrap: 'wrap' }}>
          <StatCards />
          <div style={{ maxWidth: 280 }}>
            <p style={{ fontFamily: "'Caveat', cursive", fontSize: '1.5rem', color: '#2c2927', lineHeight: 1.5, margin: 0 }}>ข้อมูลจากผู้ใช้จริง<br />ทั่วประเทศไทย</p>
            <p style={{ fontSize: '0.82rem', color: '#8a7f78', lineHeight: 1.7, marginTop: '0.75rem' }}>CARIA ช่วยให้คนไทยกว่าหลักล้านค้นพบเส้นทางอาชีพดิจิทัลที่เหมาะสมกับตัวเอง ผ่านแบบทดสอบที่ออกแบบโดยผู้เชี่ยวชาญ</p>
          </div>
        </div>

        {/* Careers */}
        <div>
          <h2 style={{ fontFamily: "'Caveat', cursive", fontSize: '2rem', color: '#2c2927', textAlign: 'center', margin: '0 0 0.5rem' }}>ประเภทอาชีพหน้านี้</h2>
          <p style={{ textAlign: 'center', fontSize: '0.82rem', color: '#8a7f78', margin: '0 0 2rem' }}>อาชีพในสายดิจิทัลที่กำลังเป็นที่ต้องการในตลาดแรงงานไทยและทั่วโลก</p>
          <CareerCarousel />
        </div>

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