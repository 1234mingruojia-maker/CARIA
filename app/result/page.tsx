'use client'
import { Suspense, useEffect, useState } from 'react'
import { useRouter } from 'next/navigation'
import Image from 'next/image'
import TabNav from '../../components/TabNav'
import { createClient } from '@supabase/supabase-js'

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
)

type Career = {
  careerId: string
  name: string
  sector: string
  mesScore: number
  topGaps: Record<string, number>
  allGaps?: Record<string, number>
}

type Theme = {
  accent: string
  accentLight: string
  accentMid: string
  accentText: string
  radarFill: string
  radarStroke: string
  checkBg: string
  badgeBg: string
  badgeText: string
  gridLine: string
  sectionBg: string
  cardBg: string
  headerAccent: string
  btnGapBg: string
  btnGapColor: string
}

const THEMES: Record<string, Theme> = {
  DT: {
    accent: '#4a6fc4',
    accentLight: '#eef2ff',
    accentMid: '#d6e0f8',
    accentText: '#3a5db0',
    radarFill: 'rgba(74,111,196,0.20)',
    radarStroke: '#4a6fc4',
    checkBg: '#4a6fc4',
    badgeBg: '#eef2ff',
    badgeText: '#3a5db0',
    gridLine: '#c8d8ec',
    sectionBg: '#f4f6ff',
    cardBg: 'linear-gradient(160deg, #dce5f8 0%, #eee8f8 100%)',
    headerAccent: '#4a6fc4',
    btnGapBg: '#4a6fc4',
    btnGapColor: 'white',
  },
  DC: {
    accent: '#e06080',
    accentLight: '#fff0f4',
    accentMid: '#fad6e0',
    accentText: '#c04060',
    radarFill: 'rgba(224,96,128,0.20)',
    radarStroke: '#e06080',
    checkBg: '#e06080',
    badgeBg: '#fff0f4',
    badgeText: '#c04060',
    gridLine: '#f0c0cc',
    sectionBg: '#fff5f7',
    cardBg: 'linear-gradient(160deg, #fad6e0 0%, #ffe8f0 100%)',
    headerAccent: '#e06080',
    btnGapBg: '#e06080',
    btnGapColor: 'white',
  },
}

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

function getCareerPic(careerId: string, sector: string): string {
  return CAREER_PIC[careerId] ?? (sector === 'DC' ? '/pic/DC.png' : '/pic/DT.png')
}

