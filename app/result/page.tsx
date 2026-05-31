'use client'
import { Suspense } from 'react'
import { useRouter, useSearchParams } from 'next/navigation'

type Career = {
  careerId: string
  name: string
  sector: string
  mesScore: number
  topGaps: Record<string, number>
}

// Radar Chart matching the design: labeled axes with numeric values, filled polygon
function RadarChart({ gaps }: { gaps: Record<string, number> }) {
  const entries = Object.entries(gaps).slice(0, 8)
  const n = entries.length
  if (n < 3) return null

  const cx = 160, cy = 160, r = 100
  const maxVal = 100
  const angleStep = (2 * Math.PI) / n

  const getXY = (i: number, scale: number) => {
    const angle = i * angleStep - Math.PI / 2
    return {
      x: cx + r * scale * Math.cos(angle),
      y: cy + r * scale * Math.sin(angle),
    }
  }

  const gridLevels = [0.25, 0.5, 0.75, 1]

  const dataPoints = entries.map(([, val], i) => {
    const ratio = Math.min(val, maxVal) / maxVal
    return getXY(i, ratio)
  })

  const polygon = dataPoints.map(p => `${p.x},${p.y}`).join(' ')
  const gridPolygon = (scale: number) =>
    entries.map((_, i) => {
      const p = getXY(i, scale)
      return `${p.x},${p.y}`
    }).join(' ')

  return (
    <div style={{ display: 'flex', justifyContent: 'center', width: '100%' }}>
      <svg width="320" height="320" viewBox="0 0 320 320">
        {/* Grid polygons */}
        {gridLevels.map(s => (
          <polygon key={s} points={gridPolygon(s)}
            fill="none" stroke="#c8d8ec" strokeWidth="1" />
        ))}
        {/* Axis lines */}
        {entries.map((_, i) => {
          const outer = getXY(i, 1)
          return <line key={i} x1={cx} y1={cy} x2={outer.x} y2={outer.y}
            stroke="#c8d8ec" strokeWidth="1" />
        })}
        {/* Data polygon */}
        <polygon points={polygon}
          fill="rgba(90,130,210,0.25)"
          stroke="#4a6fc4"
          strokeWidth="2" />
        {/* Data points */}
        {dataPoints.map((p, i) => (
          <circle key={i} cx={p.x} cy={p.y} r="3"
            fill="#4a6fc4" />
        ))}
        {/* Labels with values */}
        {entries.map(([label, val], i) => {
          const labelPt = getXY(i, 1.32)
          const valuePt = getXY(i, 1.18)
          return (
            <g key={i}>
              <text x={valuePt.x} y={valuePt.y}
                textAnchor="middle" dominantBaseline="middle"
                fontSize="12" fontWeight="700" fill="#2d3a5c"
                style={{ fontFamily: "'Noto Sans Thai', 'Sarabun', sans-serif" }}>
                {val}
              </text>
              <text x={labelPt.x} y={labelPt.y}
                textAnchor="middle" dominantBaseline="middle"
                fontSize="9.5" fill="#5a6480"
                style={{ fontFamily: "'Noto Sans Thai', 'Sarabun', sans-serif" }}>
                {label.length > 10 ? label.slice(0, 10) + '…' : label}
              </text>
            </g>
          )
        })}
        {/* Concentric level labels */}
        {[25, 50, 75, 100].map((lvl, i) => (
          <text key={i} x={cx + 4} y={cy - r * (lvl / 100) + 4}
            fontSize="7.5" fill="#9aaccc"
            style={{ fontFamily: 'sans-serif' }}>{lvl}</text>
        ))}
      </svg>
    </div>
  )
}

// Placeholder illustration component (replace with actual image)
function IllustrationPanel() {
  return (
    <div style={{
      background: 'linear-gradient(135deg, #e8eeff 0%, #f0e8ff 50%, #ffe8f0 100%)',
      borderRadius: '20px',
      width: '100%',
      aspectRatio: '1 / 1.1',
      display: 'flex',
      flexDirection: 'column',
      alignItems: 'center',
      justifyContent: 'center',
      position: 'relative',
      overflow: 'hidden',
      minHeight: 260,
    }}>
      {/* Stars decoration */}
      {[
        { top: '12%', left: '10%', size: 18, color: '#f7c948' },
        { top: '8%', right: '15%', size: 14, color: '#f7c948' },
        { bottom: '20%', left: '8%', size: 12, color: '#f7c948' },
      ].map((star, i) => (
        <svg key={i} style={{ position: 'absolute', top: star.top, left: star.left, right: (star as any).right, bottom: star.bottom }}
          width={star.size} height={star.size} viewBox="0 0 24 24">
          <polygon points="12,2 15,9 22,9 16,14 18,21 12,17 6,21 8,14 2,9 9,9"
            fill={star.color} />
        </svg>
      ))}
      {/* Character illustration placeholder */}
      <div style={{
        fontSize: '5rem',
        marginBottom: '0.5rem',
        filter: 'drop-shadow(0 4px 12px rgba(100,80,200,0.15))',
      }}>🎨</div>
      <div style={{
        background: 'rgba(255,255,255,0.7)',
        borderRadius: '12px',
        padding: '0.5rem 1rem',
        fontSize: '0.75rem',
        color: '#6a5acd',
        textAlign: 'center',
        fontStyle: 'italic',
        maxWidth: '80%',
        backdropFilter: 'blur(4px)',
        fontFamily: "'Noto Sans Thai', sans-serif",
      }}>
        ความคิดสร้างสรรค์คือพลังของคุณ!
      </div>
    </div>
  )
}

