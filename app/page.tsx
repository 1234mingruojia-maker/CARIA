'use client'
import { useRouter } from 'next/navigation'
import TabNav from '../components/TabNav'

const STATS = [
  { value: '177K', label: 'แบบทดสอบ' },
  { value: '21M', label: 'การทดสอบ\nในประเทศไทย' },
  { value: '1,223M', label: 'จำนวนการ\nทดสอบทั้งหมด' },
  { value: '91.2%', label: 'การให้คะแนน\nใช้งานเว็บไซต์' },
]

const CAREERS = [
  { sector: 'DT', title: 'Software Developer / Engineer', desc: 'พัฒนาแอปพลิเคชัน เว็บไซต์ และระบบซอฟต์แวร์', tags: ['Frontend', 'Backend', 'Full-Stack', 'Mobile'] },
  { sector: 'DC', title: 'Digital Marketing Specialist', desc: 'วางแผนและดำเนินกลยุทธ์การตลาดออนไลน์', tags: ['SEO/SEM', 'Social Media', 'Analytics', 'Content'] },
  { sector: 'DT', title: 'Data Scientist / Data Analyst', desc: 'วิเคราะห์ข้อมูลขนาดใหญ่ สร้างโมเดล ML', tags: ['Machine Learning', 'SQL', 'Python', 'Visualization'] },
  { sector: 'DC', title: 'Content Creator / Strategist', desc: 'สร้างและวางแผนเนื้อหาดิจิทัลที่ดึงดูดกลุ่มเป้าหมาย', tags: ['Video Production', 'Copywriting', 'Storytelling'] },
  { sector: 'DT', title: 'UX/UI Designer', desc: 'ออกแบบประสบการณ์ผู้ใช้และอินเทอร์เฟซ', tags: ['Figma', 'User Research', 'Prototyping', 'Design System'] },
  { sector: 'DC', title: 'Graphic / Motion Designer', desc: 'สร้างสรรค์งานภาพและ Motion Graphic สำหรับสื่อดิจิทัล', tags: ['Adobe Suite', 'After Effects', 'Branding', 'Animation'] },
]

