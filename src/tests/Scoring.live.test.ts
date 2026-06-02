// src/tests/scoring.live.test.ts

import { describe, it, expect, beforeAll } from 'vitest'
import { recommendCareers, getCareerList } from '@/lib/scoring'
import { supabase } from '@/lib/supabase'

// ─────────────────────────────────────────────────────────────
// ตรวจ env ก่อนรัน — fail ชัดๆ ถ้าไม่ตั้งค่า
// ─────────────────────────────────────────────────────────────
beforeAll(() => {
  const url = process.env.NEXT_PUBLIC_SUPABASE_URL
  const key =
    process.env.SUPABASE_SERVICE_ROLE_KEY ??
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY

  if (!url || !key) {
    throw new Error(
      '\n❌  ไม่พบ Supabase credentials ใน .env.local\n' +
      '   ต้องมี NEXT_PUBLIC_SUPABASE_URL และ\n' +
      '   SUPABASE_SERVICE_ROLE_KEY (หรือ NEXT_PUBLIC_SUPABASE_ANON_KEY)\n'
    )
  }

  console.log(`\n🔌  ต่อ DB: ${url}`)
})

// ─────────────────────────────────────────────────────────────
// helper: สร้าง answers ที่มีค่า default 50 ทุก key
// ─────────────────────────────────────────────────────────────
function answers(overrides: Record<string, number> = {}): Record<string, number> {
  const defaults: Record<string, number> = {
    // Skills
    s_active_learning: 50,         s_active_listening: 50,
    s_critical_thinking: 50,       s_complex_problem_solving: 50,
    s_coordination: 50,            s_equipment_maintenance: 50,
    s_equipment_selection: 50,     s_installation: 50,
    s_instructing: 50,             s_judgment_and_decision_making: 50,
    s_learning_strategies: 50,     s_management_of_financial_resources: 50,
    s_management_of_material_resources: 50,
    s_management_of_personnel_resources: 50,
    s_mathematics: 50,             s_monitoring: 50,
    s_negotiation: 50,             s_operation_and_control: 50,
    s_operations_analysis: 50,     s_operations_monitoring: 50,
    s_persuasion: 50,              s_programming: 50,
    s_quality_control_analysis: 50, s_reading_comprehension: 50,
    s_repairing: 50,               s_science: 50,
    s_service_orientation: 50,     s_social_perceptiveness: 50,
    s_speaking: 50,                s_systems_analysis: 50,
    s_systems_evaluation: 50,      s_technology_design: 50,
    s_time_management: 50,         s_troubleshooting: 50,
    s_writing: 50,
    // Attitudes
    a_artistic: 50,      a_conventional: 50,  a_enterprising: 50,
    a_investigative: 50, a_realistic: 50,      a_social: 50,
    // Knowledge
    k_administration_and_management: 50, k_administrative: 50,
    k_biology: 50,                       k_building_and_construction: 50,
    k_chemistry: 50,                     k_communications_and_media: 50,
    k_computers_and_electronics: 50,     k_customer_and_personal_service: 50,
    k_design: 50,                        k_economics_and_accounting: 50,
    k_education_and_training: 50,        k_engineering_and_technology: 50,
    k_english_language: 50,              k_fine_arts: 50,
    k_food_production: 50,               k_foreign_language: 50,
    k_geography: 50,                     k_history_and_archeology: 50,
    k_law_and_government: 50,            k_mathematics: 50,
    k_mechanical: 50,                    k_medicine_and_dentistry: 50,
    k_personnel_and_human_resources: 50, k_philosophy_and_theology: 50,
    k_physics: 50,                       k_production_and_processing: 50,
    k_psychology: 50,                    k_public_safety_and_security: 50,
    k_sales_and_marketing: 50,           k_sociology_and_anthropology: 50,
    k_telecommunications: 50,            k_therapy_and_counseling: 50,
    k_transportation: 50,
  }
  return { ...defaults, ...overrides }
}

