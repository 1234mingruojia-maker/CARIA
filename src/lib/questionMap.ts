export type Question = {
  id: string
  dbColumn: string
  onetKey: string
  text: string
  type: 'skill' | 'attitude' | 'knowledge'
}

export const QUESTIONS: Question[] = [
  // ── SKILL ──────────────────────────────────────────────────
  { id:'S01', dbColumn:'s01_active_learning',       onetKey:'Active Learning',                    type:'skill',     text:'ฉันสามารถเรียนรู้เรื่องใหม่ได้ด้วยตัวเองโดยไม่ต้องมีคนสอน' },
  { id:'S02', dbColumn:'s02_active_listening',      onetKey:'Active Listening',                   type:'skill',     text:'ฉันสามารถทำงานร่วมกับผู้อื่นในทีมได้อย่างราบรื่น และให้คำแนะนำผู้อื่นได้เหมาะสม' },
  { id:'S03', dbColumn:'s03_critical_thinking',     onetKey:'Critical Thinking',                  type:'skill',     text:'ฉันสามารถวิเคราะห์ปัญหาและหาสาเหตุที่แท้จริงได้ก่อนตัดสินใจแก้ไข' },
  { id:'S04', dbColumn:'s04_coordination',          onetKey:'Coordination',                       type:'skill',     text:'ฉันสามารถประสานงานกับหลายฝ่ายพร้อมกันได้โดยไม่เกิดความสับสน' },
  { id:'S05', dbColumn:'s05_equipment_maintenance', onetKey:'Equipment Maintenance',              type:'skill',     text:'ฉันสามารถดูแลและบำรุงรักษาอุปกรณ์หรือเครื่องมือที่ใช้งานได้' },
  { id:'S06', dbColumn:'s06_equipment_selection',   onetKey:'Equipment Selection',                type:'skill',     text:'ฉันสามารถเลือกอุปกรณ์หรือเครื่องมือที่เหมาะสมกับงานแต่ละประเภทได้' },
  { id:'S07', dbColumn:'s07_installation',          onetKey:'Installation',                       type:'skill',     text:'ฉันสามารถติดตั้งซอฟต์แวร์ ระบบ หรืออุปกรณ์ได้ด้วยตัวเอง' },
  { id:'S08', dbColumn:'s08_instructing',           onetKey:'Instructing',                        type:'skill',     text:'ฉันสามารถอธิบายหรือสอนสิ่งที่ฉันรู้ให้คนอื่นเข้าใจได้' },
  { id:'S09', dbColumn:'s09_judgment_decision',     onetKey:'Judgment and Decision Making',       type:'skill',     text:'ฉันสามารถตัดสินใจในสถานการณ์ที่มีข้อมูลไม่ครบหรือมีความกดดันได้' },
  { id:'S10', dbColumn:'s10_mgmt_material',         onetKey:'Management of Material Resources',  type:'skill',     text:'ฉันสามารถบริหารจัดการวัสดุหรือทรัพยากรที่มีอยู่ให้เกิดประโยชน์สูงสุด' },
  { id:'S11', dbColumn:'s11_mgmt_personnel',        onetKey:'Management of Personnel Resources', type:'skill',     text:'ฉันสามารถมอบหมายงานและดูแลสมาชิกในทีมได้อย่างมีประสิทธิภาพ' },
  { id:'S12', dbColumn:'s12_monitoring',            onetKey:'Monitoring',                         type:'skill',     text:'ฉันสามารถติดตามและตรวจสอบความคืบหน้าของงานหรือระบบได้อย่างสม่ำเสมอ' },
  { id:'S13', dbColumn:'s13_negotiation',           onetKey:'Negotiation',                        type:'skill',     text:'ฉันสามารถเจรจาต่อรองเพื่อหาข้อตกลงที่ทุกฝ่ายยอมรับได้' },
  { id:'S14', dbColumn:'s14_operations_control',    onetKey:'Operation and Control',              type:'skill',     text:'ฉันสามารถควบคุมการทำงานของระบบหรือกระบวนการให้เป็นไปตามแผน' },
  { id:'S15', dbColumn:'s15_operations_monitoring', onetKey:'Operations Monitoring',              type:'skill',     text:'ฉันสามารถสังเกตเห็นความผิดปกติในระบบหรือกระบวนการได้ก่อนที่จะเกิดปัญหา' },
  { id:'S16', dbColumn:'s16_operations_analysis',   onetKey:'Operations Analysis',                type:'skill',     text:'ฉันสามารถวิเคราะห์กระบวนการทำงานและหาจุดที่ควรปรับปรุงได้' },
  { id:'S17', dbColumn:'s17_quality_control',       onetKey:'Quality Control Analysis',           type:'skill',     text:'ฉันสามารถตรวจสอบและประเมินคุณภาพของงานหรือผลลัพธ์ได้อย่างเป็นระบบ' },
  { id:'S18', dbColumn:'s18_reading_comprehension', onetKey:'Reading Comprehension',              type:'skill',     text:'ฉันสามารถอ่านและทำความเข้าใจเอกสารหรือข้อมูลที่ซับซ้อนได้' },
  { id:'S19', dbColumn:'s19_repairing',             onetKey:'Repairing',                          type:'skill',     text:'ฉันสามารถแก้ไขหรือซ่อมแซมระบบ อุปกรณ์ หรือโค้ดที่เสียหายได้' },
  { id:'S20', dbColumn:'s20_science',               onetKey:'Science',                            type:'skill',     text:'ฉันสามารถประยุกต์ใช้หลักการทางวิทยาศาสตร์หรือคณิตศาสตร์ในการแก้ปัญหาได้' },
  { id:'S21', dbColumn:'s21_social_perceptiveness', onetKey:'Social Perceptiveness',              type:'skill',     text:'ฉันสามารถสังเกตและเข้าใจความรู้สึกหรือปฏิกิริยาของคนรอบข้างได้' },
  { id:'S22', dbColumn:'s22_systems_analysis',      onetKey:'Systems Analysis',                   type:'skill',     text:'ฉันสามารถมองภาพรวมของระบบและเข้าใจว่าแต่ละส่วนเชื่อมโยงกันอย่างไร' },
  { id:'S23', dbColumn:'s23_systems_evaluation',    onetKey:'Systems Evaluation',                 type:'skill',     text:'ฉันสามารถประเมินว่าระบบที่ใช้งานอยู่ทำงานได้ตามวัตถุประสงค์หรือไม่' },
  { id:'S24', dbColumn:'s24_technology_design',     onetKey:'Technology Design',                  type:'skill',     text:'ฉันสามารถออกแบบระบบหรือเครื่องมือทางเทคโนโลยีให้ตรงกับความต้องการผู้ใช้ได้' },
  { id:'S25', dbColumn:'s25_troubleshooting',       onetKey:'Troubleshooting',                    type:'skill',     text:'ฉันสามารถค้นหาและแก้ไขสาเหตุของปัญหาทางเทคนิคได้อย่างเป็นระบบ' },
  { id:'S26', dbColumn:'s26_writing',               onetKey:'Writing',                            type:'skill',     text:'ฉันสามารถเขียนเรื่องราวหรือเนื้อหาจากจินตนาการ และเล่าประสบการณ์จริงให้น่าอ่านได้' },

  // ── ATTITUDE ───────────────────────────────────────────────
  { id:'A01', dbColumn:'a01_artistic',      onetKey:'Artistic',      type:'attitude', text:'ฉันชอบสร้างเนื้อหาจากจินตนาการ เล่าประสบการณ์ และคิดงานเชิงสร้างสรรค์ด้วย Design Thinking' },
  { id:'A02', dbColumn:'a02_conventional',  onetKey:'Conventional',  type:'attitude', text:'ฉันชอบทำงานที่มีขั้นตอนชัดเจน ละเอียด มีระเบียบวินัย และใช้ตรรกะ' },
  { id:'A03', dbColumn:'a03_enterprising',  onetKey:'Enterprising',  type:'attitude', text:'ฉันชอบนำเสนอ โน้มน้าวผู้อื่น ริเริ่มสิ่งใหม่ และมีบทบาทในการตัดสินใจหรือนำทีม' },
  { id:'A04', dbColumn:'a04_investigative', onetKey:'Investigative', type:'attitude', text:'ฉันชอบค้นคว้าข้อมูล วิเคราะห์ปัญหา และทดลองหาคำตอบ' },
  { id:'A05', dbColumn:'a05_realistic',     onetKey:'Realistic',     type:'attitude', text:'ฉันชอบทำงานที่เห็นผลลัพธ์ชัดเจน ซ่อมแซมสิ่งต่างๆ และทำงานกับเทคโนโลยีโดยตรง' },
  { id:'A06', dbColumn:'a06_social',        onetKey:'Social',        type:'attitude', text:'ฉันชอบทำงานกับผู้คน ทำงานเป็นทีม ถ่ายทอดความรู้ และติดตามเหตุการณ์รอบตัว' },

  // ── KNOWLEDGE ──────────────────────────────────────────────
  { id:'K01', dbColumn:'k01_administration',  onetKey:'Administration and Management', type:'knowledge', text:'ฉันมีความรู้ด้านการบริหารจัดการองค์กร' },
  { id:'K02', dbColumn:'k02_biology',         onetKey:'Biology',                       type:'knowledge', text:'ฉันมีความรู้ด้านชีววิทยา' },
  { id:'K03', dbColumn:'k03_construction',    onetKey:'Building and Construction',     type:'knowledge', text:'ฉันมีความรู้ด้านการก่อสร้างและงานช่าง' },
  { id:'K04', dbColumn:'k04_chemistry',       onetKey:'Chemistry',                     type:'knowledge', text:'ฉันมีความรู้ด้านเคมี' },
  { id:'K05', dbColumn:'k05_communications',  onetKey:'Communications and Media',      type:'knowledge', text:'ฉันมีความรู้ด้านการสื่อสารและสื่อมวลชน' },
  { id:'K06', dbColumn:'k06_computers',       onetKey:'Computers and Electronics',     type:'knowledge', text:'ฉันมีความรู้ด้านคอมพิวเตอร์และอิเล็กทรอนิกส์' },
  { id:'K07', dbColumn:'k07_counseling',      onetKey:'Counseling and Mental Health',  type:'knowledge', text:'ฉันมีความรู้ด้านการให้คำปรึกษาและแนะแนว' },
  { id:'K08', dbColumn:'k08_design',          onetKey:'Design',                        type:'knowledge', text:'ฉันมีความรู้ด้านการออกแบบและศิลปะ' },
  { id:'K09', dbColumn:'k09_economics',       onetKey:'Economics and Accounting',      type:'knowledge', text:'ฉันมีความรู้ด้านเศรษฐศาสตร์และการบัญชี' },
  { id:'K10', dbColumn:'k10_education',       onetKey:'Education and Training',        type:'knowledge', text:'ฉันมีความรู้ด้านการศึกษาและการสอน' },
  { id:'K11', dbColumn:'k11_engineering',     onetKey:'Engineering and Technology',    type:'knowledge', text:'ฉันมีความรู้ด้านวิศวกรรมและเทคโนโลยี' },
  { id:'K12', dbColumn:'k12_healthcare',      onetKey:'Medicine and Dentistry',        type:'knowledge', text:'ฉันมีความรู้ด้านการดูแลสุขภาพและการแพทย์' },
  { id:'K13', dbColumn:'k13_foreign_language',onetKey:'Foreign Language',              type:'knowledge', text:'ฉันมีความรู้ด้านภาษาต่างประเทศ' },
  { id:'K14', dbColumn:'k14_geography',       onetKey:'Geography',                     type:'knowledge', text:'ฉันมีความรู้ด้านธรณีวิทยาและทรัพยากรธรรมชาติ' },
  { id:'K15', dbColumn:'k15_history',         onetKey:'History and Archeology',        type:'knowledge', text:'ฉันมีความรู้ด้านประวัติศาสตร์และโบราณคดี' },
  { id:'K16', dbColumn:'k16_law',             onetKey:'Law and Government',            type:'knowledge', text:'ฉันมีความรู้ด้านกฎหมาย' },
  { id:'K17', dbColumn:'k17_logistics',       onetKey:'Transportation',                type:'knowledge', text:'ฉันมีความรู้ด้านการจัดการโลจิสติกส์และขนส่ง' },
  { id:'K18', dbColumn:'k18_mathematics',     onetKey:'Mathematics',                   type:'knowledge', text:'ฉันมีความรู้ด้านคณิตศาสตร์' },
  { id:'K19', dbColumn:'k19_medicine',        onetKey:'Therapy and Counseling',        type:'knowledge', text:'ฉันมีความรู้ด้านทันตกรรมและการแพทย์' },
  { id:'K20', dbColumn:'k20_hr',              onetKey:'Personnel and Human Resources', type:'knowledge', text:'ฉันมีความรู้ด้านการบริหารบุคคลและทรัพยากรมนุษย์' },
  { id:'K21', dbColumn:'k21_physics',         onetKey:'Physics',                       type:'knowledge', text:'ฉันมีความรู้ด้านฟิสิกส์' },
  { id:'K22', dbColumn:'k22_production',      onetKey:'Production and Processing',     type:'knowledge', text:'ฉันมีความรู้ด้านการผลิตและกระบวนการผลิต' },
  { id:'K23', dbColumn:'k23_psychology',      onetKey:'Psychology',                    type:'knowledge', text:'ฉันมีความรู้ด้านจิตวิทยา' },
  { id:'K24', dbColumn:'k24_public_safety',   onetKey:'Public Safety and Security',    type:'knowledge', text:'ฉันมีความรู้ด้านความปลอดภัยสาธารณะ' },
  { id:'K25', dbColumn:'k25_sales_marketing', onetKey:'Sales and Marketing',           type:'knowledge', text:'ฉันมีความรู้ด้านการขายและการตลาด' },
  { id:'K26', dbColumn:'k26_sociology',       onetKey:'Sociology and Anthropology',    type:'knowledge', text:'ฉันมีความรู้ด้านสังคมศาสตร์และมานุษยวิทยา' },
  { id:'K27', dbColumn:'k27_telecommunications', onetKey:'Telecommunications',         type:'knowledge', text:'ฉันมีความรู้ด้านโทรคมนาคมและเครือข่าย' },
  { id:'K28', dbColumn:'k28_transportation',  onetKey:'Mechanical',                    type:'knowledge', text:'ฉันมีความรู้ด้านการขนส่งและยานพาหนะ' },
  { id:'K29', dbColumn:'k29_thai_language',   onetKey:'English Language',              type:'knowledge', text:'ฉันมีความรู้ด้านภาษาไทยและการใช้ภาษาเพื่อการสื่อสาร' },
]

// แปลงคำตอบ { "S01": 4, "K06": 3 } → { skill: { onetKey: score }, knowledge: { onetKey: score } }
export function mapAnswersToOnet(
  rawAnswers: Record<string, number>
): { skill: Record<string, number>; knowledge: Record<string, number> } {
  const skill: Record<string, number> = {}
  const knowledge: Record<string, number> = {}

  for (const q of QUESTIONS) {
    const likert = rawAnswers[q.id]
    if (likert == null) continue
    const score = likert * 20  // 1→20, 2→40, 3→60, 4→80, 5→100

    if (q.type === 'skill' || q.type === 'attitude') {
      skill[q.onetKey] = score
    } else {
      knowledge[q.onetKey] = score
    }
  }

  return { skill, knowledge }
}

// แปลงคำตอบ → format column สำหรับ insert Supabase
export function mapAnswersToDb(
  rawAnswers: Record<string, number>
): Record<string, number> {
  const result: Record<string, number> = {}
  for (const q of QUESTIONS) {
    if (rawAnswers[q.id] != null) {
      result[q.dbColumn] = rawAnswers[q.id]
    }
  }
  return result
}