export default function Home() {
  const router = useRouter()

  return (
    <>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Caveat:wght@500;700&family=Noto+Sans+Thai:wght@300;400;500;600&display=swap');

        .hero-img-box {
          transition: transform 0.22s ease, box-shadow 0.22s ease;
        }
        .hero-img-box:hover {
          transform: translateY(-4px) scale(1.02);
          box-shadow: 0 10px 24px rgba(44,41,39,0.15);
        }

        .btn-assessment {
          transition: opacity 0.15s, transform 0.18s ease, box-shadow 0.18s ease !important;
        }
        .btn-assessment:hover {
          opacity: 0.85;
          transform: translateY(-2px);
          box-shadow: 0 6px 16px rgba(44,41,39,0.18);
        }
        .btn-assessment:active {
          transform: scale(0.96);
          box-shadow: none;
        }

        .stat-folder {
          transition: transform 0.2s ease;
          cursor: default;
        }
        .stat-folder:hover {
          transform: translateY(-5px);
        }
        .stat-body {
          transition: box-shadow 0.2s ease;
        }
        .stat-folder:hover .stat-body {
          box-shadow: 0 8px 20px rgba(44,41,39,0.18) !important;
        }

        .career-card {
          transition: transform 0.22s ease, box-shadow 0.22s ease;
          cursor: pointer;
        }
        .career-card:hover {
          transform: translateY(-5px) scale(1.02);
          box-shadow: 0 10px 28px rgba(44,41,39,0.16);
        }
        .career-card:active {
          transform: scale(0.98);
        }
      `}</style>

      <main style={{ minHeight: '100vh', background: '#ececec', fontFamily: "'Noto Sans Thai', sans-serif" }}>

       
        <TabNav/>

        <div style={{ padding: '1.5rem 1rem 4rem', maxWidth: 480, margin: '0 auto' }}>

          {/* Hero — 2 placeholder boxes */}
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '0.75rem', marginBottom: '1.25rem' }}>
            <div className="hero-img-box" style={{ height: 120, background: '#d3d3d3', borderRadius: '8px', overflow: 'hidden' }}>
              {/* ใส่รูป DT ภายหลัง */}
            </div>
            <div className="hero-img-box" style={{ height: 120, background: '#d3d3d3', borderRadius: '8px', overflow: 'hidden' }}>
              {/* ใส่รูป DC ภายหลัง */}
            </div>
          </div>

          {/* ปุ่มทำแบบทดสอบ */}
          <div style={{ marginBottom: '1.75rem' }}>
            <button
              className="btn-assessment"
              onClick={() => router.push('/assessment/select')}
              style={{
                background: '#e8e2db',
                border: '2px solid #1b1b1a75',
                borderRadius: '10px',
                padding: '0.1rem 1.5rem',
                fontSize: '0.9rem',
                cursor: 'pointer',
                color: '#070707',
                fontFamily: "'Noto Sans Thai', sans-serif",
              }}
            >ทำแบบทดสอบ</button>
          </div>

          {/* Stats — folder shape */}
          <div style={{ display: 'flex', gap: '0.6rem', marginBottom: '2rem' }}>
            {STATS.map((s) => (
              <div key={s.value} className="stat-folder" style={{ flex: 1, display: 'flex', flexDirection: 'column' }}>
                {/* folder tab */}
                <div style={{
                  height: 10,
                  background: '#b8926a',
                  borderRadius: '6px 6px 0 0',
                  width: '55%',
                }} />
                {/* folder body */}
                <div className="stat-body" style={{
                  background: '#c9a98a',
                  borderRadius: '0 6px 8px 8px',
                  padding: '0.65rem 0.5rem 0.6rem',
                  display: 'flex',
                  flexDirection: 'column',
                  alignItems: 'center',
                  gap: '0.25rem',
                  flex: 1,
                  boxShadow: '0 2px 6px rgba(44,41,39,0.1)',
                }}>
                  <div style={{ fontFamily: "'Caveat', cursive", fontSize: '1.15rem', fontWeight: 700, color: '#2c2927', lineHeight: 1 }}>{s.value}</div>
                  <div style={{ fontSize: '0.58rem', color: '#5a4535', lineHeight: 1.45, textAlign: 'center', whiteSpace: 'pre-line' }}>{s.label}</div>
                </div>
              </div>
            ))}
          </div>

          {/* Careers Grid */}
          <div>
            <h2 style={{
              fontFamily: "'Caveat', cursive",
              fontSize: '1.25rem',
              color: '#2c2927',
              marginBottom: '1rem',
            }}>ประเภทอาชีพ</h2>

            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '0.75rem' }}>
              {CAREERS.map((c, i) => {
                const isDT = c.sector === 'DT'
                return (
                  <div key={i} className="career-card" style={{
                    background: isDT ? '#a8b8d8' : '#e8b4c0',
                    borderRadius: '14px',
                    padding: '1rem 0.85rem',
                    display: 'flex',
                    flexDirection: 'column',
                    gap: '0.5rem',
                    border: isDT ? '0.5px solid #8aaace' : '0.5px solid #d898a8',
                  }}>
                    <div style={{
                      width: '100%', height: 90,
                      background: 'rgba(255,255,255,0.3)',
                      borderRadius: '8px',
                      display: 'flex', alignItems: 'center', justifyContent: 'center',
                    }}>
                      <svg width="28" height="28" viewBox="0 0 24 24" fill="none" opacity={0.4}>
                        <rect x="3" y="3" width="18" height="18" rx="3" stroke={isDT ? '#1e3a6e' : '#7a1e3a'} strokeWidth="1.5" />
                        <circle cx="8.5" cy="8.5" r="1.5" fill={isDT ? '#1e3a6e' : '#7a1e3a'} />
                        <path d="M3 16l5-5 4 4 3-3 6 6" stroke={isDT ? '#1e3a6e' : '#7a1e3a'} strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
                      </svg>
                    </div>
                    <div style={{ fontSize: '0.75rem', fontWeight: 700, color: isDT ? '#1e3a6e' : '#7a1e3a', lineHeight: 1.3 }}>{c.title}</div>
                    <div style={{ fontSize: '0.65rem', color: isDT ? '#2c4070' : '#5a1a30', lineHeight: 1.55 }}>{c.desc}</div>
                    <div style={{ display: 'flex', flexWrap: 'wrap', gap: 3 }}>
                      {c.tags.slice(0, 3).map(t => (
                        <span key={t} style={{
                          fontSize: '0.55rem',
                          background: 'rgba(255,255,255,0.45)',
                          color: isDT ? '#1e3a6e' : '#7a1e3a',
                          padding: '2px 6px',
                          borderRadius: '999px',
                        }}>{t}</span>
                      ))}
                    </div>
                  </div>
                )
              })}
            </div>
          </div>

        </div>
      </main>
    </>
  )
}