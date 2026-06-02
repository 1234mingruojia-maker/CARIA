// src/lib/scoring.ts

import { supabase } from './supabase'
import { mapAnswersToScoring } from './questionMap'

let careerCache: CareerRow[] | null = null

type CareerRow = {
  id: string
  name: string
  sector: string
  [key: string]: number | string | string[] | null
}

async function getCareers(): Promise<CareerRow[]> {
  if (careerCache) return careerCache
  const { data, error } = await supabase
    .from('career_competency')
    .select('*')
  if (error) throw error
  careerCache = data
  return data
}

function rowToScores(row: CareerRow): Record<string, number> {
  const scores: Record<string, number> = {}
  for (const [key, val] of Object.entries(row)) {
    if (
      (key.startsWith('s_') || key.startsWith('k_') || key.startsWith('a_')) &&
      val != null
    ) {
      scores[key] = Number(val)
    }
  }
  return scores
}

// ── คำนวณ RMSE บนหน่วยดิบ (0-100) แบบมี Capping ──
// ตรรกะ: ถ้าคะแนนผู้ใช้ (sv) สูงกว่าหรือเท่ากับเกณฑ์อาชีพ (cv) มองว่าความต่างเป็น 0 (เก่งกว่าไม่หักคะแนน)
// ช่วยแก้ปัญหาการตอบ 100 ทุกข้อแล้วคะแนนรวมตกต่ำลง
function calculateRawMES(
  studentFlat: Record<string, number>,
  careerFlat: Record<string, number>
): number {
  const keys = Object.keys(careerFlat)
  if (keys.length === 0) return 0

  let sumSq = 0

  for (const key of keys) {
    const cv = careerFlat[key]
    const sv = studentFlat[key] !== undefined ? studentFlat[key] : 0

    // Capping Logic: เก่งกว่าเกณฑ์ไม่โดนลงโทษ
    const effectiveSv = sv >= cv ? cv : sv

    sumSq += Math.pow(effectiveSv - cv, 2)
  }

  const rmse = Math.sqrt(sumSq / keys.length)

  // แปลงจาก Distance ➔ Similarity (MES Score 0-1)
  return 1 / (1 + (rmse / 100))
}

function computeGaps(
  studentScores: Record<string, number>,
  careerScores: Record<string, number>
): Record<string, number> {
  const gaps: Record<string, number> = {}
  for (const [key, careerVal] of Object.entries(careerScores)) {
    const studentVal = studentScores[key] ?? 0
    const gap = Math.round((careerVal - studentVal) * 10) / 10
    if (gap > 0) gaps[key] = gap
  }
  return gaps
}

export type Answers = {
  skill?: Record<string, number>
  knowledge?: Record<string, number>
}

export async function recommendCareers(
  answersLegacy: Answers,
  rawAnswers: Record<string, number>,
  sectorFilter?: string
) {
  const careers = await getCareers()
  const mappedFlat = mapAnswersToScoring(rawAnswers)

  const studentFlat =
    rawAnswers && Object.keys(mappedFlat).length === 0
      ? rawAnswers
      : mappedFlat

  const results = []

  for (const career of careers) {
    if (sectorFilter && career.sector !== sectorFilter) continue

    const careerFlat = rowToScores(career)

    const mes  = calculateRawMES(studentFlat, careerFlat)
    const gaps = computeGaps(studentFlat, careerFlat)

    const topGaps = Object.fromEntries(
      Object.entries(gaps).sort((a, b) => b[1] - a[1]).slice(0, 5)
    )

    results.push({
      careerId:  career.id,
      name:      career.name,
      sector:    career.sector,
      mesScore:  Math.round(mes * 10000) / 10000,
      topGaps,
      allGaps:   gaps,
    })
  }

  results.sort((a, b) => b.mesScore - a.mesScore)
  return { top10: results.slice(0, 10), totalEvaluated: results.length }
}

export async function getCareerList(sectorFilter?: string) {
  const careers = await getCareers()
  return careers
    .filter(c => !sectorFilter || c.sector === sectorFilter)
    .map(c => ({ id: c.id, name: c.name, sector: c.sector }))
}

export async function getCareerDetail(careerId: string) {
  const careers = await getCareers()
  return careers.find(c => c.id === careerId.toUpperCase()) || null
}