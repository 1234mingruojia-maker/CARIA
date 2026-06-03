import { describe, it, expect, beforeAll } from 'vitest'
import { createClient, SupabaseClient } from '@supabase/supabase-js'

// ─── Types ────────────────────────────────────────────────────────────────────
type SkillGapNode = {
  id: string
  career_competency_id: string
  name: string
  gap_percentage: number
  is_center: boolean
  used_in_careers: string[] | null
  skill_match_percentage: number | null
  level_label: string | null
  description: string | null
}
type SkillSubcategory = { id: string; career_competency_id: string; name: string }
type Course = {
  id: string; career_competency_id: string; title: string
  level: 'Beginner' | 'Intermediate' | 'Advanced'
  hours: number; rating: number; reviews: number
}
type JobListing = {
  id: string; career_competency_id: string; title: string; company: string
  salary_min: number; salary_max: number
  work_type: 'On-site' | 'Hybrid' | 'Remote'; job_type: string
}
type Institution = {
  id: string; career_competency_id: string; name: string
  institution_type: string; program: string
  latitude: number; longitude: number; is_online: boolean; province: string
}

// ─── Helper: typed fetch (ไม่ใช้ .returns<T>() เพื่อหลีก chain error) ─────────
async function fetchAll<T>(
  supabase: SupabaseClient,
  table: string,
  cols: string,
  competencyId: string,
  limit?: number
): Promise<{ data: T[]; error: { message: string } | null }> {
  let q = supabase.from(table).select(cols).eq('career_competency_id', competencyId)
  if (limit) q = q.limit(limit)
  const { data, error } = await q
  return { data: (data ?? []) as T[], error }
}

async function fetchOne<T>(
  supabase: SupabaseClient,
  table: string,
  cols: string,
  competencyId: string,
  extraCol: string,
  extraVal: unknown
): Promise<{ data: T | null; error: { message: string } | null }> {
  const { data, error } = await supabase
    .from(table)
    .select(cols)
    .eq('career_competency_id', competencyId)
    .eq(extraCol, extraVal)
    .single()
  return { data: data as T | null, error }
}

// ─── Setup ────────────────────────────────────────────────────────────────────
let supabase: SupabaseClient
const COMPETENCY_ID = 'DC09'

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
  supabase = createClient(url, key)
  console.log(`\n🔌  ต่อ DB: ${url}`)
})

// ─── SUITE 1: skill_gap_nodes ─────────────────────────────────────────────────
describe('[SKILLS PAGE] skill_gap_nodes — Skill Gap Map', () => {

  it('มี node อย่างน้อย 1 รายการ', async () => {
    const { data, error } = await fetchAll<SkillGapNode>(supabase, 'skill_gap_nodes', '*', COMPETENCY_ID)
    expect(error, `DB error: ${error?.message}`).toBeNull()
    expect(data.length, 'ไม่พบ skill_gap_nodes').toBeGreaterThan(0)
    console.log(`\n📊  พบ ${data.length} nodes`)
    data.forEach(n => console.log(`   • [${n.is_center ? 'CENTER' : 'satellite'}] ${n.name} — ${n.gap_percentage}%`))
  })

  it('มี center node อย่างน้อย 1 node', async () => {
    const { data, error } = await fetchAll<SkillGapNode>(supabase, 'skill_gap_nodes', '*', COMPETENCY_ID)
    expect(error).toBeNull()
    const centers = data.filter(n => n.is_center)
    expect(centers.length, 'ไม่พบ center node').toBeGreaterThan(0)
    console.log(`\n🎯  Center node: ${centers[0].name} (gap: ${centers[0].gap_percentage}%)`)
  })

  it('ทุก node มี field ครบ: id, name, gap_percentage, is_center', async () => {
    const { data } = await fetchAll<SkillGapNode>(supabase, 'skill_gap_nodes', '*', COMPETENCY_ID)
    data.forEach(node => {
      expect(node.id,             `node ขาด id`).toBeTruthy()
      expect(node.name,           `node ขาด name`).toBeTruthy()
      expect(node.gap_percentage, `${node.name}: ขาด gap_percentage`).toBeDefined()
      expect(node.is_center,      `${node.name}: ขาด is_center`).toBeDefined()
    })
  })

  it('gap_percentage ทุก node อยู่ในช่วง 0–100', async () => {
    const { data } = await fetchAll<SkillGapNode>(supabase, 'skill_gap_nodes', 'name, gap_percentage', COMPETENCY_ID)
    data.forEach(node => {
      expect(node.gap_percentage, `${node.name}: gap ต่ำกว่า 0`).toBeGreaterThanOrEqual(0)
      expect(node.gap_percentage, `${node.name}: gap เกิน 100`).toBeLessThanOrEqual(100)
    })
  })

  it('center node มี skill_match_percentage', async () => {
    const { data, error } = await fetchOne<SkillGapNode>(
      supabase, 'skill_gap_nodes', 'name, skill_match_percentage', COMPETENCY_ID, 'is_center', true
    )
    expect(error).toBeNull()
    expect(data?.skill_match_percentage, 'center node ขาด skill_match_percentage').toBeDefined()
    expect(data!.skill_match_percentage!).toBeGreaterThanOrEqual(0)
    expect(data!.skill_match_percentage!).toBeLessThanOrEqual(100)
    console.log(`\n📈  Skill Match: ${data!.skill_match_percentage}%`)
  })

  it('center node มี used_in_careers เป็น array ไม่ว่าง', async () => {
    const { data, error } = await fetchOne<SkillGapNode>(
      supabase, 'skill_gap_nodes', 'name, used_in_careers', COMPETENCY_ID, 'is_center', true
    )
    expect(error).toBeNull()
    expect(Array.isArray(data?.used_in_careers), 'used_in_careers ต้องเป็น array').toBe(true)
    expect(data!.used_in_careers!.length, 'used_in_careers ว่าง').toBeGreaterThan(0)
    console.log(`\n💼  ใช้ในอาชีพ: ${data!.used_in_careers!.join(', ')}`)
  })

  it('จำนวน node ไม่เกิน 7 (UI รองรับ 1 center + 6 satellite)', async () => {
    const { data } = await fetchAll<SkillGapNode>(supabase, 'skill_gap_nodes', 'id', COMPETENCY_ID)
    expect(data.length, `มี ${data.length} nodes แต่ UI รองรับแค่ 7`).toBeLessThanOrEqual(7)
  })

})