// ─────────────────────────────────────────────────────────────
// SUITE 1: DB connectivity + data sanity
// ─────────────────────────────────────────────────────────────
describe('[LIVE] DB connectivity & data sanity', () => {
  it('ดึงรายการอาชีพได้ และมีอย่างน้อย 1 อาชีพ', async () => {
    const careers = await getCareerList()
    console.log(`\n📋  พบอาชีพทั้งหมด ${careers.length} ตำแหน่ง`)
    careers.forEach(c => console.log(`   • [${c.sector}] ${c.id} — ${c.name}`))
    expect(careers.length).toBeGreaterThan(0)
  })

  it('ทุกอาชีพมี id, name, sector ครบ', async () => {
    const careers = await getCareerList()
    careers.forEach(c => {
      expect(c.id,     `${c.name}: ขาด id`).toBeTruthy()
      expect(c.name,   `${c.id}: ขาด name`).toBeTruthy()
      expect(c.sector, `${c.id}: ขาด sector`).toBeTruthy()
    })
  })

  it('มี sector DT หรือ DC อย่างน้อย 1 อาชีพ', async () => {
    const careers = await getCareerList()
    const sectors  = new Set(careers.map(c => c.sector))
    console.log(`\n📂  Sectors ที่พบ: ${[...sectors].join(', ')}`)
    const hasKnownSector = sectors.has('DT') || sectors.has('DC')
    expect(hasKnownSector).toBe(true)
  })
})

// ─────────────────────────────────────────────────────────────
// SUITE 2: recommendCareers กับข้อมูล DB จริง
// ─────────────────────────────────────────────────────────────
describe('[LIVE] recommendCareers — ผลลัพธ์พื้นฐาน', () => {
  it('คืน top10 ได้ พร้อม structure ถูกต้องทุก field', async () => {
    const result = await recommendCareers({}, answers(), undefined)

    console.log(`\n📊  ประเมินทั้งหมด ${result.totalEvaluated} อาชีพ`)
    console.log('🏆  Top 10:')
    result.top10.forEach((r, i) => {
      console.log(`   ${i + 1}. [${r.sector}] ${r.name} — MES: ${r.mesScore}`)
    })

    expect(result.top10.length).toBeGreaterThan(0)
    expect(result.totalEvaluated).toBeGreaterThan(0)

    result.top10.forEach(r => {
      expect(r.careerId,  'ขาด careerId').toBeTruthy()
      expect(r.name,      'ขาด name').toBeTruthy()
      expect(r.sector,    'ขาด sector').toBeTruthy()
      expect(r.mesScore,  'ขาด mesScore').toBeDefined()
      expect(r.topGaps,   'ขาด topGaps').toBeDefined()
    })
  })

  it('mesScore ทุกตัวอยู่ในช่วง 0–1', async () => {
    const result = await recommendCareers({}, answers(), undefined)
    result.top10.forEach(r => {
      expect(r.mesScore, `${r.name} mesScore เกิน range`).toBeGreaterThanOrEqual(0)
      expect(r.mesScore, `${r.name} mesScore เกิน 1`).toBeLessThanOrEqual(1)
    })
  })

  it('mesScore เรียงจากมากไปน้อย', async () => {
    const result = await recommendCareers({}, answers(), undefined)
    for (let i = 0; i < result.top10.length - 1; i++) {
      expect(
        result.top10[i].mesScore,
        `อันดับ ${i + 1} (${result.top10[i].mesScore}) < อันดับ ${i + 2} (${result.top10[i + 1].mesScore})`
      ).toBeGreaterThanOrEqual(result.top10[i + 1].mesScore)
    }
  })

  it('กรอง sector DT ได้ถูกต้อง', async () => {
    const careers = await getCareerList('DT')
    if (careers.length === 0) return

    const result = await recommendCareers({}, answers(), 'DT')
    result.top10.forEach(r => {
      expect(r.sector, `${r.name} sector ไม่ใช่ DT`).toBe('DT')
    })
  })

  it('กรอง sector DC ได้ถูกต้อง', async () => {
    const careers = await getCareerList('DC')
    if (careers.length === 0) return

    const result = await recommendCareers({}, answers(), 'DC')
    result.top10.forEach(r => {
      expect(r.sector, `${r.name} sector ไม่ใช่ DC`).toBe('DC')
    })
  })
})