export const COL_LABEL: Record<string, string> = {
  s_active_learning: 'การเรียนรู้เชิงรุก',
  s_active_listening: 'การฟังเชิงรุก',
  s_complex_problem_solving: 'การแก้ปัญหาซับซ้อน',
  s_coordination: 'การประสานงาน',
  s_critical_thinking: 'การคิดวิเคราะห์',
  s_equipment_maintenance: 'การบำรุงรักษาอุปกรณ์',
  s_equipment_selection: 'การเลือกอุปกรณ์',
  s_installation: 'การติดตั้ง',
  s_instructing: 'การสอน',
  s_judgment_and_decision_making: 'การตัดสินใจและวิจารณญาณ',
  s_learning_strategies: 'กลยุทธ์การเรียนรู้',
  s_management_of_financial_resources: 'การจัดการทรัพยากรทางการเงิน',
  s_management_of_material_resources: 'การจัดการทรัพยากรวัสดุ',
  s_management_of_personnel_resources: 'การจัดการทรัพยากรบุคคล',
  s_mathematics: 'คณิตศาสตร์',
  s_monitoring: 'การติดตามตรวจสอบ',
  s_negotiation: 'การเจรจาต่อรอง',
  s_operation_and_control: 'การควบคุมการปฏิบัติงาน',
  s_operations_analysis: 'การวิเคราะห์การดำเนินงาน',
  s_operations_monitoring: 'การตรวจสอบการดำเนินงาน',
  s_persuasion: 'การโน้มน้าว',
  s_programming: 'การเขียนโปรแกรม',
  s_quality_control_analysis: 'การควบคุมคุณภาพ',
  s_reading_comprehension: 'การอ่านเพื่อความเข้าใจ',
  s_repairing: 'การซ่อมแซม',
  s_science: 'วิทยาศาสตร์',
  s_service_orientation: 'การบริการ',
  s_social_perceptiveness: 'การรับรู้ทางสังคม',
  s_speaking: 'การพูด',
  s_systems_analysis: 'การวิเคราะห์ระบบ',
  s_systems_evaluation: 'การประเมินระบบ',
  s_technology_design: 'การออกแบบเทคโนโลยี',
  s_time_management: 'การบริหารเวลา',
  s_troubleshooting: 'การแก้ปัญหาทางเทคนิค',
  s_writing: 'การเขียน',
  k_administration_and_management: 'การบริหารและการจัดการ',
  k_administrative: 'งานธุรการ',
  k_biology: 'ชีววิทยา',
  k_building_and_construction: 'การก่อสร้าง',
  k_chemistry: 'เคมี',
  k_communications_and_media: 'การสื่อสารและสื่อ',
  k_computers_and_electronics: 'คอมพิวเตอร์และอิเล็กทรอนิกส์',
  k_customer_and_personal_service: 'การบริการลูกค้าและบุคคล',
  k_design: 'การออกแบบ',
  k_economics_and_accounting: 'เศรษฐศาสตร์และบัญชี',
  k_education_and_training: 'การศึกษาและการฝึกอบรม',
  k_engineering_and_technology: 'วิศวกรรมและเทคโนโลยี',
  k_english_language: 'ภาษาอังกฤษ',
  k_fine_arts: 'ศิลปกรรม',
  k_food_production: 'การผลิตอาหาร',
  k_foreign_language: 'ภาษาต่างประเทศ',
  k_geography: 'ภูมิศาสตร์',
  k_history_and_archeology: 'ประวัติศาสตร์และโบราณคดี',
  k_law_and_government: 'กฎหมายและการปกครอง',
  k_mathematics: 'คณิตศาสตร์',
  k_mechanical: 'เครื่องกล',
  k_medicine_and_dentistry: 'การแพทย์และทันตกรรม',
  k_personnel_and_human_resources: 'ทรัพยากรบุคคล',
  k_philosophy_and_theology: 'ปรัชญาและศาสนา',
  k_physics: 'ฟิสิกส์',
  k_production_and_processing: 'การผลิตและการแปรรูป',
  k_psychology: 'จิตวิทยา',
  k_public_safety_and_security: 'ความปลอดภัยและความมั่นคงสาธารณะ',
  k_sales_and_marketing: 'การขายและการตลาด',
  k_sociology_and_anthropology: 'สังคมวิทยาและมานุษยวิทยา',
  k_telecommunications: 'โทรคมนาคม',
  k_therapy_and_counseling: 'การบำบัดและการให้คำปรึกษา',
  k_transportation: 'การขนส่ง',
  a_realistic: 'ภาคปฏิบัติ',
  a_investigative: 'นักวิเคราะห์',
  a_artistic: 'ศิลปะสร้างสรรค์',
  a_social: 'สังคมและการช่วยเหลือ',
  a_enterprising: 'ผู้ประกอบการ',
  a_conventional: 'เป็นระบบระเบียบ',
}

function toLabel(col: string): string {
  return COL_LABEL[col] ?? col.replace(/^[ska]_/, '').replace(/_/g, ' ')
}

const SECTOR_ICONS: Record<string, string[]> = {
  DT: ['💻', '🖥️', '⚙️'],
  DC: ['🎨', '✏️', '💡'],
}

