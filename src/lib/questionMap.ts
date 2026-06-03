export type Question = {
  id: string
  dbColumn: string
  onetKey: string
  text: string
  type: 'skill' | 'attitude' | 'knowledge'
}

export const QUESTIONS: Question[] = [
  // ── 1. SKILLS (S01–S35) = 35 ข้อ ─────────────────────────────────────────
  { id:'S01', dbColumn:'s_active_learning',           onetKey:'s_active_learning',           type:'skill', text:'ฉันสามารถเรียนรู้เรื่องใหม่ได้ด้วยตัวเองโดยไม่ต้องมีคนสอน' },
  { id:'S02', dbColumn:'s_active_listening',          onetKey:'s_active_listening',          type:'skill', text:'ฉันสามารถรับฟังผู้อื่นได้อย่างตั้งใจและจับประเด็นสำคัญได้' },
  { id:'S03', dbColumn:'s_complex_problem_solving',   onetKey:'s_complex_problem_solving',   type:'skill', text:'ฉันสามารถแก้ปัญหาที่ซับซ้อนหรือมีหลายตัวแปรได้อย่างเป็นระบบ' },
  { id:'S04', dbColumn:'s_coordination',              onetKey:'s_coordination',              type:'skill', text:'ฉันสามารถประสานงานกับหลายฝ่ายพร้อมกันได้โดยไม่เกิดความสับสน' },
  { id:'S05', dbColumn:'s_critical_thinking',         onetKey:'s_critical_thinking',         type:'skill', text:'ฉันสามารถวิเคราะห์ปัญหาและหาสาเหตุที่แท้จริงได้ก่อนตัดสินใจแก้ไข' },
  { id:'S06', dbColumn:'s_equipment_maintenance',     onetKey:'s_equipment_maintenance',     type:'skill', text:'ฉันสามารถดูแลและบำรุงรักษาอุปกรณ์หรือเครื่องมือที่ใช้งานได้' },
  { id:'S07', dbColumn:'s_equipment_selection',       onetKey:'s_equipment_selection',       type:'skill', text:'ฉันสามารถเลือกอุปกรณ์หรือเครื่องมือที่เหมาะสมกับงานแต่ละประเภทได้' },
  { id:'S08', dbColumn:'s_installation',              onetKey:'s_installation',              type:'skill', text:'ฉันสามารถติดตั้งซอฟต์แวร์ ระบบ หรืออุปกรณ์ได้ด้วยตัวเอง' },
  { id:'S09', dbColumn:'s_instructing',               onetKey:'s_instructing',               type:'skill', text:'ฉันสามารถอธิบายหรือสอนสิ่งที่ฉันรู้ให้คนอื่นเข้าใจได้' },
  { id:'S10', dbColumn:'s_judgment_and_decision_making', onetKey:'s_judgment_and_decision_making', type:'skill', text:'ฉันสามารถตัดสินใจในสถานการณ์ที่มีข้อมูลไม่ครบหรือมีความกดดันได้' },
  { id:'S11', dbColumn:'s_learning_strategies',        onetKey:'s_learning_strategies',        type:'skill', text:'ฉันสามารถวางแผนวิธีเรียนรู้ที่เหมาะสมกับแต่ละเนื้อหาได้' },
  { id:'S12', dbColumn:'s_management_of_financial_resources', onetKey:'s_management_of_financial_resources', type:'skill', text:'ฉันสามารถวางแผนและควบคุมงบประมาณของโปรเจกต์หรือทีมได้' },
  { id:'S13', dbColumn:'s_management_of_material_resources', onetKey:'s_management_of_material_resources', type:'skill', text:'ฉันสามารถบริหารจัดการวัสดุหรือทรัพยากรที่มีอยู่ให้เกิดประโยชน์สูงสุด' },
  { id:'S14', dbColumn:'s_management_of_personnel_resources', onetKey:'s_management_of_personnel_resources', type:'skill', text:'ฉันสามารถมอบหมายงานและดูแลสมาชิกในทีมได้อย่างมีประสิทธิภาพ' },
  { id:'S15', dbColumn:'s_mathematics',               onetKey:'s_mathematics',               type:'skill', text:'ฉันสามารถใช้คณิตศาสตร์หรือสถิติในการวิเคราะห์และแก้ปัญหาได้' },
  { id:'S16', dbColumn:'s_monitoring',                onetKey:'s_monitoring',                type:'skill', text:'ฉันสามารถติดตามและตรวจสอบความคืบหน้าของงานหรือระบบได้อย่างสม่ำเสมอ' },
  { id:'S17', dbColumn:'s_negotiation',               onetKey:'s_negotiation',               type:'skill', text:'ฉันสามารถเจรจาต่อรองเพื่อหาข้อตกลงที่ทุกฝ่ายยอมรับได้' },
  { id:'S18', dbColumn:'s_operation_and_control',     onetKey:'s_operation_and_control',     type:'skill', text:'ฉันสามารถควบคุมการทำงานของระบบหรือกระบวนการให้เป็นไปตามแผน' },
  { id:'S19', dbColumn:'s_operations_analysis',       onetKey:'s_operations_analysis',       type:'skill', text:'ฉันสามารถวิเคราะห์กระบวนการทำงานและหาจุดที่ควรปรับปรุงได้' },
  { id:'S20', dbColumn:'s_operations_monitoring',     onetKey:'s_operations_monitoring',     type:'skill', text:'ฉันสามารถสังเกตเห็นความผิดปกติในระบบหรือกระบวนการได้ก่อนที่จะเกิดปัญหา' },
  { id:'S21', dbColumn:'s_persuasion',                onetKey:'s_persuasion',                type:'skill', text:'ฉันสามารถโน้มน้าวหรือจูงใจผู้อื่นให้เห็นด้วยกับแนวคิดของฉันได้' },
  { id:'S22', dbColumn:'s_programming',               onetKey:'s_programming',               type:'skill', text:'ฉันสามารถเขียนโปรแกรมหรือสคริปต์เพื่อแก้ปัญหาหรืออัตโนมัติงานได้' },
  { id:'S23', dbColumn:'s_quality_control_analysis',  onetKey:'s_quality_control_analysis',  type:'skill', text:'ฉันสามารถตรวจสอบและประเมินคุณภาพของงานหรือผลลัพธ์ได้อย่างเป็นระบบ' },
  { id:'S24', dbColumn:'s_reading_comprehension',     onetKey:'s_reading_comprehension',     type:'skill', text:'ฉันสามารถอ่านและทำความเข้าใจเอกสารหรือข้อมูลที่ซับซ้อนได้' },
  { id:'S25', dbColumn:'s_repairing',                 onetKey:'s_repairing',                 type:'skill', text:'ฉันสามารถแก้ไขหรือซ่อมแซมระบบ อุปกรณ์ หรือโค้ดที่เสียหายได้' },
  { id:'S26', dbColumn:'s_science',                   onetKey:'s_science',                   type:'skill', text:'ฉันสามารถประยุกต์ใช้หลักการทางวิทยาศาสตร์ในการแก้ปัญหาได้' },
  { id:'S27', dbColumn:'s_service_orientation',       onetKey:'s_service_orientation',       type:'skill', text:'ฉันสามารถเข้าใจความต้องการของผู้ใช้และให้บริการได้ตรงจุด' },
  { id:'S28', dbColumn:'s_social_perceptiveness',     onetKey:'s_social_perceptiveness',     type:'skill', text:'ฉันสามารถสังเกตและเข้าใจความรู้สึกหรือปฏิกิริยาของคนรอบข้างได้' },
  { id:'S29', dbColumn:'s_speaking',                  onetKey:'s_speaking',                  type:'skill', text:'ฉันสามารถพูดนำเสนอหรืออธิบายไอเดียให้ผู้อื่นเข้าใจได้ชัดเจน' },
  { id:'S30', dbColumn:'s_systems_analysis',          onetKey:'s_systems_analysis',          type:'skill', text:'ฉันสามารถมองภาพรวมของระบบและเข้าใจว่าแต่ละส่วนเชื่อมโยงกันอย่างไร' },
  { id:'S31', dbColumn:'s_systems_evaluation',        onetKey:'s_systems_evaluation',        type:'skill', text:'ฉันสามารถประเมินว่าระบบที่ใช้งานอยู่ทำงานได้ตามวัตถุประสงค์หรือไม่' },
  { id:'S32', dbColumn:'s_technology_design',         onetKey:'s_technology_design',         type:'skill', text:'ฉันสามารถออกแบบระบบหรือเครื่องมือทางเทคโนโลยีให้ตรงกับความต้องการผู้ใช้ได้' },
  { id:'S33', dbColumn:'s_time_management',           onetKey:'s_time_management',           type:'skill', text:'ฉันสามารถจัดลำดับความสำคัญและบริหารเวลาให้งานเสร็จตามกำหนดได้' },
  { id:'S34', dbColumn:'s_troubleshooting',           onetKey:'s_troubleshooting',           type:'skill', text:'ฉันสามารถค้นหาและแก้ไขสาเหตุของปัญหาทางเทคนิคได้อย่างเป็นระบบ' },
  { id:'S35', dbColumn:'s_writing',                   onetKey:'s_writing',                   type:'skill', text:'ฉันสามารถเขียนเนื้อหาหรือเอกสารให้ผู้อื่นเข้าใจได้ชัดเจนและน่าอ่าน' },

  // ── 2. KNOWLEDGE (K01–K33) = 33 ข้อ ───────────────────────────────────────
  { id:'K01', dbColumn:'k_administration_and_management', onetKey:'k_administration_and_management', type:'knowledge', text:'ฉันมีความรู้ด้านการบริหารจัดการองค์กรและการวางแผนกลยุทธ์' },
  { id:'K02', dbColumn:'k_administrative',                onetKey:'k_administrative',                type:'knowledge', text:'ฉันมีความรู้ด้านงานธุรการ การจัดการเอกสาร และระบบสำนักงาน' },
  { id:'K03', dbColumn:'k_biology',                       onetKey:'k_biology',                       type:'knowledge', text:'ฉันมีความรู้ด้านชีววิทยาและสิ่งมีชีวิต' },
  { id:'K04', dbColumn:'k_building_and_construction',     onetKey:'k_building_and_construction',     type:'knowledge', text:'ฉันมีความรู้ด้านการก่อสร้างและงานช่าง' },
  { id:'K05', dbColumn:'k_chemistry',                     onetKey:'k_chemistry',                     type:'knowledge', text:'ฉันมีความรู้ด้านเคมีและสารประกอบ' },
  { id:'K06', dbColumn:'k_communications_and_media',      onetKey:'k_communications_and_media',      type:'knowledge', text:'ฉันมีความรู้ด้านการสื่อสาร สื่อมวลชน และการผลิตคอนเทนต์' },
  { id:'K07', dbColumn:'k_computers_and_electronics',     onetKey:'k_computers_and_electronics',     type:'knowledge', text:'ฉันมีความรู้ด้านคอมพิวเตอร์ ฮาร์ดแวร์ และอิเล็กทรอนิกส์' },
  { id:'K08', dbColumn:'k_customer_and_personal_service', onetKey:'k_customer_and_personal_service', type:'knowledge', text:'ฉันมีความรู้ด้านการบริการลูกค้าและการสร้างความพึงพอใจ' },
  { id:'K09', dbColumn:'k_design',                        onetKey:'k_design',                        type:'knowledge', text:'ฉันมีความรู้ด้านการออกแบบ หลักการ UX/UI และศิลปะ' },
  { id:'K10', dbColumn:'k_economics_and_accounting',      onetKey:'k_economics_and_accounting',      type:'knowledge', text:'ฉันมีความรู้ด้านเศรษฐศาสตร์ การบัญชี และการเงิน' },
  { id:'K11', dbColumn:'k_education_and_training',        onetKey:'k_education_and_training',        type:'knowledge', text:'ฉันมีความรู้ด้านการศึกษา การสอน และการออกแบบหลักสูตร' },
  { id:'K12', dbColumn:'k_engineering_and_technology',    onetKey:'k_engineering_and_technology',    type:'knowledge', text:'ฉันมีความรู้ด้านวิศวกรรมและเทคโนโลยี' },
  { id:'K13', dbColumn:'k_english_language',              onetKey:'k_english_language',              type:'knowledge', text:'ฉันมีความรู้ด้านภาษาอังกฤษและการสื่อสารเป็นภาษาอังกฤษ' },
  { id:'K14', dbColumn:'k_fine_arts',                     onetKey:'k_fine_arts',                     type:'knowledge', text:'ฉันมีความรู้ด้านศิลปกรรม ดนตรี และงานสร้างสรรค์' },
  { id:'K15', dbColumn:'k_food_production',               onetKey:'k_food_production',               type:'knowledge', text:'ฉันมีความรู้ด้านการผลิตอาหารและกระบวนการแปรรูป' },
  { id:'K16', dbColumn:'k_foreign_language',              onetKey:'k_foreign_language',              type:'knowledge', text:'ฉันมีความรู้ด้านภาษาต่างประเทศนอกจากภาษาอังกฤษ' },
  { id:'K17', dbColumn:'k_geography',                     onetKey:'k_geography',                     type:'knowledge', text:'ฉันมีความรู้ด้านภูมิศาสตร์และทรัพยากรธรรมชาติ' },
  { id:'K18', dbColumn:'k_history_and_archeology',        onetKey:'k_history_and_archeology',        type:'knowledge', text:'ฉันมีความรู้ด้านประวัติศาสตร์และโบราณคดี' },
  { id:'K19', dbColumn:'k_law_and_government',            onetKey:'k_law_and_government',            type:'knowledge', text:'ฉันมีความรู้ด้านกฎหมายและระบบการปกครอง' },
  { id:'K20', dbColumn:'k_mathematics',                   onetKey:'k_mathematics',                   type:'knowledge', text:'ฉันมีความรู้ด้านคณิตศาสตร์ขั้นสูง สถิติ และการวิเคราะห์เชิงตัวเลข' },
  { id:'K21', dbColumn:'k_mechanical',                    onetKey:'k_mechanical',                    type:'knowledge', text:'ฉันมีความรู้ด้านเครื่องกลและระบบกลไก' },
  { id:'K22', dbColumn:'k_medicine_and_dentistry',        onetKey:'k_medicine_and_dentistry',        type:'knowledge', text:'ฉันมีความรู้ด้านการแพทย์ ทันตกรรม และสุขภาพ' },
  { id:'K23', dbColumn:'k_personnel_and_human_resources', onetKey:'k_personnel_and_human_resources', type:'knowledge', text:'ฉันมีความรู้ด้านการบริหารบุคคลและทรัพยากรมนุษย์' },
  { id:'K24', dbColumn:'k_philosophy_and_theology',       onetKey:'k_philosophy_and_theology',       type:'knowledge', text:'ฉันมีความรู้ด้านปรัชญา จริยธรรม และศาสนา' },
  { id:'K25', dbColumn:'k_physics',                       onetKey:'k_physics',                       type:'knowledge', text:'ฉันมีความรู้ด้านฟิสิกส์และกฎธรรมชาติ' },
  { id:'K26', dbColumn:'k_production_and_processing',     onetKey:'k_production_and_processing',     type:'knowledge', text:'ฉันมีความรู้ด้านการผลิตและกระบวนการผลิตในอุตสาหกรรม' },
  { id:'K27', dbColumn:'k_psychology',                    onetKey:'k_psychology',                    type:'knowledge', text:'ฉันมีความรู้ด้านจิตวิทยาและพฤติกรรมมนุษย์' },
  { id:'K28', dbColumn:'k_public_safety_and_security',    onetKey:'k_public_safety_and_security',    type:'knowledge', text:'ฉันมีความรู้ด้านความปลอดภัยสาธารณะและการรักษาความปลอดภัย' },
  { id:'K29', dbColumn:'k_sales_and_marketing',           onetKey:'k_sales_and_marketing',           type:'knowledge', text:'ฉันมีความรู้ด้านการขายและการตลาดดิจิทัล' },
  { id:'K30', dbColumn:'k_sociology_and_anthropology',    onetKey:'k_sociology_and_anthropology',    type:'knowledge', text:'ฉันมีความรู้ด้านสังคมศาสตร์และมานุษยวิทยา' },
  { id:'K31', dbColumn:'k_telecommunications',            onetKey:'k_telecommunications',            type:'knowledge', text:'ฉันมีความรู้ด้านโทรคมนาคม เครือข่าย และโปรโตคอล' },
  { id:'K32', dbColumn:'k_therapy_and_counseling',        onetKey:'k_therapy_and_counseling',        type:'knowledge', text:'ฉันมีความรู้ด้านการให้คำปรึกษาและบำบัด' },
  { id:'K33', dbColumn:'k_transportation',                onetKey:'k_transportation',                type:'knowledge', text:'ฉันมีความรู้ด้านการขนส่งและโลจิสติกส์' },

  // ── 3. ATTITUDE (A01–A06) = 6 ข้อ ─────────────────────────────────────────
  { id:'A01', dbColumn:'a_artistic',      onetKey:'a_artistic',      type:'attitude', text:'ชอบสร้างเนื้อหาจากจินตนาการ คิดงานเชิงสร้างสรรค์' },
  { id:'A02', dbColumn:'a_conventional',  onetKey:'a_conventional',  type:'attitude', text:'ชอบทำงานที่มีขั้นตอนชัดเจน ละเอียด มีระเบียบ' },
  { id:'A03', dbColumn:'a_enterprising',  onetKey:'a_enterprising',  type:'attitude', text:'ชอบนำเสนอ โน้มน้าวผู้อื่น มีบทบาทนำในทีม' },
  { id:'A04', dbColumn:'a_investigative', onetKey:'a_investigative', type:'attitude', text:'ชอบค้นคว้าข้อมูล วิเคราะห์ปัญหา และทดลองหาคำตอบ' },
  { id:'A05', dbColumn:'a_realistic',     onetKey:'a_realistic',     type:'attitude', text:'ชอบทำงานที่เห็นผลชัดเจน ทำงานกับระบบโดยตรง' },
  { id:'A06', dbColumn:'a_social',        onetKey:'a_social',        type:'attitude', text:'ชอบทำงานกับผู้คน ช่วยเหลือผู้อื่น และทำงานเป็นทีม' },
]
// แปลงคำตอบ slider (0-100) → format สำหรับคำนวณ
// key คือ dbColumn เลย ไม่ต้องแปลงอีกรอบ
export function mapAnswersToScoring(
  rawAnswers: Record<string, number>
): Record<string, number> {
  const result: Record<string, number> = {}
  for (const q of QUESTIONS) {
    if (rawAnswers[q.id] != null) {
      // slider ส่งมา 0–100 ตรงๆ ไม่ต้องคูณอะไรเพิ่ม
      result[q.dbColumn] = rawAnswers[q.id]
    }
  }
  return result
}

// แปลงคำตอบ → format column สำหรับ insert Supabase
export function mapAnswersToDb(
  rawAnswers: Record<string, number>
): Record<string, number> {
  return mapAnswersToScoring(rawAnswers)
}

// Legacy export — ใช้ใน scoring.ts เดิม (ถ้าจำเป็น)
export function mapAnswersToOnet(
  rawAnswers: Record<string, number>
): { skill: Record<string, number>; knowledge: Record<string, number> } {
  const flat = mapAnswersToScoring(rawAnswers)
  const skill: Record<string, number> = {}
  const knowledge: Record<string, number> = {}
  for (const q of QUESTIONS) {
    if (flat[q.dbColumn] == null) continue
    if (q.type === 'knowledge') {
      knowledge[q.dbColumn] = flat[q.dbColumn]
    } else {
      skill[q.dbColumn] = flat[q.dbColumn]
    }
  }
  return { skill, knowledge }
}