// ─────────────────────────────────────────────────────────────
// SUITE 3: sensitivity test — เปลี่ยน input เห็นผลจริง
// ─────────────────────────────────────────────────────────────
describe('[LIVE] Sensitivity — scoring ตอบสนองต่อ input', () => {
  it('ตอบ 100 ทุกข้อ → MES สูงกว่าตอบ 0 ทุกข้อ (อันดับ 1)', async () => {
    const resMax = await recommendCareers({}, answers(allKeys(100)), undefined)
    const resMin = await recommendCareers({}, answers(allKeys(0)),   undefined)

    const mesMax = resMax.top10[0]?.mesScore ?? 0
    const mesMin = resMin.top10[0]?.mesScore ?? 0

    console.log(`\n📈  ตอบ 100 ทุกข้อ → top MES: ${mesMax}`)
    console.log(`📉  ตอบ 0 ทุกข้อ   → top MES: ${mesMin}`)

    expect(mesMax).toBeGreaterThan(mesMin)
  })

  it('เปลี่ยนโปรไฟล์ → อันดับ 1 เปลี่ยนหรือ score เปลี่ยน', async () => {
    const resA = await recommendCareers({}, answers({
      s_programming: 95,
      k_computers_and_electronics: 92,
      k_mathematics: 90,
      a_investigative: 88,
      s_critical_thinking: 85,
      a_artistic: 10, k_design: 10, a_social: 15,
    }), undefined)

    const resB = await recommendCareers({}, answers({
      k_design: 95,
      a_artistic: 92,
      s_social_perceptiveness: 88,
      a_social: 85,
      s_service_orientation: 82,
      s_programming: 10, k_mathematics: 10, a_investigative: 15,
    }), undefined)

    console.log(`\n👨‍💻  โปรไฟล์ A (programmer) → อันดับ 1: ${resA.top10[0]?.name} (${resA.top10[0]?.mesScore})`)
    console.log(`🎨  โปรไฟล์ B (designer)    → อันดับ 1: ${resB.top10[0]?.name} (${resB.top10[0]?.mesScore})`)

    const different =
      resA.top10[0]?.careerId !== resB.top10[0]?.careerId ||
      Math.abs(resA.top10[0]?.mesScore - resB.top10[0]?.mesScore) > 0.001

    expect(different, 'โปรไฟล์ต่างกันมาก แต่ได้ผลเหมือนกันทุกอย่าง — scoring ไม่ sensitive').toBe(true)
  })

  it('เพิ่ม skill ที่ขาดอยู่ → MES ของอาชีพที่ต้องการ skill นั้น ต้องสูงขึ้น', async () => {
    const baseResult = await recommendCareers({}, answers(), undefined)
    const topCareer  = baseResult.top10[0]

    if (!topCareer) return

    const biggestGapKey = Object.entries(topCareer.topGaps)
      .sort((a, b) => b[1] - a[1])[0]?.[0]

    if (!biggestGapKey) return

    console.log(`\n🔬  อาชีพ top: ${topCareer.name}`)
    console.log(`   biggest gap: ${biggestGapKey} (gap = ${topCareer.topGaps[biggestGapKey]})`)

    const { data: careerData } = await supabase
      .from('career_competency')
      .select(biggestGapKey)
      .eq('id', topCareer.careerId)
      .single()

    const rawData = careerData as Record<string, any> | null
    const targetValue = rawData && rawData[biggestGapKey] !== undefined ? Number(rawData[biggestGapKey]) : 100

    const improvedAnswers = answers({ [biggestGapKey]: targetValue })
    const improvedResult  = await recommendCareers({}, improvedAnswers, topCareer.sector)
    const improvedCareer  = improvedResult.top10.find(r => r.careerId === topCareer.careerId)

    console.log(`   MES เดิม: ${topCareer.mesScore}`)
    console.log(`   MES หลังเพิ่ม skill (พอดีเกณฑ์): ${improvedCareer?.mesScore}`)

    expect(improvedCareer, `${topCareer.name} หายจาก top10 หลังเพิ่ม skill`).toBeDefined()
    expect(improvedCareer!.mesScore).toBeGreaterThanOrEqual(topCareer.mesScore)
  })
})

// ─────────────────────────────────────────────────────────────
// SUITE 4: topGaps จาก DB จริง
// ─────────────────────────────────────────────────────────────
describe('[LIVE] topGaps — ข้อมูล gap จาก DB จริง', () => {
  it('topGaps มีไม่เกิน 5 รายการทุกอาชีพ', async () => {
    const result = await recommendCareers({}, answers(), undefined)
    result.top10.forEach(r => {
      expect(Object.keys(r.topGaps).length).toBeLessThanOrEqual(5)
    })
  })

  it('topGaps มีเฉพาะค่าบวก (career > student)', async () => {
    const result = await recommendCareers({}, answers(), undefined)
    result.top10.forEach(r => {
      Object.entries(r.topGaps).forEach(([key, val]) => {
        expect(val).toBeGreaterThan(0)
      })
    })
  })

  it('แสดง gap สรุปของ top 3 อาชีพ', async () => {
    const result = await recommendCareers({}, answers(), undefined)
    console.log('\n📋  Gap summary ของ top 3 อาชีพ:')
    result.top10.slice(0, 3).forEach((r, i) => {
      const gaps = Object.entries(r.topGaps)
        .sort((a, b) => b[1] - a[1])
        .map(([k, v]) => `${k}(${v})`)
        .join(', ')
      console.log(`   ${i + 1}. ${r.name}: ${gaps || '—'}`)
    })
    expect(true).toBe(true)
  })
})

