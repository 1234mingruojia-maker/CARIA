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
  // --- กลุ่ม DT (Digital Technology) ---
  { id: 'DT01', sector: 'DT', title: 'Web & Application Developer', desc: 'พัฒนาและดูแลเว็บไซต์รวมถึงเว็บแอปพลิเคชันให้ทำงานได้อย่างมีประสิทธิภาพ', tags: ['Frontend', 'Backend', 'Full-Stack', 'JavaScript'] },
  { id: 'DT02', sector: 'DT', title: 'Mobile Application Developer', desc: 'ออกแบบและเขียนโปรแกรมสำหรับแอปพลิเคชันบนสมาร์ตโฟนระบบ iOS และ Android', tags: ['iOS', 'Android', 'Flutter', 'React Native'] },
  { id: 'DT03', sector: 'DT', title: 'Enterprise Software Professional', desc: 'พัฒนาและดูแลระบบซอฟต์แวร์ขนาดใหญ่ที่ใช้ในองค์กรและธุรกิจ', tags: ['ERP', 'Java', 'Cloud Architecture', 'DevOps'] },
  { id: 'DT04', sector: 'DT', title: 'Data Handling Professional', desc: 'จัดการ บริหาร และจัดเก็บฐานข้อมูลขนาดใหญ่ให้ปลอดภัยและพร้อมใช้งาน', tags: ['SQL', 'Database', 'Big Data', 'Data Engineer'] },
  { id: 'DT05', sector: 'DT', title: 'Data Science Professional', desc: 'วิเคราะห์ข้อมูลขั้นสูงและสร้างโมเดลพยากรณ์เพื่อตอบโจทย์ทางธุรกิจ', tags: ['Machine Learning', 'Python', 'AI', 'Statistics'] },
  { id: 'DT06', sector: 'DT', title: 'Cloud Technology Professional', desc: 'ออกแบบและดูแลโครงสร้างพื้นฐานระบบคลาวด์ขององค์กร', tags: ['AWS', 'Azure', 'GCP', 'Kubernetes'] },

  // --- กลุ่ม DC (Digital Content) ---
  { id: 'DC01', sector: 'DC', title: 'Visual Designer', desc: 'ออกแบบงานกราฟิกและโครงสร้างภาพเพื่อสื่อสารอัตลักษณ์ของแบรนด์', tags: ['Graphic', 'Branding', 'Photoshop', 'Illustrator'] },
  { id: 'DC02', sector: 'DC', title: 'Content Creator', desc: 'คิดค้นและสร้างสรรค์เนื้อหาในรูปแบบบทความ วิดีโอ หรือโพสต์บนโซเชียลมีเดีย', tags: ['Copywriting', 'Storytelling', 'Social Media', 'Creative'] },
  { id: 'DC03', sector: 'DC', title: 'Animation Specialist', desc: 'สร้างสรรค์ภาพเคลื่อนไหว 2D และ 3D สำหรับสื่อบันเทิง ภาพยนตร์ และโฆษณา', tags: ['2D/3D Animation', 'After Effects', 'Maya', 'Blender'] },
  { id: 'DC04', sector: 'DC', title: 'Digital Video Professional', desc: 'ถ่ายทำและตัดต่อวิดีโอรวมถึงการทำโพรดักชันสำหรับแพลตฟอร์มออนไลน์', tags: ['Video Editing', 'Premiere Pro', 'Production', 'Color Grading'] },
  { id: 'DC05', sector: 'DC', title: 'Computer Games Professional', desc: 'ออกแบบและพัฒนาเกม คอมพิวเตอร์กราฟิกเกม หรือการเขียนโค้ดระบบเกม', tags: ['Game Design', 'Unity', 'Unreal Engine', 'C#'] },
  { id: 'DC06', sector: 'DC', title: 'Digital Media Planning Professional', desc: 'วางแผน สื่อสาร และยิงโฆษณาออนไลน์บนแพลตฟอร์มดิจิทัลให้ตรงกลุ่มเป้าหมาย', tags: ['Media Planning', 'Facebook Ads', 'Google Ads', 'ROI'] },
  { id: 'DC07', sector: 'DC', title: 'Real-time Content & Live Specialist', desc: 'จัดการและสร้างสรรค์เนื้อหาประเภทถ่ายทอดสดหรือกิจกรรมออนไลน์แบบทันท่วงที', tags: ['Live Streaming', 'OBS', 'Engagement', 'Real-time Marketing'] },
  { id: 'DC08', sector: 'DC', title: 'Mobile Application Content & UI Specialist', desc: 'ออกแบบประสบการณ์และเนื้อหาที่เหมาะสมสำหรับผู้ใช้งานบนโมบายแอปพลิเคชัน', tags: ['UX/UI', 'Figma', 'User Research', 'Wireframing'] },
  { id: 'DC09', sector: 'DC', title: 'Digital Media Research Professional', desc: 'วิเคราะห์พฤติกรรมผู้บริโภคและวิจัยแนวโน้มของสื่อดิจิทัลเพื่อนำมาวางกลยุทธ์', tags: ['Market Research', 'Data Analytics', 'Consumer Insight', 'SEO/SEM'] },
]

