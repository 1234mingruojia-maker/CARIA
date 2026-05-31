import { supabase } from './supabase'

// cache ไว้ใน memory ไม่ต้อง query ซ้ำทุก request
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

  console.log('Supabase data:', data?.length, 'error:', error)  // ย้ายมาหลัง query

  if (error) throw error
  careerCache = data
  return data
}
// แปลง DB row → flat score object { "Active Learning": 57.8, ... }
function rowToScores(row: CareerRow): Record<string, number> {
  // mapping col prefix → onet key
  const skillMap: Record<string, string> = {
    's_active_learning': 'Active Learning',
    's_active_listening': 'Active Listening',
    's_complex_problem_solving': 'Complex Problem Solving',
    's_coordination': 'Coordination',
    's_critical_thinking': 'Critical Thinking',
    's_equipment_maintenance': 'Equipment Maintenance',
    's_equipment_selection': 'Equipment Selection',
    's_installation': 'Installation',
    's_instructing': 'Instructing',
    's_judgment_and_decision_making': 'Judgment and Decision Making',
    's_learning_strategies': 'Learning Strategies',
    's_management_of_financial_resources': 'Management of Financial Resources',
    's_management_of_material_resources': 'Management of Material Resources',
    's_management_of_personnel_resources': 'Management of Personnel Resources',
    's_mathematics': 'Mathematics',
    's_monitoring': 'Monitoring',
    's_negotiation': 'Negotiation',
    's_operation_and_control': 'Operation and Control',
    's_operations_analysis': 'Operations Analysis',
    's_operations_monitoring': 'Operations Monitoring',
    's_persuasion': 'Persuasion',
    's_programming': 'Programming',
    's_quality_control_analysis': 'Quality Control Analysis',
    's_reading_comprehension': 'Reading Comprehension',
    's_repairing': 'Repairing',
    's_science': 'Science',
    's_service_orientation': 'Service Orientation',
    's_social_perceptiveness': 'Social Perceptiveness',
    's_speaking': 'Speaking',
    's_systems_analysis': 'Systems Analysis',
    's_systems_evaluation': 'Systems Evaluation',
    's_technology_design': 'Technology Design',
    's_time_management': 'Time Management',
    's_troubleshooting': 'Troubleshooting',
    's_writing': 'Writing',
  }

  const knowledgeMap: Record<string, string> = {
    'k_administration_and_management': 'Administration and Management',
    'k_administrative': 'Administrative',
    'k_biology': 'Biology',
    'k_building_and_construction': 'Building and Construction',
    'k_chemistry': 'Chemistry',
    'k_communications_and_media': 'Communications and Media',
    'k_computers_and_electronics': 'Computers and Electronics',
    'k_customer_and_personal_service': 'Customer and Personal Service',
    'k_design': 'Design',
    'k_economics_and_accounting': 'Economics and Accounting',
    'k_education_and_training': 'Education and Training',
    'k_engineering_and_technology': 'Engineering and Technology',
    'k_english_language': 'English Language',
    'k_fine_arts': 'Fine Arts',
    'k_food_production': 'Food Production',
    'k_foreign_language': 'Foreign Language',
    'k_geography': 'Geography',
    'k_history_and_archeology': 'History and Archeology',
    'k_law_and_government': 'Law and Government',
    'k_mathematics': 'Mathematics',
    'k_mechanical': 'Mechanical',
    'k_medicine_and_dentistry': 'Medicine and Dentistry',
    'k_personnel_and_human_resources': 'Personnel and Human Resources',
    'k_philosophy_and_theology': 'Philosophy and Theology',
    'k_physics': 'Physics',
    'k_production_and_processing': 'Production and Processing',
    'k_psychology': 'Psychology',
    'k_public_safety_and_security': 'Public Safety and Security',
    'k_sales_and_marketing': 'Sales and Marketing',
    'k_sociology_and_anthropology': 'Sociology and Anthropology',
    'k_telecommunications': 'Telecommunications',
    'k_therapy_and_counseling': 'Therapy and Counseling',
    'k_transportation': 'Transportation',
  }

  const scores: Record<string, number> = {}
  for (const [col, onetKey] of Object.entries({ ...skillMap, ...knowledgeMap })) {
    const val = row[col]
    if (val != null) scores[onetKey] = Number(val)
  }
  return scores
}

function prepareScores(
  studentScores: Record<string, number>,
  careerScores: Record<string, number>
): Record<string, number> {
  const adjusted: Record<string, number> = {}
  for (const [key, careerVal] of Object.entries(careerScores)) {
    const studentVal = studentScores[key] ?? 0
    adjusted[key] = studentVal >= careerVal ? careerVal : studentVal
  }
  return adjusted
}

function calculateMES(
  adjustedStudent: Record<string, number>,
  careerScores: Record<string, number>
): number {
  let sumSq = 0
  for (const [key, careerVal] of Object.entries(careerScores)) {
    const studentVal = adjustedStudent[key] ?? 0
    sumSq += Math.pow(studentVal - careerVal, 2)
  }
  return 1 / (1 + Math.sqrt(sumSq))
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

export async function recommendCareers(answers: Answers, sectorFilter?: string) {
  const careers = await getCareers()
  const studentFlat = { ...answers.skill, ...answers.knowledge }
  const results = []

  for (const career of careers) {
    if (sectorFilter && career.sector !== sectorFilter) continue

    const careerFlat = rowToScores(career)
    const adjusted = prepareScores(studentFlat, careerFlat)
    const mes = calculateMES(adjusted, careerFlat)
    const gaps = computeGaps(studentFlat, careerFlat)

    const topGaps = Object.fromEntries(
      Object.entries(gaps).sort((a, b) => b[1] - a[1]).slice(0, 5)
    )

    results.push({
      careerId: career.id,
      name: career.name,
      sector: career.sector,
      mesScore: Math.round(mes * 10000) / 10000,
      topGaps,
      allGaps: gaps,
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

export function getQuestionKeys() {
  // ใช้ questionMap แทน
  const { QUESTIONS } = require('./questionMap')
  const skill = QUESTIONS.filter((q: {type: string}) => q.type === 'skill' || q.type === 'attitude').map((q: {onetKey: string}) => q.onetKey)
  const knowledge = QUESTIONS.filter((q: {type: string}) => q.type === 'knowledge').map((q: {onetKey: string}) => q.onetKey)
  return { skill, knowledge }
}