// ─── SUITE 2: skill_subcategories ────────────────────────────────────────────
describe('[SKILLS PAGE] skill_subcategories — ทักษะย่อย', () => {

  it('มี subcategory อย่างน้อย 1 รายการ', async () => {
    const { data, error } = await fetchAll<SkillSubcategory>(supabase, 'skill_subcategories', '*', COMPETENCY_ID)
    expect(error).toBeNull()
    expect(data.length, 'ไม่พบ skill_subcategories').toBeGreaterThan(0)
    console.log(`\n🔸  Subcategories (${data.length}):`)
    data.forEach(s => console.log(`   • ${s.name}`))
  })

  it('ทุก subcategory มี id และ name', async () => {
    const { data } = await fetchAll<SkillSubcategory>(supabase, 'skill_subcategories', 'id, name', COMPETENCY_ID)
    data.forEach(s => {
      expect(s.id,   'subcategory ขาด id').toBeTruthy()
      expect(s.name, 'subcategory ขาด name').toBeTruthy()
    })
  })

})

// ─── SUITE 3: courses ─────────────────────────────────────────────────────────
describe('[SKILLS PAGE] courses — คอร์สเรียนแนะนำ', () => {

  it('มีคอร์สอย่างน้อย 1 รายการ', async () => {
    const { data, error } = await fetchAll<Course>(supabase, 'courses', '*', COMPETENCY_ID, 3)
    expect(error).toBeNull()
    expect(data.length, 'ไม่พบ courses').toBeGreaterThan(0)
    console.log(`\n📚  Courses (${data.length}):`)
    data.forEach(c => console.log(`   • [${c.level}] ${c.title} — ${c.hours}h ★${c.rating}`))
  })

  it('ทุกคอร์สมี field ครบ', async () => {
    const { data } = await fetchAll<Course>(supabase, 'courses', '*', COMPETENCY_ID, 3)
    data.forEach(c => {
      expect(c.id,      'course ขาด id').toBeTruthy()
      expect(c.title,   'course ขาด title').toBeTruthy()
      expect(c.level,   `${c.title}: ขาด level`).toBeTruthy()
      expect(c.hours,   `${c.title}: ขาด hours`).toBeDefined()
      expect(c.rating,  `${c.title}: ขาด rating`).toBeDefined()
      expect(c.reviews, `${c.title}: ขาด reviews`).toBeDefined()
    })
  })

  it('level ต้องเป็น Beginner | Intermediate | Advanced', async () => {
    const { data } = await fetchAll<Course>(supabase, 'courses', 'title, level', COMPETENCY_ID)
    const validLevels = ['Beginner', 'Intermediate', 'Advanced']
    data.forEach(c => {
      expect(validLevels, `${c.title}: level "${c.level}" ไม่ถูกต้อง`).toContain(c.level)
    })
  })

  it('rating อยู่ในช่วง 0–5', async () => {
    const { data } = await fetchAll<Course>(supabase, 'courses', 'title, rating', COMPETENCY_ID)
    data.forEach(c => {
      expect(c.rating, `${c.title}: rating < 0`).toBeGreaterThanOrEqual(0)
      expect(c.rating, `${c.title}: rating > 5`).toBeLessThanOrEqual(5)
    })
  })

  it('hours และ reviews เป็นตัวเลขบวก', async () => {
    const { data } = await fetchAll<Course>(supabase, 'courses', 'title, hours, reviews', COMPETENCY_ID)
    data.forEach(c => {
      expect(c.hours,   `${c.title}: hours ต้องบวก`).toBeGreaterThan(0)
      expect(c.reviews, `${c.title}: reviews ต้องบวก`).toBeGreaterThanOrEqual(0)
    })
  })

})