const CAREER_PIC: Record<string, string> = {
  'DT01': '/DT/Web-Application.png',
  'DT02': '/DT/mobile-application.png',
  'DT03': '/DT/Enterprise-Software-Professionals.png',
  'DT04': '/DT/Data-Handling-Professionals.png',
  'DT05': '/DT/Data-Science-Professionals.png',
  'DT06': '/DT/Cloud-Technology-Professionals.png',
  'DC01': '/DC/Visual.png',
  'DC02': '/DC/Content.png',
  'DC03': '/DC/Animation.png',
  'DC04': '/DC/Digital-Video-Professionals.png',
  'DC05': '/DC/Computer-Games-Professional.png',
  'DC06': '/DC/Digital-Media-Planning-Professionals.png',
  'DC07': '/DC/Real-time.png',
  'DC08': '/DC/Mobile-Application-Professionals.png',
  'DC09': '/DC/Digital-Media-Research-Professionals.png',
}

export default function Home() {
  const router = useRouter()

  return (
    <>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Caveat:wght=500;700&family=Noto+Sans+Thai:wght@300;400;500;600&display=swap');

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

        <TabNav />

        <div style={{ padding: '1.5rem 1rem 4rem', maxWidth: 480, margin: '0 auto' }}>

          {/* Hero — แบ่งเป็น 2 ฝั่ง: ฝั่งซ้ายคือโลโก้ ฝั่งขวาคือคำอธิบายเว็บ */}
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem', marginBottom: '1.5rem', alignItems: 'center' }}>
            {/* ฝั่งซ้าย: โลโก้ WhatJob */}
            
              <img
                src="/pic/WhatJob.png"
                alt="WhatJob Logo"
                style={{
                  width: '100%',
                  height: '100%',
                  objectFit: 'cover',
                }}
              />
    

            {/* ฝั่งขวา: กล่องคำอธิบายเกี่ยวกับเว็บไซต์ */}
            <div style={{
              display: 'flex',
              flexDirection: 'column',
              justifyContent: 'center',
              padding: '0.85rem 1rem',
              borderRadius: '12px',
              height: 120,
              boxShadow: '0 4px 12px rgba(44,41,39,0.05)',
              border: '1px solid #5a5550',
              boxSizing: 'border-box'
            }}>
              
              <p style={{
                fontSize: '0.85rem',
                color: '#5a5550',
                margin: 0,
                lineHeight: 1.5,
                fontWeight: 500
              }}>
                เว็บไซค์ทำแบบทดสอบเพื่อค้นหาอาชีพที่ใช่และเหมาะสมที่สุดตามทักษะและความสามารถของคุณ
              </p>
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
                const imgUrl = CAREER_PIC[c.id] || '/placeholder.png'

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
                    {/* กล่องครอบรูปภาพ */}
                    <div style={{
                      width: '100%',
                      height: 100,
                      background: 'rgba(255,255,255,0.4)',
                      borderRadius: '8px',
                      overflow: 'hidden',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      padding: '4px'
                    }}>
                      <img
                        src={imgUrl}
                        alt={c.title}
                        style={{
                          width: '100%',
                          height: '100%',
                          objectFit: 'contain'
                        }}
                      />
                    </div>

                    <div style={{ fontSize: '0.75rem', fontWeight: 700, color: isDT ? '#1e3a6e' : '#7a1e3a', lineHeight: 1.3, minHeight: '2rem', display: 'flex', alignItems: 'center' }}>{c.title}</div>
                    <div style={{ fontSize: '0.65rem', color: isDT ? '#2c4070' : '#5a1a30', lineHeight: 1.55, flexGrow: 1 }}>{c.desc}</div>
                    <div style={{ display: 'flex', flexWrap: 'wrap', gap: 3, marginTop: 'auto' }}>
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