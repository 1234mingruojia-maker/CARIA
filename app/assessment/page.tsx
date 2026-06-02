'use client'
import { useState, Suspense, useEffect } from 'react'
import { useRouter, useSearchParams } from 'next/navigation'
import { QUESTIONS } from '@/lib/questionMap'

const PER_PAGE = 5

// กลุ่มคำถามตาม type เพื่อแสดง section header
const TYPE_LABELS: Record<string, { th: string; en: string; color: string }> = {
  skill:     { th: 'ทักษะ',    en: 'Skills',     color: '#c8a882' },
  attitude:  { th: 'บุคลิกภาพ', en: 'Attitude',   color: '#a89070' },
  knowledge: { th: 'ความรู้',   en: 'Knowledge',  color: '#8a7f78' },
}

function AssessmentContent() {
  const router = useRouter()
  const searchParams = useSearchParams()
  const sector = searchParams.get('sector') || 'DT'

  // default ทุกคำถามเป็น 50
  const [answers, setAnswers] = useState<Record<string, number>>(() => {
    const init: Record<string, number> = {}
    QUESTIONS.forEach(q => { init[q.id] = 50 })
    return init
  })
  const [page, setPage]       = useState(0)
  const [submitting, setSubmitting] = useState(false)
  const [error, setError]     = useState('')
  const [animKey, setAnimKey] = useState(0)

  const totalPages    = Math.ceil(QUESTIONS.length / PER_PAGE)
  const pageQuestions = QUESTIONS.slice(page * PER_PAGE, (page + 1) * PER_PAGE)
  const progress      = Math.round(((page + 1) / totalPages) * 100)
  const isLastPage    = page === totalPages - 1

  // animate เมื่อเปลี่ยนหน้า
  const goPage = (next: number) => {
    setAnimKey(k => k + 1)
    setPage(next)
    window.scrollTo({ top: 0, behavior: 'smooth' })
  }

  const getSliderLabel = (val: number) => {
    if (val <= 20) return 'ไม่เห็นด้วยเลย'
    if (val <= 40) return 'ไม่ค่อยเห็นด้วย'
    if (val <= 60) return 'กลางๆ'
    if (val <= 80) return 'ค่อนข้างเห็นด้วย'
    return 'เห็นด้วยมาก'
  }

  async function handleSubmit() {
    setSubmitting(true)
    setError('')
    try {
      const res = await fetch('/api/assessment/submit', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        // ส่ง answers ตรงๆ ไม่ต้องแปลง — backend ใช้ dbColumn mapping แล้ว
        body: JSON.stringify({ sector, answers }),
      })
      const data = await res.json()

      if (!data.success || !data.recommendations) {
        setError('เกิดข้อผิดพลาด กรุณาลองใหม่')
        setSubmitting(false)
        return
      }

      sessionStorage.setItem('caria_result', JSON.stringify({
        sector,
        recommendations: data.recommendations,
      }))

      router.push('/result')
    } catch (e) {
      console.error(e)
      setError('เกิดข้อผิดพลาด กรุณาลองใหม่')
      setSubmitting(false)
    }
  }

  // detect ว่าหน้านี้ข้ามกลุ่ม type ไหม
  const firstType = pageQuestions[0]?.type
  const sectionInfo = TYPE_LABELS[firstType] ?? TYPE_LABELS.skill

  // คำนวณว่าคำถามข้อนี้อยู่ลำดับที่เท่าไหร่ globally
  const globalStart = page * PER_PAGE + 1

  return (
    <>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Caveat:wght@500;700&family=Noto+Sans+Thai:wght@300;400;500;600&display=swap');

        * { box-sizing: border-box; margin: 0; padding: 0; }

        body { background: #f5f0eb; }

        .ca-page {
          min-height: 100vh;
          background: #f5f0eb;
          padding: 1.5rem 1rem 7rem;
          font-family: 'Noto Sans Thai', sans-serif;
        }

        /* ── Topbar ── */
        .ca-topbar {
          display: flex;
          justify-content: space-between;
          align-items: center;
          max-width: 560px;
          margin: 0 auto 1.75rem;
        }
        .ca-logo {
          font-family: 'Caveat', cursive;
          font-size: 1.35rem;
          font-weight: 700;
          color: #2c2927;
          letter-spacing: 0.02em;
        }
        .ca-sector-badge {
          background: #2c2927;
          color: #f5f0eb;
          border-radius: 999px;
          padding: 0.3rem 1rem;
          font-size: 0.72rem;
          letter-spacing: 0.04em;
          font-weight: 500;
        }

        /* ── Progress ── */
        .ca-progress-wrap {
          max-width: 560px;
          margin: 0 auto 0.4rem;
          display: flex;
          justify-content: space-between;
          align-items: center;
          font-size: 0.72rem;
          color: #a09890;
          font-family: 'Caveat', cursive;
          font-size: 0.9rem;
        }
        .ca-progress-bar {
          max-width: 560px;
          margin: 0 auto 2rem;
          height: 3px;
          background: #ddd7d0;
          border-radius: 2px;
        }
        .ca-progress-fill {
          height: 100%;
          background: #2c2927;
          border-radius: 2px;
          transition: width 0.4s cubic-bezier(.4,0,.2,1);
        }

        /* ── Section header ── */
        .ca-section-header {
          max-width: 560px;
          margin: 0 auto 2rem;
          display: flex;
          align-items: center;
          gap: 0.75rem;
        }
        .ca-section-dot {
          width: 8px;
          height: 8px;
          border-radius: 50%;
          flex-shrink: 0;
        }
        .ca-section-label {
          font-size: 0.72rem;
          letter-spacing: 0.1em;
          text-transform: uppercase;
          color: #a09890;
          font-weight: 500;
        }
        .ca-section-line {
          flex: 1;
          height: 1px;
          background: #ddd7d0;
        }

        /* ── Question cards ── */
        .ca-questions {
          max-width: 560px;
          margin: 0 auto;
          display: flex;
          flex-direction: column;
          gap: 2.5rem;
          animation: fadeUp 0.35s ease both;
        }
        @keyframes fadeUp {
          from { opacity: 0; transform: translateY(14px); }
          to   { opacity: 1; transform: translateY(0); }
        }

        .ca-card {
          background: #fff;
          border-radius: 16px;
          padding: 1.5rem 1.25rem 1.25rem;
          box-shadow: 0 1px 4px rgba(44,41,39,0.06), 0 4px 16px rgba(44,41,39,0.05);
          display: flex;
          flex-direction: column;
          gap: 1.1rem;
          transition: box-shadow 0.2s;
        }
        .ca-card:focus-within {
          box-shadow: 0 1px 4px rgba(44,41,39,0.08), 0 6px 24px rgba(44,41,39,0.1);
        }

        .ca-q-meta {
          display: flex;
          align-items: center;
          gap: 0.5rem;
        }
        .ca-q-index {
          font-family: 'Caveat', cursive;
          font-size: 0.85rem;
          color: #c8bfb6;
          line-height: 1;
        }
        .ca-q-type-tag {
          font-size: 0.62rem;
          letter-spacing: 0.08em;
          text-transform: uppercase;
          padding: 2px 8px;
          border-radius: 999px;
          font-weight: 600;
        }

        .ca-q-text {
          font-size: 0.95rem;
          line-height: 1.7;
          color: #2c2927;
          font-weight: 400;
        }

        /* score row */
        .ca-score-row {
          display: flex;
          align-items: baseline;
          gap: 0.4rem;
        }
        .ca-score-num {
          font-family: 'Caveat', cursive;
          font-size: 2.4rem;
          font-weight: 700;
          color: #2c2927;
          line-height: 1;
          min-width: 3rem;
        }
        .ca-score-max {
          font-size: 0.72rem;
          color: #c8bfb6;
        }
        .ca-score-label {
          font-size: 0.72rem;
          color: #5c5450;
          background: #f0ebe5;
          border-radius: 999px;
          padding: 3px 12px;
          margin-left: 0.35rem;
          white-space: nowrap;
        }

        /* slider */
        .ca-slider-wrap { position: relative; }
        .ca-slider {
          -webkit-appearance: none;
          appearance: none;
          width: 100%;
          height: 6px;
          border-radius: 3px;
          outline: none;
          cursor: pointer;
        }
        .ca-slider::-webkit-slider-thumb {
          -webkit-appearance: none;
          appearance: none;
          width: 24px;
          height: 24px;
          border-radius: 50%;
          background: #2c2927;
          border: 3px solid #fff;
          box-shadow: 0 2px 8px rgba(44,41,39,0.3);
          cursor: grab;
          transition: transform 0.15s;
        }
        .ca-slider::-webkit-slider-thumb:active {
          cursor: grabbing;
          transform: scale(1.15);
        }
        .ca-slider::-moz-range-thumb {
          width: 24px;
          height: 24px;
          border-radius: 50%;
          background: #2c2927;
          border: 3px solid #fff;
          box-shadow: 0 2px 8px rgba(44,41,39,0.3);
          cursor: grab;
        }

        .ca-slider-ends {
          display: flex;
          justify-content: space-between;
          font-size: 0.68rem;
          color: #c8bfb6;
          margin-top: 0.3rem;
        }

        /* ── Nav bar ── */
        .ca-nav {
          position: fixed;
          bottom: 0;
          left: 0;
          right: 0;
          background: rgba(245,240,235,0.92);
          backdrop-filter: blur(12px);
          -webkit-backdrop-filter: blur(12px);
          border-top: 1px solid #e8e2db;
          padding: 1rem 1.5rem 1.25rem;
          display: flex;
          align-items: center;
          justify-content: center;
          gap: 1.25rem;
        }
        .ca-nav-inner {
          max-width: 560px;
          width: 100%;
          display: flex;
          align-items: center;
          justify-content: space-between;
        }

        .ca-btn-circle {
          width: 48px;
          height: 48px;
          border-radius: 50%;
          border: 1.5px solid #2c2927;
          background: #f5f0eb;
          display: flex;
          align-items: center;
          justify-content: center;
          font-size: 1.1rem;
          cursor: pointer;
          transition: background 0.15s, opacity 0.15s, transform 0.15s;
          color: #2c2927;
        }
        .ca-btn-circle:not(:disabled):hover {
          background: #2c2927;
          color: #f5f0eb;
          transform: scale(1.05);
        }
        .ca-btn-circle:disabled {
          opacity: 0.25;
          cursor: default;
        }

        .ca-page-label {
          font-family: 'Caveat', cursive;
          font-size: 1rem;
          color: #8a7f78;
          min-width: 4rem;
          text-align: center;
        }

        .ca-btn-submit {
          padding: 0.65rem 1.75rem;
          border-radius: 999px;
          border: none;
          background: #2c2927;
          color: #f5f0eb;
          font-size: 0.88rem;
          font-family: 'Noto Sans Thai', sans-serif;
          font-weight: 500;
          cursor: pointer;
          transition: opacity 0.15s, transform 0.15s;
          letter-spacing: 0.02em;
        }
        .ca-btn-submit:not(:disabled):hover {
          opacity: 0.85;
          transform: scale(1.03);
        }
        .ca-btn-submit:disabled {
          opacity: 0.5;
          cursor: default;
        }

        /* error */
        .ca-error {
          max-width: 560px;
          margin: 1rem auto 0;
          text-align: center;
          color: #c0503a;
          font-size: 0.82rem;
          background: #fdf0ed;
          border-radius: 8px;
          padding: 0.5rem 1rem;
        }
      `}</style>

      <main className="ca-page">

        {/* Topbar */}
        <div className="ca-topbar">
          <span className="ca-logo">CARIA</span>
          <span className="ca-sector-badge">
            {sector === 'DT' ? 'Digital Technology' : 'Digital Communication'}
          </span>
        </div>

        {/* Progress */}
        <div className="ca-progress-wrap">
          <span>ข้อ {globalStart}–{Math.min(globalStart + PER_PAGE - 1, QUESTIONS.length)} จาก {QUESTIONS.length}</span>
          <span>{progress}%</span>
        </div>
        <div className="ca-progress-bar">
          <div className="ca-progress-fill" style={{ width: `${progress}%` }} />
        </div>

        {/* Section header */}
        <div className="ca-section-header">
          <div className="ca-section-dot" style={{ background: sectionInfo.color }} />
          <span className="ca-section-label">{sectionInfo.en} · {sectionInfo.th}</span>
          <div className="ca-section-line" />
        </div>

        {/* Questions */}
        <div className="ca-questions" key={animKey}>
          {pageQuestions.map((q, idx) => {
            const val  = answers[q.id] ?? 50
            const info = TYPE_LABELS[q.type] ?? TYPE_LABELS.skill
            const filled = `${val}%`

            return (
              <div key={q.id} className="ca-card">

                <div className="ca-q-meta">
                  <span className="ca-q-index">#{globalStart + idx}</span>
                  <span
                    className="ca-q-type-tag"
                    style={{
                      background: `${info.color}22`,
                      color: info.color,
                    }}
                  >
                    {q.id}
                  </span>
                </div>

                <p className="ca-q-text">{q.text}</p>

                <div className="ca-score-row">
                  <span className="ca-score-num">{val}</span>
                  <span className="ca-score-max">/ 100</span>
                  <span className="ca-score-label">{getSliderLabel(val)}</span>
                </div>

                <div className="ca-slider-wrap">
                  <input
                    type="range"
                    min={0}
                    max={100}
                    step={1}
                    value={val}
                    onChange={e =>
                      setAnswers(prev => ({ ...prev, [q.id]: Number(e.target.value) }))
                    }
                    className="ca-slider"
                    style={{
                      background: `linear-gradient(to right, #2c2927 ${filled}, #ddd7d0 ${filled})`,
                    }}
                  />
                  <div className="ca-slider-ends">
                    <span>0 · ไม่เห็นด้วยเลย</span>
                    <span>เห็นด้วยมาก · 100</span>
                  </div>
                </div>

              </div>
            )
          })}
        </div>

        {/* Error */}
        {error && <p className="ca-error">{error}</p>}

      </main>

      {/* Nav */}
      <div className="ca-nav">
        <div className="ca-nav-inner">
          <button
            className="ca-btn-circle"
            onClick={() => goPage(Math.max(0, page - 1))}
            disabled={page === 0}
            aria-label="ย้อนกลับ"
          >←</button>

          <span className="ca-page-label">{page + 1} / {totalPages}</span>

          {isLastPage ? (
            <button
              className="ca-btn-submit"
              onClick={handleSubmit}
              disabled={submitting}
            >
              {submitting ? 'กำลังคำนวณ…' : 'ดูผลลัพธ์ ✓'}
            </button>
          ) : (
            <button
              className="ca-btn-circle"
              onClick={() => goPage(Math.min(totalPages - 1, page + 1))}
              aria-label="ถัดไป"
            >→</button>
          )}
        </div>
      </div>
    </>
  )
}

export default function AssessmentPage() {
  return (
    <Suspense>
      <AssessmentContent />
    </Suspense>
  )
}