// ─── SUITE 4: job_listings ────────────────────────────────────────────────────
describe('[SKILLS PAGE] job_listings — ตำแหน่งงาน', () => {

  it('มีงานอย่างน้อย 1 รายการ', async () => {
    const { data, error } = await fetchAll<JobListing>(supabase, 'job_listings', '*', COMPETENCY_ID, 3)
    expect(error).toBeNull()
    expect(data.length, 'ไม่พบ job_listings').toBeGreaterThan(0)
    console.log(`\n💼  Jobs (${data.length}):`)
    data.forEach(j =>
      console.log(`   • ${j.title} @ ${j.company} — ${j.salary_min.toLocaleString()}–${j.salary_max.toLocaleString()} บาท [${j.work_type}]`)
    )
  })

  it('ทุก job มี field ครบ', async () => {
    const { data } = await fetchAll<JobListing>(supabase, 'job_listings', '*', COMPETENCY_ID, 3)
    data.forEach(j => {
      expect(j.id,         'job ขาด id').toBeTruthy()
      expect(j.title,      'job ขาด title').toBeTruthy()
      expect(j.company,    `${j.title}: ขาด company`).toBeTruthy()
      expect(j.salary_min, `${j.title}: ขาด salary_min`).toBeDefined()
      expect(j.salary_max, `${j.title}: ขาด salary_max`).toBeDefined()
      expect(j.work_type,  `${j.title}: ขาด work_type`).toBeTruthy()
      expect(j.job_type,   `${j.title}: ขาด job_type`).toBeTruthy()
    })
  })

  it('salary_min < salary_max', async () => {
    const { data } = await fetchAll<JobListing>(supabase, 'job_listings', 'title, salary_min, salary_max', COMPETENCY_ID)
    data.forEach(j => {
      expect(j.salary_min, `${j.title}: salary_min >= salary_max`).toBeLessThan(j.salary_max)
    })
  })

  it('work_type ต้องเป็น On-site | Hybrid | Remote', async () => {
    const { data } = await fetchAll<JobListing>(supabase, 'job_listings', 'title, work_type', COMPETENCY_ID)
    const validTypes = ['On-site', 'Hybrid', 'Remote']
    data.forEach(j => {
      expect(validTypes, `${j.title}: work_type "${j.work_type}" ไม่ถูกต้อง`).toContain(j.work_type)
    })
  })

  it('salary_min และ salary_max เป็นตัวเลขบวก', async () => {
    const { data } = await fetchAll<JobListing>(supabase, 'job_listings', 'title, salary_min, salary_max', COMPETENCY_ID)
    data.forEach(j => {
      expect(j.salary_min, `${j.title}: salary_min ต้องบวก`).toBeGreaterThan(0)
      expect(j.salary_max, `${j.title}: salary_max ต้องบวก`).toBeGreaterThan(0)
    })
  })

})