function ResultContent() {
  const router = useRouter()
  const searchParams = useSearchParams()
  const sector = searchParams.get('sector') || 'DT'
  const resultRaw = searchParams.get('result')

  let recommendations: Career[] = []
  try {
    if (resultRaw) recommendations = JSON.parse(resultRaw)
  } catch {}

  // Use first result as the "hero" card
  const top = recommendations[0]
  const sectorLabel = sector === 'DT' ? 'Digital Technology' : 'Digital Communication'

  // Mock data for preview if no result
  const mockTop: Career = top || {
    careerId: 'ux-ui',
    name: 'UX/UI',
    sector,
    mesScore: 0.88,
    topGaps: {
      'การวิเคราะห์ข้อมูล': 75,
      'ความคิดสร้างสรรค์': 90,
      'การสื่อสาร': 80,
      'การจัดการเวลา': 70,
      'การแก้ปัญหา': 85,
      'ความเข้าใจผู้ใช้ (UX)': 95,
      'การทำงานเป็นทีม': 75,
    },
  }

  const strengthItems = [
    'ความคิดสร้างสรรค์สูง',
    'เข้าใจและใส่ใจความต้องการของผู้ใช้',
    'ชอบการสื่อสารและทำงานเป็นทีม',
    'มีทักษะในการแก้ปัญหา',
    'มีความละเอียดรอบคอบ',
  ]

  const relatedCareers = [
    { icon: '🖥️', label: 'UX Designer' },
    { icon: '📱', label: 'UI Designer' },
    { icon: '💡', label: 'Product Designer' },
  ]

  return (
    <main style={{
      minHeight: '100vh',
      background: '#f4f6ff',
      fontFamily: "'Noto Sans Thai', 'Sarabun', sans-serif",
      padding: '0 0 4rem',
    }}>
      {/* Header */}
      <div style={{
        textAlign: 'center',
        padding: '2.5rem 1rem 1.5rem',
        background: 'white',
        borderBottom: '1px solid #e8eaf6',
      }}>
        <h1 style={{
          fontSize: '1.75rem',
          fontWeight: 700,
          color: '#1a1a2e',
          marginBottom: '0.4rem',
        }}>
          กดจดหมายแล้วจะแสดง{' '}
          <span style={{ color: '#4a6fc4' }}>ตัวละครเรา</span>
        </h1>
        <p style={{ color: '#7a82a0', fontSize: '0.9rem' }}>
          มาดูกันว่าคุณเหมาะกับอาชีพอะไรบ้าง
        </p>
      </div>

      <div style={{ maxWidth: 900, margin: '0 auto', padding: '2rem 1.25rem' }}>

        {/* Main hero card */}
        <div style={{
          background: 'white',
          borderRadius: '24px',
          boxShadow: '0 4px 24px rgba(74,111,196,0.08)',
          overflow: 'hidden',
          display: 'grid',
          gridTemplateColumns: '1fr 1.6fr',
          gap: 0,
          marginBottom: '1.5rem',
        }}>
          {/* Left: Illustration */}
          <div style={{
            background: 'linear-gradient(160deg, #eef0ff 0%, #f8f0ff 100%)',
            padding: '2rem 1.5rem',
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            justifyContent: 'center',
            gap: '1rem',
          }}>
            <IllustrationPanel />

            {/* Strengths */}
            <div style={{
              background: 'white',
              borderRadius: '16px',
              padding: '1rem 1.25rem',
              width: '100%',
              boxShadow: '0 2px 8px rgba(74,111,196,0.06)',
            }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: 6, marginBottom: '0.75rem' }}>
                <span style={{ fontSize: '1rem' }}>⭐</span>
                <span style={{ fontWeight: 600, fontSize: '0.85rem', color: '#2d3a5c' }}>จุดเด่นของคุณ</span>
              </div>
              {strengthItems.map((s, i) => (
                <div key={i} style={{
                  display: 'flex', alignItems: 'center', gap: 8,
                  marginBottom: 6,
                }}>
                  <div style={{
                    width: 18, height: 18, borderRadius: '50%',
                    background: '#4a6fc4',
                    display: 'flex', alignItems: 'center', justifyContent: 'center',
                    flexShrink: 0,
                  }}>
                    <svg width="10" height="8" viewBox="0 0 10 8">
                      <polyline points="1,4 4,7 9,1" fill="none" stroke="white" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
                    </svg>
                  </div>
                  <span style={{ fontSize: '0.78rem', color: '#4a5568' }}>{s}</span>
                </div>
              ))}
            </div>
          </div>

          {/* Right: Career info */}
          <div style={{ padding: '2rem 2rem 1.5rem' }}>
            {/* Badge */}
            <div style={{
              display: 'inline-block',
              background: '#eef2ff',
              color: '#4a6fc4',
              fontSize: '0.72rem',
              fontWeight: 600,
              padding: '4px 14px',
              borderRadius: '999px',
              marginBottom: '0.5rem',
              letterSpacing: '0.02em',
            }}>อาชีพที่เหมาะกับคุณ</div>

            {/* Career name */}
            <h2 style={{
              fontSize: '2.8rem',
              fontWeight: 700,
              color: '#1a1a2e',
              margin: '0 0 0.75rem',
              lineHeight: 1.1,
            }}>{mockTop.name}</h2>

            {/* Description */}
            <p style={{
              fontSize: '0.85rem',
              color: '#5a6480',
              lineHeight: 1.7,
              marginBottom: '1.25rem',
            }}>
              เป็นคนคิดสร้างสรรค์ มีเซนส์ด้านการออกแบบ ใส่ใจผู้คนและประสบการณ์
              เหมาะกับสายงานที่ต้องให้ทั้งความสวยงาม และเข้าใจผู้ใช้อย่างลึกซึ้ง
            </p>

            {/* Related careers */}
            <div style={{
              background: '#f8f9ff',
              borderRadius: '16px',
              padding: '1rem 1.25rem',
              marginBottom: '1.5rem',
            }}>
              <p style={{ fontSize: '0.78rem', color: '#7a82a0', marginBottom: '0.75rem', fontWeight: 600 }}>
                อาชีพที่แนะนำ
              </p>
              <div style={{ display: 'flex', gap: '1rem', flexWrap: 'wrap' }}>
                {relatedCareers.map(c => (
                  <div key={c.label} style={{
                    display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 6,
                  }}>
                    <div style={{
                      width: 52, height: 52,
                      background: 'white',
                      borderRadius: '14px',
                      display: 'flex', alignItems: 'center', justifyContent: 'center',
                      fontSize: '1.5rem',
                      boxShadow: '0 2px 8px rgba(74,111,196,0.1)',
                      border: '1px solid #e8eaf6',
                    }}>{c.icon}</div>
                    <span style={{ fontSize: '0.72rem', color: '#4a5568', textAlign: 'center' }}>{c.label}</span>
                  </div>
                ))}
              </div>
            </div>

            {/* Radar chart section */}
            <div style={{
              background: '#f8f9ff',
              borderRadius: '16px',
              padding: '1rem',
            }}>
              <p style={{
                fontSize: '0.78rem', fontWeight: 600, color: '#2d3a5c',
                textAlign: 'center', marginBottom: '0.25rem',
              }}>กราฟแสดงศักยภาพของคุณ</p>
              <RadarChart gaps={mockTop.topGaps} />
            </div>
          </div>
        </div>

        {/* Bottom action buttons */}
        <div style={{
          display: 'flex',
          gap: '1rem',
          justifyContent: 'center',
          flexWrap: 'wrap',
        }}>
          <button
            onClick={() => router.push('/')}
            style={{
              background: 'white',
              color: '#2d3a5c',
              border: '1.5px solid #d0d5e8',
              borderRadius: '999px',
              padding: '0.75rem 2rem',
              fontSize: '0.9rem',
              cursor: 'pointer',
              fontFamily: "'Noto Sans Thai', sans-serif",
              fontWeight: 500,
              display: 'flex', alignItems: 'center', gap: 8,
              transition: 'all 0.2s',
            }}
          >
            ← ทำแบบทดสอบอีกครั้ง
          </button>
          <button
            onClick={() => router.push('/careers?sector=' + sector)}
            style={{
              background: '#4a6fc4',
              color: 'white',
              border: 'none',
              borderRadius: '999px',
              padding: '0.75rem 2.25rem',
              fontSize: '0.9rem',
              cursor: 'pointer',
              fontFamily: "'Noto Sans Thai', sans-serif",
              fontWeight: 600,
              display: 'flex', alignItems: 'center', gap: 8,
              boxShadow: '0 4px 14px rgba(74,111,196,0.35)',
              transition: 'all 0.2s',
            }}
          >
            ดูอาชีพเพิ่มเติมที่เหมาะกับคุณ →
          </button>
        </div>

      </div>
    </main>
  )
}

export default function ResultPage() {
  return (
    <Suspense>
      <ResultContent />
    </Suspense>
  )
}