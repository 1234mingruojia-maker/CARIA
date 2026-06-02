'use client'
import { Suspense, useEffect, useState } from 'react'
import { useRouter } from 'next/navigation'
import Image from 'next/image'

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

const CAREER_PIC: Record<string, string> = {}

function getCareerPic(careerId: string, sector: string): string {
  return CAREER_PIC[careerId] ?? (sector === 'DC' ? '/pic/DC.png' : '/pic/DT.png')
}

const COL_LABEL: Record<string, string> = {
  s_active_learning: 'การเรียนรู้เชิงรุก',
  s_critical_thinking: 'การคิดวิเคราะห์',
  s_reading_comprehension: 'การอ่านเพื่อความเข้าใจ',
  s_complex_problem_solving: 'การแก้ปัญหาซับซ้อน',
  s_systems_analysis: 'การวิเคราะห์ระบบ',
  s_systems_evaluation: 'การประเมินระบบ',
  s_programming: 'การเขียนโปรแกรม',
  s_technology_design: 'การออกแบบเทคโนโลยี',
  s_operations_analysis: 'การวิเคราะห์การดำเนินงาน',
  s_mathematics: 'คณิตศาสตร์',
  s_science: 'วิทยาศาสตร์',
  s_speaking: 'การพูด',
  s_writing: 'การเขียน',
  s_active_listening: 'การฟังเชิงรุก',
  s_coordination: 'การประสานงาน',
  s_social_perceptiveness: 'ทักษะสังคม',
  s_persuasion: 'การโน้มน้าว',
  s_instructing: 'การสอน',
  s_negotiation: 'การเจรจา',
  s_service_orientation: 'การบริการ',
  s_time_management: 'การบริหารเวลา',
  s_management_of_resources: 'การจัดการทรัพยากร',
  s_monitoring: 'การติดตาม',
  s_judgment: 'การตัดสินใจ',
  s_operation_monitoring: 'การตรวจสอบการทำงาน',
  s_quality_control: 'การควบคุมคุณภาพ',
  s_equipment_selection: 'การเลือกอุปกรณ์',
  s_installation: 'การติดตั้ง',
  s_operation_and_control: 'การควบคุมการทำงาน',
  s_equipment_maintenance: 'การบำรุงรักษา',
  s_repairing: 'การซ่อมแซม',
  s_troubleshooting: 'การแก้ปัญหาเทคนิค',
  s_management_of_financial: 'การจัดการการเงิน',
  s_management_of_material: 'การจัดการวัสดุ',
  s_management_of_personnel: 'การจัดการบุคลากร',
  k_computers_electronics: 'คอมพิวเตอร์และอิเล็กทรอนิกส์',
  k_engineering_technology: 'วิศวกรรมและเทคโนโลยี',
  k_mathematics_knowledge: 'ความรู้คณิตศาสตร์',
  k_design: 'การออกแบบ',
  k_communications_media: 'สื่อสารและมีเดีย',
  k_english_language: 'ภาษาอังกฤษ',
  k_thai_language: 'ภาษาไทย',
  k_customer_service: 'การบริการลูกค้า',
  k_sales_marketing: 'การขายและการตลาด',
  k_administration_management: 'การบริหารจัดการ',
  k_economics_accounting: 'เศรษฐศาสตร์และบัญชี',
  k_law_government: 'กฎหมายและรัฐบาล',
  k_education_training: 'การศึกษาและฝึกอบรม',
  k_psychology: 'จิตวิทยา',
  k_sociology_anthropology: 'สังคมวิทยาและมานุษยวิทยา',
  k_geography: 'ภูมิศาสตร์',
  k_history_archaeology: 'ประวัติศาสตร์และโบราณคดี',
  k_philosophy_theology: 'ปรัชญาและศาสนา',
  k_biology: 'ชีววิทยา',
  k_physics: 'ฟิสิกส์',
  k_chemistry: 'เคมี',
  k_food_production: 'การผลิตอาหาร',
  k_medicine_dentistry: 'การแพทย์และทันตกรรม',
  k_therapy_counseling: 'การบำบัดและให้คำปรึกษา',
  k_public_safety: 'ความปลอดภัยสาธารณะ',
  k_transportation: 'การขนส่ง',
  k_production_processing: 'การผลิตและการแปรรูป',
  k_mechanical: 'เครื่องจักรกล',
  k_building_construction: 'การก่อสร้าง',
  k_fine_arts: 'ศิลปกรรม',
  a_achievement: 'ความมุ่งมั่นสำเร็จ',
  a_persistence: 'ความอดทนมุมานะ',
  a_initiative: 'ความริเริ่มสร้างสรรค์',
  a_leadership: 'ภาวะผู้นำ',
  a_cooperation: 'การให้ความร่วมมือ',
  a_concern_for_others: 'ความห่วงใยผู้อื่น',
  a_social_orientation: 'การมุ่งเน้นสังคม',
  a_self_control: 'การควบคุมตนเอง',
  a_stress_tolerance: 'ความทนต่อความเครียด',
  a_adaptability: 'การปรับตัว',
  a_dependability: 'ความน่าเชื่อถือ',
  a_attention_to_detail: 'ความละเอียดรอบคอบ',
  a_integrity: 'ความซื่อสัตย์',
  a_independence: 'ความเป็นอิสระ',
  a_innovation: 'ความคิดสร้างสรรค์',
  a_analytical_thinking: 'ความคิดวิเคราะห์',
  a_realistic: 'ความเป็นจริง',
  a_investigative: 'การค้นคว้าวิจัย',
  a_artistic: 'ความคิดศิลปะ',
  a_social: 'การเข้าสังคม',
  a_enterprising: 'ความเป็นผู้นำเชิงรุก',
  a_conventional: 'ความมีระเบียบ',
}