// ─── SUITE 5: institutions ────────────────────────────────────────────────────
describe('[SKILLS PAGE] institutions — สถาบัน', () => {

  it('มีสถาบันอย่างน้อย 1 รายการ', async () => {
    const { data, error } = await fetchAll<Institution>(supabase, 'institutions', '*', COMPETENCY_ID)
    expect(error).toBeNull()
    expect(data.length, 'ไม่พบ institutions').toBeGreaterThan(0)
    console.log(`\n🏫  Institutions (${data.length}):`)
    data.forEach(i => console.log(`   • ${i.name} [${i.province}] ${i.is_online ? '🟢 Online' : ''}`))
  })

  it('ทุกสถาบันมี field ครบ', async () => {
    const { data } = await fetchAll<Institution>(supabase, 'institutions', '*', COMPETENCY_ID)
    data.forEach(inst => {
      expect(inst.id,               'institution ขาด id').toBeTruthy()
      expect(inst.name,             'institution ขาด name').toBeTruthy()
      expect(inst.institution_type, `${inst.name}: ขาด institution_type`).toBeTruthy()
      expect(inst.province,         `${inst.name}: ขาด province`).toBeTruthy()
      expect(inst.latitude,         `${inst.name}: ขาด latitude`).toBeDefined()
      expect(inst.longitude,        `${inst.name}: ขาด longitude`).toBeDefined()
    })
  })

  it('latitude/longitude อยู่ในช่วงพิกัดประเทศไทย (lat 5–21, lng 97–106)', async () => {
    const { data } = await fetchAll<Institution>(supabase, 'institutions', 'name, latitude, longitude', COMPETENCY_ID)
    data.forEach(inst => {
      expect(inst.latitude,  `${inst.name}: lat นอกช่วงไทย`).toBeGreaterThanOrEqual(5)
      expect(inst.latitude,  `${inst.name}: lat นอกช่วงไทย`).toBeLessThanOrEqual(21)
      expect(inst.longitude, `${inst.name}: lng นอกช่วงไทย`).toBeGreaterThanOrEqual(97)
      expect(inst.longitude, `${inst.name}: lng นอกช่วงไทย`).toBeLessThanOrEqual(106)
    })
  })

  it('is_online เป็น boolean', async () => {
    const { data } = await fetchAll<Institution>(supabase, 'institutions', 'name, is_online', COMPETENCY_ID)
    data.forEach(inst => {
      expect(typeof inst.is_online, `${inst.name}: is_online ไม่ใช่ boolean`).toBe('boolean')
    })
  })

  it('filter ตาม province ได้ถูกต้อง', async () => {
    const { data: all } = await fetchAll<Institution>(supabase, 'institutions', 'province', COMPETENCY_ID)
    if (!all.length) return

    const targetProvince = all[0].province
    const { data: filtered, error } = await supabase
      .from('institutions')
      .select('name, province')
      .eq('career_competency_id', COMPETENCY_ID)
      .eq('province', targetProvince)

    const rows = (filtered ?? []) as Institution[]
    expect(error).toBeNull()
    rows.forEach(inst => {
      expect(inst.province, `${inst.name}: province ไม่ตรง`).toBe(targetProvince)
    })
    console.log(`\n🗺️  filter province "${targetProvince}" → ${rows.length} สถาบัน`)
  })

})

// ─── SUITE 6: data consistency ────────────────────────────────────────────────
describe('[SKILLS PAGE] Data consistency — ข้อมูลสอดคล้องกัน', () => {

  it('ทุกตารางมีข้อมูลสำหรับ COMPETENCY_ID เดียวกัน', async () => {
    const results = await Promise.all([
      fetchAll<{id:string}>(supabase, 'skill_gap_nodes',    'id', COMPETENCY_ID),
      fetchAll<{id:string}>(supabase, 'skill_subcategories','id', COMPETENCY_ID),
      fetchAll<{id:string}>(supabase, 'courses',            'id', COMPETENCY_ID),
      fetchAll<{id:string}>(supabase, 'job_listings',       'id', COMPETENCY_ID),
      fetchAll<{id:string}>(supabase, 'institutions',       'id', COMPETENCY_ID),
    ])

    const [nodes, subs, crs, jobs, insts] = results.map(r => r.data)

    console.log(`\n📦  Data count สำหรับ ${COMPETENCY_ID}:`)
    console.log(`   skill_gap_nodes:     ${nodes.length}`)
    console.log(`   skill_subcategories: ${subs.length}`)
    console.log(`   courses:             ${crs.length}`)
    console.log(`   job_listings:        ${jobs.length}`)
    console.log(`   institutions:        ${insts.length}`)

    expect(nodes.length,  'skill_gap_nodes ว่าง').toBeGreaterThan(0)
    expect(subs.length,   'skill_subcategories ว่าง').toBeGreaterThan(0)
    expect(crs.length,    'courses ว่าง').toBeGreaterThan(0)
    expect(jobs.length,   'job_listings ว่าง').toBeGreaterThan(0)
    expect(insts.length,  'institutions ว่าง').toBeGreaterThan(0)
  })

  it('skill_match_percentage ของ center node เป็น finite number', async () => {
    const { data, error } = await fetchOne<SkillGapNode>(
      supabase, 'skill_gap_nodes', 'skill_match_percentage', COMPETENCY_ID, 'is_center', true
    )
    expect(error).toBeNull()
    expect(data?.skill_match_percentage).toBeDefined()
    expect(Number.isFinite(data!.skill_match_percentage)).toBe(true)
    console.log(`\n🎯  Skill Match ที่แสดงบน UI: ${data!.skill_match_percentage}%`)
  })

})