// ─── Radar Chart ──────────────────────────────────────────────────────────────
function RadarChart({ gaps, theme }: { gaps: Record<string, number>; theme: Theme }) {
  const entries = Object.entries(gaps)
    .filter(([, v]) => v > 0)
    .sort((a, b) => b[1] - a[1])
    .slice(0, 7)

  const n = entries.length
  if (n < 3) return (
    <div style={{ textAlign: 'center', padding: '1.5rem', color: '#7a82a0', fontSize: '0.78rem' }}>
      ทักษะของคุณตรงกับอาชีพนี้มาก ✨
    </div>
  )

  const cx = 160, cy = 160, r = 75
  const step = (2 * Math.PI) / n
  const maxVal = Math.max(...entries.map(([, v]) => v), 1)

  const pt = (i: number, scale: number) => {
    const a = i * step - Math.PI / 2
    return { x: cx + r * scale * Math.cos(a), y: cy + r * scale * Math.sin(a) }
  }

  const dataPoints = entries.map(([, v], i) => pt(i, v / maxVal))
  const polygon = dataPoints.map(p => `${p.x},${p.y}`).join(' ')
  const grid = (s: number) => entries.map((_, i) => { const p = pt(i, s); return `${p.x},${p.y}` }).join(' ')

  return (
    <div style={{ width: '100%', maxWidth: '420px', margin: '0 auto', overflow: 'visible', padding: '0 25px' }}>
      <svg width="100%" height="100%" viewBox="0 0 320 320" style={{ display: 'block', overflow: 'visible' }}>
        {[0.25, 0.5, 0.75, 1].map(s => (
          <polygon key={s} points={grid(s)} fill="none" stroke={theme.gridLine} strokeWidth="1"
            strokeDasharray={s < 1 ? '3,3' : 'none'} />
        ))}
        {entries.map((_, i) => {
          const o = pt(i, 1)
          return <line key={i} x1={cx} y1={cy} x2={o.x} y2={o.y} stroke={theme.gridLine} strokeWidth="1" />
        })}
        <polygon points={polygon} fill={theme.radarFill} stroke={theme.radarStroke} strokeWidth="2" />
        {dataPoints.map((p, i) => (
          <circle key={i} cx={p.x} cy={p.y} r="3.5" fill={theme.radarStroke} />
        ))}
        {entries.map(([col, val], i) => {
          const angle = i * step - Math.PI / 2
          const cos = Math.cos(angle)
          const sin = Math.sin(angle)
          const label = toLabel(col)
          const lpScale = 1.40
          const lp = { x: cx + r * lpScale * cos, y: cy + r * lpScale * sin }
          const boxWidth = 120
          const boxHeight = 50
          const boxX = lp.x - boxWidth / 2
          const boxY = lp.y - boxHeight / 2

          return (
            <g key={i}>
              <foreignObject x={boxX} y={boxY} width={boxWidth} height={boxHeight} style={{ overflow: 'visible' }}>
                <div style={{
                  width: '100%', height: '100%',
                  display: 'flex', flexDirection: 'column',
                  alignItems: 'center', justifyContent: 'center',
                  textAlign: 'center', lineHeight: '1.2',
                  fontFamily: "'Noto Sans Thai', 'Sarabun', sans-serif",
                }}>
                  <span style={{ fontSize: '10px', fontWeight: '700', color: theme.radarStroke, marginBottom: '2px', display: 'block' }}>
                    {Math.round(val)}
                  </span>
                  <span style={{ fontSize: '8.5px', color: '#5a6480', whiteSpace: 'normal', wordBreak: 'normal', overflowWrap: 'break-word', display: 'block' }}>
                    {label}
                  </span>
                </div>
              </foreignObject>
            </g>
          )
        })}
      </svg>
    </div>
  )
}