function toLabel(col: string): string {
  return COL_LABEL[col] ?? col.replace(/^[ska]_/, '').replace(/_/g, ' ')
}

const SECTOR_ICONS: Record<string, string[]> = {
  DT: ['💻', '🖥️', '⚙️'],
  DC: ['🎨', '✏️', '💡'],
}

// ── Radar Chart ───────────────────────────────────────────────
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

  // ลด r ให้มีพื้นที่ label มากขึ้น
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
    <svg width="320" height="320" viewBox="0 0 320 320" style={{ display: 'block', margin: '0 auto' }}>
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
        // ดันตัวเลขและ label ออกไปไกลขึ้น
        const vp = pt(i, 1.22)
        const lp = pt(i, 1.48)
        const label = toLabel(col)
        // ตัด label ที่ยาวเกิน 5 ตัวอักษรให้ขึ้นบรรทัดใหม่
        const words = label.length > 5
          ? [label.slice(0, Math.ceil(label.length / 2)), label.slice(Math.ceil(label.length / 2))]
          : [label]
        return (
          <g key={i}>
            <text x={vp.x} y={vp.y} textAnchor="middle" dominantBaseline="middle"
              fontSize="10" fontWeight="700" fill={theme.radarStroke}
              style={{ fontFamily: "'Noto Sans Thai', sans-serif" }}>
              {Math.round(val)}
            </text>
            {words.map((w, wi) => (
              <text key={wi}
                x={lp.x}
                y={lp.y + wi * 11 - (words.length - 1) * 5.5}
                textAnchor="middle" dominantBaseline="middle"
                fontSize="8.5" fill="#5a6480"
                style={{ fontFamily: "'Noto Sans Thai', sans-serif" }}>
                {w}
              </text>
            ))}
          </g>
        )
      })}
    </svg>
  )
}

