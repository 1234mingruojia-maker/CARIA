'use client'
import { useState, useEffect, Suspense } from 'react'
import { useRouter, useSearchParams } from 'next/navigation'
import { QUESTIONS } from '@/lib/questionMap'

const PER_PAGE = 5

function AssessmentContent() {
  const router = useRouter()
  const searchParams = useSearchParams()
  const sector = searchParams.get('sector') || 'DT'

  const [answers, setAnswers] = useState<Record<string, number>>({})
  const [page, setPage] = useState(0)
  const [submitting, setSubmitting] = useState(false)

  const totalPages = Math.ceil(QUESTIONS.length / PER_PAGE)
  const pageQuestions = QUESTIONS.slice(page * PER_PAGE, (page + 1) * PER_PAGE)
  const progress = Math.round((page / totalPages) * 100)

  const likertLabels = ['ไม่เห็นด้วยเลย', 'ไม่ค่อยเห็นด้วย', 'กลางๆ', 'ค่อนข้างเห็นด้วย', 'เห็นด้วยมาก']

  async function handleSubmit() {
    setSubmitting(true)
    try {
      const res = await fetch('/api/assessment/submit', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ sector, answers }),
      })
      const data = await res.json()
      const params = new URLSearchParams({
        sector,
        result: JSON.stringify(data.recommendations),
      })
      router.push(`/result?${params.toString()}`)
    } catch (e) {
      console.error(e)
      setSubmitting(false)
    }
  }

  const isLastPage = page === totalPages - 1

  return (
    <main style={{ minHeight: '100vh', background: '#f5f0eb', padding: '1.5rem 1rem 5rem' }}>
      {/* Topbar */}
      <div style={{ display: 'flex', justifyContent: 'center', marginBottom: '1.5rem' }}>
        <div style={{
          background: '#2c2927', borderRadius: '999px',
          padding: '0.4rem 1.5rem',
          fontFamily: "'Caveat', cursive",
          fontSize: '1rem', color: '#f5f0eb',
        }}>
          CARIA — {sector === 'DT' ? 'Digital Technology' : 'Digital Communication'}
        </div>
      </div>

      {/* Progress bar */}
      <div style={{ maxWidth: 560, margin: '0 auto 1.5rem', height: 4, background: '#d6cfc8', borderRadius: 2 }}>
        <div style={{ height: '100%', width: `${progress}%`, background: '#2c2927', borderRadius: 2, transition: 'width 0.3s' }}/>
      </div>

      {/* Questions */}
      <div style={{ maxWidth: 560, margin: '0 auto', display: 'flex', flexDirection: 'column', gap: '2rem' }}>
        {pageQuestions.map((q) => (
          <div key={q.id} style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem' }}>
            <p style={{ textAlign: 'center', fontSize: '0.95rem', lineHeight: 1.6, color: '#2c2927' }}>
              {q.text}
            </p>
            <div style={{ display: 'flex', justifyContent: 'center', gap: '8px' }}>
              {[1, 2, 3, 4, 5].map(n => (
                <button
                  key={n}
                  onClick={() => setAnswers(prev => ({ ...prev, [q.id]: n }))}
                  title={likertLabels[n - 1]}
                  style={{
                    width: 40, height: 40,
                    borderRadius: '50%',
                    border: '1.5px solid',
                    borderColor: answers[q.id] === n ? '#2c2927' : '#b0a89e',
                    background: answers[q.id] === n ? '#2c2927' : 'transparent',
                    color: answers[q.id] === n ? '#f5f0eb' : '#8a7f78',
                    fontSize: '0.85rem',
                    cursor: 'pointer',
                    transition: 'all 0.15s',
                    fontFamily: "'Caveat', cursive",
                    fontWeight: 600,
                  }}
                >{n}</button>
              ))}
            </div>
            <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.7rem', color: '#a09890', padding: '0 4px' }}>
              <span>ไม่เห็นด้วยเลย</span>
              <span>เห็นด้วยมาก</span>
            </div>
          </div>
        ))}
      </div>

      {/* Nav */}
      <div style={{
        position: 'fixed', bottom: '1.5rem', left: '50%',
        transform: 'translateX(-50%)',
        display: 'flex', alignItems: 'center', gap: '1.5rem',
      }}>
        <button
          onClick={() => setPage(p => Math.max(0, p - 1))}
          disabled={page === 0}
          style={{
            width: 48, height: 48, borderRadius: '50%',
            border: '1.5px solid #2c2927',
            background: '#f5f0eb', cursor: page === 0 ? 'default' : 'pointer',
            fontSize: '1.2rem', opacity: page === 0 ? 0.3 : 1,
            display: 'flex', alignItems: 'center', justifyContent: 'center',
          }}
        >←</button>

        <span style={{ fontSize: '0.8rem', color: '#8a7f78', fontFamily: "'Caveat', cursive" }}>
          {page + 1} / {totalPages}
        </span>

        {isLastPage ? (
          <button
            onClick={handleSubmit}
            disabled={submitting}
            style={{
              padding: '0.6rem 1.5rem',
              borderRadius: '999px',
              border: 'none',
              background: '#2c2927',
              color: '#f5f0eb',
              fontSize: '0.9rem',
              cursor: submitting ? 'default' : 'pointer',
              fontFamily: "'Noto Sans Thai', sans-serif",
              opacity: submitting ? 0.6 : 1,
            }}
          >{submitting ? 'กำลังคำนวณ...' : 'ดูผลลัพธ์ ✓'}</button>
        ) : (
          <button
            onClick={() => setPage(p => Math.min(totalPages - 1, p + 1))}
            style={{
              width: 48, height: 48, borderRadius: '50%',
              border: '1.5px solid #2c2927',
              background: '#f5f0eb', cursor: 'pointer',
              fontSize: '1.2rem',
              display: 'flex', alignItems: 'center', justifyContent: 'center',
            }}
          >→</button>
        )}
      </div>
    </main>
  )
}

export default function AssessmentPage() {
  return (
    <Suspense>
      <AssessmentContent />
    </Suspense>
  )
}