// ─── Unlock Banner (guest only) ───────────────────────────────────────────────
function UnlockBanner({ theme, sector }: { theme: Theme; sector: string }) {
  const router = useRouter()
  return (
    <div style={{ maxWidth: 980, margin: '1.25rem auto 0', padding: '0 1.25rem' }}>
      <div style={{
        background: theme.accentLight,
        border: `1.5px dashed ${theme.accent}`,
        borderRadius: '16px',
        padding: '1rem 1.5rem',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-between',
        gap: '1rem',
        flexWrap: 'wrap',
      }}>
        <div>
          <p style={{ margin: 0, fontWeight: 700, fontSize: '0.9rem', color: '#1a1a2e' }}>
            🎯 อยากรู้ว่าต้องพัฒนาทักษะอะไรบ้าง?
          </p>
          <p style={{ margin: '0.25rem 0 0', fontSize: '0.78rem', color: '#5a6480' }}>
            สมัครสมาชิกเพื่อดู Skill Gap Map, คอร์สเรียน และตำแหน่งงานที่เหมาะกับคุณ
          </p>
        </div>
        <div style={{ display: 'flex', gap: '0.75rem', flexWrap: 'wrap' }}>
          <button
            onClick={() => router.push(`/login?redirect=/skills?sector=${sector}`)}
            style={{
              background: 'white', color: theme.accentText,
              border: `1.5px solid ${theme.accent}`,
              borderRadius: '999px', whiteSpace: 'nowrap',
              padding: '0.6rem 1.4rem', fontSize: '0.82rem',
              cursor: 'pointer', fontFamily: "'Noto Sans Thai', sans-serif", fontWeight: 600,
            }}
          >เข้าสู่ระบบ</button>
          <button
            onClick={() => router.push(`/register?redirect=/skills?sector=${sector}`)}
            style={{
              background: theme.btnGapBg, color: theme.btnGapColor,
              border: 'none', borderRadius: '999px', whiteSpace: 'nowrap',
              padding: '0.6rem 1.5rem', fontSize: '0.82rem',
              cursor: 'pointer', fontFamily: "'Noto Sans Thai', sans-serif", fontWeight: 600,
              boxShadow: `0 4px 14px ${theme.accent}44`,
            }}
          >สมัครฟรี →</button>
        </div>
      </div>
    </div>
  )
}

// ─── Feature preview cards (guest only) ──────────────────────────────────────
function LockedFeatures({ theme }: { theme: Theme }) {
  const features = [
    { icon: '🗺️', title: 'Skill Gap Map', desc: 'เห็นภาพชัดว่าทักษะไหนขาด ควรพัฒนาตรงไหนก่อน' },
    { icon: '📚', title: 'คอร์สเรียนแนะนำ', desc: 'คอร์สที่เลือกมาเพื่อปิด gap ของคุณโดยเฉพาะ' },
    { icon: '💼', title: 'ตำแหน่งงานรอคุณอยู่', desc: 'งานที่ match กับโปรไฟล์ของคุณในพื้นที่ใกล้บ้าน' },
  ]
  return (
    <div style={{ maxWidth: 980, margin: '1rem auto 0', padding: '0 1.25rem' }}>
      <p style={{
        textAlign: 'center', fontSize: '0.75rem',
        color: '#9aaccc', marginBottom: '0.75rem',
        fontFamily: "'Noto Sans Thai', sans-serif",
      }}>
        สมาชิกจะได้รับสิทธิ์เพิ่มเติม
      </p>
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3,1fr)', gap: '0.75rem' }}>
        {features.map((f, i) => (
          <div key={i} style={{
            background: 'white',
            borderRadius: '14px',
            padding: '1rem',
            textAlign: 'center',
            border: `1px solid ${theme.accentMid}`,
            position: 'relative',
            overflow: 'hidden',
            opacity: 0.75,
          }}>
            <div style={{
              position: 'absolute', inset: 0,
              backdropFilter: 'blur(1px)',
              background: 'rgba(255,255,255,0.15)',
              display: 'flex', alignItems: 'center', justifyContent: 'center',
            }}>
              <span style={{ fontSize: '1.2rem' }}>🔒</span>
            </div>
            <div style={{ fontSize: '1.5rem', marginBottom: '0.4rem' }}>{f.icon}</div>
            <p style={{ margin: 0, fontWeight: 700, fontSize: '0.8rem', color: '#1a1a2e' }}>{f.title}</p>
            <p style={{ margin: '0.25rem 0 0', fontSize: '0.72rem', color: '#5a6480' }}>{f.desc}</p>
          </div>
        ))}
      </div>
    </div>
  )
}