// ─────────────────────────────────────────────────────────────
// SUITE 5: Exact Match Test — กรอกคะแนนตรงตัวเป๊ะตาม DB
// ─────────────────────────────────────────────────────────────
describe('[LIVE] Exact Match — กรอกคะแนนตรงเกณฑ์อาชีพเป๊ะๆ', () => {
  it('เมื่อกรอกคะแนนตามเกณฑ์อาชีพใดๆ อาชีพนั้นต้องได้อันดับ 1 และ MES = 1', async () => {
    const { data: allCareersFromDB, error } = await supabase
      .from('career_competency')
      .select('*')

    if (error) throw error
    if (!allCareersFromDB || allCareersFromDB.length === 0) {
      console.warn('⚠️ ไม่พบข้อมูลอาชีพใน DB — ข้ามเทสนี้')
      return
    }

    console.log(`\n🧪 เริ่มทดสอบ Exact Match ทั้งหมด ${allCareersFromDB.length} อาชีพ:`)

    for (const careerRow of allCareersFromDB) {
      const mockUserAnswers: Record<string, number> = {}

      for (const [key, val] of Object.entries(careerRow)) {
        if (
          (key.startsWith('s_') || key.startsWith('k_') || key.startsWith('a_')) &&
          val != null
        ) {
          mockUserAnswers[key] = Number(val)
        }
      }

      // 🛠️ แก้ไข (Fix): ส่งอาชีพของเซกเตอร์นั้น (careerRow.sector) เข้าไปกรองตรงตัว
      // เพื่อให้สอดคล้องกับพฤติกรรมหน้าบ้านจริงที่ระบบบังคับให้แยกทำแบบทดสอบ DT/DC อยู่แล้ว
      const result = await recommendCareers({}, mockUserAnswers, careerRow.sector)
      const topRank = result.top10[0]

      console.log(`   🎯 อาชีพเป้าหมาย: [${careerRow.sector}] ${careerRow.name}`)
      console.log(`      ➔ อันดับ 1 ที่ระบบคำนวณได้: ${topRank?.name} (MES: ${topRank?.mesScore})`)

      expect(topRank?.careerId, `อาชีพ ${careerRow.name} กรอกคะแนนเป๊ะแล้ว แต่อันดับ 1 ไม่ตรง`).toBe(careerRow.id)
      expect(topRank?.mesScore, `อาชีพ ${careerRow.name} คะแนนไม่ได้เต็ม 1`).toBeGreaterThanOrEqual(0.999)
    }
    
    console.log(`\n✅ ผ่านการทดสอบ Exact Match ครบทุกอาชีพเรียบร้อย!`)
  })
})

// ─────────────────────────────────────────────────────────────
// helper: สร้าง override ทุก key เป็นค่าเดียวกัน
// ─────────────────────────────────────────────────────────────
function allKeys(value: number): Record<string, number> {
  const keys = [
    's_active_learning','s_active_listening','s_critical_thinking',
    's_complex_problem_solving','s_coordination','s_equipment_maintenance',
    's_equipment_selection','s_installation','s_instructing',
    's_judgment_and_decision_making','s_learning_strategies',
    's_management_of_financial_resources','s_management_of_material_resources',
    's_management_of_personnel_resources','s_mathematics','s_monitoring',
    's_negotiation','s_operation_and_control','s_operations_analysis',
    's_operations_monitoring','s_persuasion','s_programming',
    's_quality_control_analysis','s_reading_comprehension','s_repairing',
    's_science','s_service_orientation','s_social_perceptiveness',
    's_speaking','s_systems_analysis','s_systems_evaluation',
    's_technology_design','s_time_management','s_troubleshooting','s_writing',
    'a_artistic','a_conventional','a_enterprising','a_investigative',
    'a_realistic','a_social',
    'k_administration_and_management','k_administrative','k_biology',
    'k_building_and_construction','k_chemistry','k_communications_and_media',
    'k_computers_and_electronics','k_customer_and_personal_service','k_design',
    'k_economics_and_accounting','k_education_and_training',
    'k_engineering_and_technology','k_english_language','k_fine_arts',
    'k_food_production','k_foreign_language','k_geography',
    'k_history_and_archeology','k_law_and_government','k_mathematics',
    'k_mechanical','k_medicine_and_dentistry','k_personnel_and_human_resources',
    'k_philosophy_and_theology','k_physics','k_production_and_processing',
    'k_psychology','k_public_safety_and_security','k_sales_and_marketing',
    'k_sociology_and_anthropology','k_telecommunications',
    'k_therapy_and_counseling','k_transportation',
  ]
  return Object.fromEntries(keys.map(k => [k, value]))
}