// ── Main ──────────────────────────────────────────────────────
function ResultContent() {
  const router = useRouter()
  const [recommendations, setRecommendations] = useState<Career[]>([])
  const [sector, setSector] = useState('DT')
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const raw = sessionStorage.getItem('caria_result')
    if (!raw) { router.replace('/'); return }
    try {
      const parsed = JSON.parse(raw)
      setSector(parsed.sector || 'DT')
      setRecommendations(parsed.recommendations || [])
    } catch { router.replace('/') }
    setLoading(false)
  }, [])

  if (loading) return (
    <div style={{ minHeight: '100vh', display: 'flex', alignItems: 'center', justifyContent: 'center', background: '#f5f0eb' }}>
      <p style={{ fontFamily: "'Noto Sans Thai', sans-serif", fontSize: '1.2rem', color: '#2c2927' }}>กำลังโหลด...</p>
    </div>
  )

  if (recommendations.length === 0) return (
    <div style={{ minHeight: '100vh', display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', background: '#f5f0eb', gap: '1rem' }}>
      <p style={{ fontFamily: "'Noto Sans Thai', sans-serif", fontSize: '1.2rem', color: '#2c2927' }}>ไม่พบผลลัพธ์</p>
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

  // normalize % เทียบกับ top1 เป็น 100%
  const maxMes = Math.max(...recommendations.map(r => r.mesScore), 0.001)
  const normalizedPct = (score: number) => Math.round((score / maxMes) * 100)

  // จุดเด่น: gap น้อยสุด = ทักษะที่ผู้ใช้ใกล้เคียงอาชีพมากที่สุด
  const strengths = Object.entries(top1.allGaps ?? top1.topGaps)
    .sort((a, b) => a[1] - b[1])
    .slice(0, 5)
    .map(([col]) => toLabel(col))

  return (
    <main style={{
      minHeight: '100vh',
      background: '#f5f0eb',
      fontFamily: "'Noto Sans Thai', 'Sarabun', sans-serif",
      padding: '0 0 4rem',
    }}>

      {/* ── Header ── */}
      <div style={{ textAlign: 'center', padding: '2rem 1rem 1.25rem' }}>
        <h1 style={{ fontSize: '1.6rem', fontWeight: 700, color: '#1a1a2e', margin: 0, lineHeight: 1.4 }}>
          <span style={{ color: theme.headerAccent }}>ยินดีด้วย</span>{' '}
          นี่คือเส้นทางที่ออกแบบมาเพื่อคุณ
        </h1>
      </div>

      <div style={{ maxWidth: 980, margin: '0 auto', padding: '0 1.25rem 2rem' }}>

        {/* ── Main Card ── */}
        <div style={{
          background: 'white',
          borderRadius: '24px',
          boxShadow: '0 4px 32px rgba(0,0,0,0.07)',
          overflow: 'hidden',
          display: 'grid',
          gridTemplateColumns: '1fr 1.4fr',  // สมดุลขึ้น
          marginBottom: '1.5rem',
        }}>

    {/* ── LEFT ── */}
<div style={{
  background: theme.cardBg,
  padding: '1.75rem 1.5rem 1.75rem',
  display: 'flex',
  flexDirection: 'column',
  gap: '1.25rem',
  alignItems: 'stretch',
  justifyContent: 'flex-start',  // ← ทุกอย่างเริ่มจากบน
}}>

  {/* รูปจดหมาย — ขยายใหญ่ขึ้น */}
  <div style={{
    width: '100%',
    borderRadius: '18px',
    overflow: 'hidden',
    aspectRatio: '1/1',        // เปลี่ยนจาก 4/3 → 1/1 ให้สูงขึ้น
    boxShadow: '0 4px 20px rgba(0,0,0,0.08)',
    background: theme.accentMid,
    position: 'relative',
    flexShrink: 0,
  }}>
    <Image
      src={picSrc}
      alt={top1.name}
      fill
      style={{ objectFit: 'cover' }}
      priority
    />
  </div>

  {/* จุดเด่น — อยู่ล่างสุด ใช้ marginTop: auto ดันลงไป */}
  <div style={{
  background: 'white',
  borderRadius: '16px',
  padding: '1rem 1.1rem',
  boxShadow: '0 2px 10px rgba(0,0,0,0.04)',
  marginTop: '0',
  alignSelf: 'flex-start',  // ← ไม่ยืดตาม column
}}>
    <div style={{ display: 'flex', alignItems: 'center', gap: 7, marginBottom: '0.75rem' }}>
      <div style={{
        width: 24, height: 24, borderRadius: '50%',
        background: theme.checkBg,
        display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0,
      }}>
        <svg width="12" height="10" viewBox="0 0 12 10">
          <polyline points="1,5 4.5,8.5 11,1" fill="none" stroke="white" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" />
        </svg>
      </div>
      <span style={{ fontWeight: 700, fontSize: '0.82rem', color: '#2d3a5c' }}>จุดเด่นของตัวคุณ</span>
    </div>
    {strengths.map((s, i) => (
      <div key={i} style={{ display: 'flex', alignItems: 'flex-start', gap: 8, marginBottom: 7 }}>
        <div style={{
          width: 17, height: 17, borderRadius: '50%',
          background: theme.checkBg,
          display: 'flex', alignItems: 'center', justifyContent: 'center',
          flexShrink: 0, marginTop: 1,
        }}>
          <svg width="9" height="7" viewBox="0 0 9 7">
            <polyline points="1,3.5 3.5,6 8,1" fill="none" stroke="white" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
          </svg>
        </div>
        <span style={{ fontSize: '0.78rem', color: '#4a5568', lineHeight: 1.55 }}>{s}</span>
      </div>
    ))}
  </div>
</div>

          {/* ── RIGHT ── */}
          <div style={{ padding: '2rem 2rem 1.75rem' }}>

            <div style={{
              display: 'inline-block',
              background: theme.badgeBg, color: theme.badgeText,
              fontSize: '0.68rem', fontWeight: 600,
              padding: '4px 14px', borderRadius: '999px',
              marginBottom: '0.55rem', letterSpacing: '0.03em',
            }}>
              อาชีพที่เหมาะกับคุณ
            </div>

            <h2 style={{
              fontSize: '2.4rem', fontWeight: 800,
              color: '#1a1a2e', margin: '0 0 0.3rem',
              lineHeight: 1.15, letterSpacing: '-0.5px',
            }}>
              {top1.name}
            </h2>

   

            {/* Top2 & Top3 */}
            {top2and3.length > 0 && (
              <div style={{
                background: theme.sectionBg,
                borderRadius: '16px',
                padding: '1rem 1.25rem',
                marginBottom: '1.1rem',
              }}>
                <p style={{ fontSize: '0.72rem', color: '#9aaccc', fontWeight: 600, marginBottom: '0.8rem' }}>
                  อาชีพแนะนำ
                </p>
                <div style={{ display: 'flex', gap: '1.5rem' }}>
                  {top2and3.map((c, i) => (
                    <div key={c.careerId} style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 5 }}>
                      <div style={{
                        width: 54, height: 54,
                        background: 'white',
                        borderRadius: '14px',
                        display: 'flex', alignItems: 'center', justifyContent: 'center',
                        fontSize: '1.5rem',
                        boxShadow: '0 2px 8px rgba(0,0,0,0.07)',
                        border: `1.5px solid ${theme.accentMid}`,
                      }}>
                        {icons[i] ?? '🎯'}
                      </div>
                      <span style={{ fontSize: '0.7rem', color: '#4a5568', textAlign: 'center', maxWidth: 80, lineHeight: 1.4 }}>
                        {c.name}
                      </span>
                     
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* Radar */}
            <div style={{
              background: theme.sectionBg,
              borderRadius: '16px',
              padding: '0.9rem 0.5rem 0.5rem',
            }}>
              <p style={{ fontSize: '0.72rem', fontWeight: 700, color: '#2d3a5c', textAlign: 'center', marginBottom: '0.1rem' }}>
                กราฟแสดงศักยภาพของคุณ
              </p>
              <p style={{ fontSize: '0.68rem', color: '#9aaccc', textAlign: 'center', marginBottom: '0.4rem' }}>
                ช่องว่างระหว่างทักษะของคุณกับที่{' '}
                <strong style={{ color: theme.accent }}>{top1.name}</strong> ต้องการ
              </p>
              <RadarChart gaps={radarGaps} theme={theme} />
            </div>
          </div>
        </div>

        {/* ── Buttons ── */}
        <div style={{ display: 'flex', gap: '1rem', justifyContent: 'center', flexWrap: 'wrap' }}>
          <button
            onClick={() => { sessionStorage.removeItem('caria_result'); router.push('/') }}
            style={{
              background: 'white', color: '#2d3a5c',
              border: '1.5px solid #d0d5e8', borderRadius: '999px',
              padding: '0.75rem 2rem', fontSize: '0.86rem',
              cursor: 'pointer', fontFamily: "'Noto Sans Thai', sans-serif", fontWeight: 500,
            }}
          >← กลับไปหน้า HOME</button>
          <button
            onClick={() => router.push('/skills?sector=' + sector)}
            style={{
              background: theme.btnGapBg, color: theme.btnGapColor,
              border: 'none', borderRadius: '999px',
              padding: '0.75rem 2.25rem', fontSize: '0.86rem',
              cursor: 'pointer', fontFamily: "'Noto Sans Thai', sans-serif", fontWeight: 600,
              boxShadow: `0 4px 14px ${theme.accent}44`,
            }}
          >ดูทักษะที่ขาดเติมเต็ม →</button>
        </div>

      </div>
    </main>
  )
}

export default function ResultPage() {
  return <Suspense><ResultContent /></Suspense>
}