// ── Main ──────────────────────────────────────────────────────
function ResultContent() {
  const router = useRouter()
  const [recommendations, setRecommendations] = useState<Career[]>([])
  const [sector, setSector] = useState('DT')
  const [loading, setLoading] = useState(true)
  const [isMobile, setIsMobile] = useState(false)
  const [isLoggedIn, setIsLoggedIn] = useState(false)
  const [authChecked, setAuthChecked] = useState(false)

  useEffect(() => {
    const checkSize = () => setIsMobile(window.innerWidth < 768)
    checkSize()
    window.addEventListener('resize', checkSize)

    const raw = sessionStorage.getItem('caria_result')
    if (!raw) { router.replace('/'); return }
    try {
      const parsed = JSON.parse(raw)
      setSector(parsed.sector || 'DT')
      setRecommendations(parsed.recommendations || [])
    } catch { router.replace('/') }
    setLoading(false)

    // เช็ค Supabase auth
    supabase.auth.getSession().then(({ data }) => {
      setIsLoggedIn(!!data.session)
      setAuthChecked(true)
    })

    const { data: { subscription } } = supabase.auth.onAuthStateChange((_e, session) => {
      setIsLoggedIn(!!session)
      setAuthChecked(true)
    })

    return () => {
      window.removeEventListener('resize', checkSize)
      subscription.unsubscribe()
    }
  }, [router])

  if (loading || !authChecked) return (
    <div style={{ minHeight: '100vh', display: 'flex', alignItems: 'center', justifyContent: 'center', background: '#f5f0eb' }}>
      <div style={{ textAlign: 'center' }}>
        <div style={{
          width: 36, height: 36, border: '3px solid #d0d5e8',
          borderTopColor: '#4a6fc4', borderRadius: '50%',
          animation: 'spin 0.8s linear infinite', margin: '0 auto 1rem',
        }} />
        <p style={{ fontFamily: "'Noto Sans Thai', sans-serif", fontSize: '0.9rem', color: '#5a6480' }}>
          กำลังโหลด...
        </p>
      </div>
      <style>{`@keyframes spin { to { transform: rotate(360deg) } }`}</style>
    </div>
  )

  if (recommendations.length === 0) return (
    <div style={{ minHeight: '100vh', display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', background: '#f5f0eb', gap: '1rem', padding: '1rem' }}>
      <p style={{ fontFamily: "'Noto Sans Thai', sans-serif", fontSize: '1.2rem', color: '#2c2927', textAlign: 'center' }}>ไม่พบผลลัพธ์</p>
      <button onClick={() => router.push('/')}
        style={{ background: '#2c2927', color: '#f5f0eb', border: 'none', borderRadius: '999px', padding: '0.6rem 1.5rem', cursor: 'pointer' }}>
        กลับหน้าแรก
      </button>
    </div>
  )

  const theme = THEMES[sector] ?? THEMES.DT
  const icons = SECTOR_ICONS[sector] ?? SECTOR_ICONS.DT

  const top1 = recommendations[0]
  const top2and3 = recommendations.slice(1, 3)
  const picSrc = getCareerPic(top1.careerId, sector)
  const radarGaps = top1.allGaps ?? top1.topGaps

  const strengths = Object.entries(top1.allGaps ?? top1.topGaps)
    .sort((a, b) => a[1] - b[1])
    .slice(0, 5)
    .map(([col]) => toLabel(col))

  const StrengthsCard = () => (
    <div style={{
      background: 'white',
      borderRadius: '16px',
      padding: '1rem',
      boxShadow: '0 2px 10px rgba(0,0,0,0.04)',
      zIndex: 6,
      marginBottom: isMobile ? '1.1rem' : '0'
    }}>
      <div style={{ display: 'flex', alignItems: 'center', gap: 7, marginBottom: '0.75rem' }}>
        <span style={{ fontWeight: 700, fontSize: '0.82rem', color: '#2d3a5c' }}>จุดเด่นของตัวคุณ</span>
      </div>
      {strengths.map((s, i) => (
        <div key={i} style={{ display: 'flex', alignItems: 'flex-start', gap: 8, marginBottom: 7 }}>
          <div style={{
            width: 17, height: 17, borderRadius: '50%',
            background: theme.checkBg,
            display: 'flex', alignItems: 'center', justifyContent: 'center',
            flexShrink: 0, marginTop: 2,
          }}>
            <svg width="9" height="7" viewBox="0 0 9 7">
              <polyline points="1,3.5 3.5,6 8,1" fill="none" stroke="white" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
            </svg>
          </div>
          <span style={{ fontSize: '0.78rem', color: '#4a5568', lineHeight: 1.5 }}>{s}</span>
        </div>
      ))}
    </div>
  )

  return (
    <main style={{
      minHeight: '100vh',
      background: '#ececec',
      fontFamily: "'Noto Sans Thai', 'Sarabun', sans-serif",
      padding: '0 0 4rem',
    }}>
      <TabNav />

      {/* ── Header ── */}
      <div style={{ textAlign: 'center', padding: isMobile ? '1.5rem 1rem 1rem' : '2rem 1rem 1.25rem' }}>
        <h1 style={{ fontSize: isMobile ? '1.35rem' : '1.6rem', fontWeight: 700, color: '#1a1a2e', margin: 0, lineHeight: 1.4 }}>
          <span style={{ color: theme.headerAccent }}>ยินดีด้วย</span>{' '}
          นี่คือเส้นทางที่ออกแบบมาเพื่อคุณ
        </h1>
      </div>

      <div style={{ maxWidth: 980, margin: '0 auto', padding: isMobile ? '0 1rem 2rem' : '0 1.25rem 2rem' }}>

        {/* ── Main Card ── */}
        <div style={{
          background: 'white',
          borderRadius: '24px',
          boxShadow: '0 4px 32px rgba(0,0,0,0.07)',
          overflow: 'hidden',
          display: 'flex',
          flexDirection: isMobile ? 'column' : 'row',
          marginBottom: '1.5rem',
        }}>

          {/* ── LEFT ── */}
          <div style={{
            background: theme.cardBg,
            padding: isMobile ? '1.5rem 1rem 1.25rem' : '2rem 1.5rem',
            display: 'flex',
            flexDirection: 'column',
            gap: '1.5rem',
            alignItems: 'stretch',
            justifyContent: 'flex-start',
            width: isMobile ? '100%' : '43%',
          }}>
            <div style={{
              width: '100%',
              maxWidth: isMobile ? '260px' : '100%',
              aspectRatio: '1/1',
              position: 'relative',
              flexShrink: 0,
              margin: '0 auto',
            }}>
              <div style={{
                position: 'absolute', bottom: '45%', left: '0', right: '0', height: '0',
                borderStyle: 'solid', borderWidth: '0 50% 70px 50%',
                borderColor: 'transparent transparent rgba(255, 255, 255, 0.84) transparent', zIndex: 0,
              }} />
              <div style={{
                position: 'absolute', width: '85%', height: '65%', left: '10%', top: '0%',
                background: 'rgba(255, 255, 255, 0.4)', borderRadius: '8px',
                border: '1px solid rgba(255, 255, 255, 0.6)', boxShadow: '0 4px 12px rgba(0,0,0,0.05)',
                transform: 'rotate(-4deg)', zIndex: 0,
              }} />
              <div style={{
                position: 'absolute', width: '60%', height: '65%', right: '5%', top: '5%',
                background: '#ffffff', padding: '8px 8px 24px 8px',
                boxShadow: '0 8px 20px rgba(0,0,0,0.12)', transform: 'rotate(5deg)', zIndex: 2,
              }}>
                <div style={{ width: '100%', height: '100%', position: 'relative', background: '#eee' }}>
                  <Image src={picSrc} alt={top1.name} fill style={{ objectFit: 'cover' }} priority />
                </div>
              </div>
              <div style={{
                position: 'absolute', width: '45%', height: '52%', left: '5%', top: '15%',
                background: '#ffffff', padding: '6px 6px 18px 6px',
                boxShadow: '0 6px 16px rgba(0,0,0,0.1)', transform: 'rotate(-8deg)', zIndex: 3,
              }}>
                <div style={{ width: '100%', height: '100%', position: 'relative', background: '#e5e5e5' }}>
                  <Image src={picSrc} alt="Mini thumbnail" fill style={{ objectFit: 'cover', filter: 'sepia(0.2)' }} />
                </div>
              </div>
              <div style={{
                position: 'absolute', right: '2%', top: '10%',
                background: theme.accentLight, color: theme.accentText,
                padding: '4px 10px', fontSize: '0.62rem', fontWeight: 700,
                letterSpacing: '1px', transform: 'rotate(12deg)',
                boxShadow: '2px 2px 5px rgba(0,0,0,0.05)', whiteSpace: 'nowrap',
                borderRadius: '2px', zIndex: 4, borderLeft: `2px solid ${theme.accent}`
              }}>
                TOP PATHWAY
              </div>
              <div style={{
                position: 'absolute', bottom: '0', left: '0', right: '0', height: '45%',
                background: '#ffffff', borderRadius: '0 0 16px 16px',
                boxShadow: '0 -4px 15px rgba(0,0,0,0.03), 0 4px 10px rgba(0,0,0,0.05)',
                zIndex: 5, borderTop: '1px solid rgba(0,0,0,0.06)',
                display: 'flex', flexDirection: 'column', justifyContent: 'center',
                alignItems: 'center', padding: '0 1rem',
              }}>
                <div style={{
                  position: 'absolute', top: '0', left: '0', right: '0', height: '0',
                  borderStyle: 'solid', borderWidth: '15px 140px 0 140px',
                  borderColor: 'rgba(0,0,0,0.04) transparent transparent transparent', zIndex: 0,
                }} />
              </div>
            </div>

            {!isMobile && <StrengthsCard />}
          </div>

          {/* ── RIGHT ── */}
          <div style={{
            padding: isMobile ? '1.5rem 1rem' : '2rem 2rem 1.75rem',
            width: isMobile ? '100%' : '57%',
            display: 'flex', flexDirection: 'column', justifyContent: 'space-between'
          }}>
            <div>
              <h2 style={{
                fontSize: isMobile ? '1.8rem' : '2.4rem', fontWeight: 800,
                color: '#1a1a2e', margin: '0 0 0.8rem', lineHeight: 1.2, letterSpacing: '-0.5px',
              }}>
                {top1.name}
              </h2>

              {isMobile && <StrengthsCard />}

              {top2and3.length > 0 && (
                <div style={{
                  background: theme.sectionBg, borderRadius: '16px',
                  padding: '1rem 1.25rem', marginBottom: '1.1rem',
                }}>
                  <p style={{ fontSize: '0.72rem', color: '#9aaccc', fontWeight: 600, marginBottom: '0.8rem' }}>
                    อาชีพแนะนำเพิ่มเติม
                  </p>
                  <div style={{ display: 'flex', gap: '1.5rem' }}>
                    {top2and3.map((c) => {
                      const iconSrc = getCareerPic(c.careerId, sector)
                      return (
                        <div key={c.careerId} style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 6 }}>
                          <div style={{
                            width: 54, height: 54, background: 'white', borderRadius: '14px',
                            display: 'flex', alignItems: 'center', justifyContent: 'center',
                            boxShadow: '0 2px 8px rgba(0,0,0,0.06)',
                            border: `1.5px solid ${theme.accentMid}`,
                            position: 'relative', overflow: 'hidden',
                          }}>
                            <Image src={iconSrc} alt={c.name} fill sizes="54px" style={{ objectFit: 'cover', padding: '2px' }} />
                          </div>
                          <span style={{ fontSize: '0.7rem', color: '#4a5568', textAlign: 'center', maxWidth: 85, lineHeight: 1.4, fontFamily: "'Noto Sans Thai', sans-serif" }}>
                            {c.name}
                          </span>
                        </div>
                      )
                    })}
                  </div>
                </div>
              )}
            </div>

            {/* Radar */}
            <div style={{ background: theme.sectionBg, borderRadius: '16px', padding: '1rem 0.75rem', marginTop: 'auto' }}>
              <p style={{ fontSize: '0.80rem', fontWeight: 700, color: '#2d3a5c', textAlign: 'center', marginBottom: '0.1rem' }}>
                ทักษะที่ควรพัฒนาเพิ่มเติมสำหรับสายงาน
              </p>
              <p style={{ fontSize: '0.68rem', color: '#9aaccc', textAlign: 'center', marginBottom: '0.75rem' }}>
                ความแตกต่างระหว่างทักษะปัจจุบันกับทักษะที่สายงาน{' '}
                <strong style={{ color: theme.accent }}>{top1.name}</strong> ต้องการ
              </p>
              <RadarChart gaps={radarGaps} theme={theme} />
            </div>
          </div>
        </div>

        {/* ── Buttons ── */}
        <div style={{
          display: 'flex', gap: '0.75rem', justifyContent: 'center',
          flexDirection: isMobile ? 'column-reverse' : 'row', width: '100%'
        }}>
          <button
            onClick={() => { sessionStorage.removeItem('caria_result'); router.push('/') }}
            style={{
              background: 'white', color: '#2d3a5c',
              border: '1.5px solid #d0d5e8', borderRadius: '999px',
              padding: '0.75rem 2rem', fontSize: '0.86rem',
              cursor: 'pointer', fontFamily: "'Noto Sans Thai', sans-serif", fontWeight: 500,
              width: isMobile ? '100%' : 'auto'
            }}
          >กลับไปหน้า HOME</button>

          {isLoggedIn && (
            <button
              onClick={() => router.push('/skills?sector=' + sector)}
              style={{
                background: theme.btnGapBg, color: theme.btnGapColor,
                border: 'none', borderRadius: '999px',
                padding: '0.75rem 2.25rem', fontSize: '0.86rem',
                cursor: 'pointer', fontFamily: "'Noto Sans Thai', sans-serif", fontWeight: 600,
                boxShadow: `0 4px 14px ${theme.accent}44`,
                width: isMobile ? '100%' : 'auto'
              }}
            >ดูทักษะที่ขาดเติมเต็ม</button>
          )}

          {!isLoggedIn && (
            <button
              onClick={() => router.push(`/login?redirect=/skills?sector=${sector}`)}
              style={{
                background: 'white', color: theme.accentText,
                border: `1.5px solid ${theme.accent}`, borderRadius: '999px',
                padding: '0.75rem 2.25rem', fontSize: '0.86rem',
                cursor: 'pointer', fontFamily: "'Noto Sans Thai', sans-serif", fontWeight: 600,
                width: isMobile ? '100%' : 'auto'
              }}
            >🔓 เข้าสู่ระบบเพื่อดูทักษะที่ขาด</button>
          )}
        </div>

      </div>

      {/* ── Guest-only extras ── */}
      {!isLoggedIn && (
        <>
          <LockedFeatures theme={theme} />
          <UnlockBanner theme={theme} sector={sector} />
        </>
      )}

      <style>{`@keyframes spin { to { transform: rotate(360deg) } }`}</style>
    </main>
  )
}

export default function ResultPage() {
  return <Suspense><ResultContent /></Suspense>
}