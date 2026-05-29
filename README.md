# CARIA

**ระบบแนะนำอาชีพส่วนบุคคลด้วยการวัดความคล้ายคลึงของสมรรถนะ**  
**A Personalized Career Recommender Based on Individual Competency Similarity Measure**

![Next.js](https://img.shields.io/badge/Next.js-15.0-black?logo=next.js)
![TypeScript](https://img.shields.io/badge/TypeScript-007ACC?logo=typescript&logoColor=white)
![Tailwind CSS](https://img.shields.io/badge/Tailwind_CSS-38B2AC?logo=tailwind-css&logoColor=white)

## 📋 เกี่ยวกับโปรเจกต์

CARIA เป็นระบบแนะนำอาชีพที่พัฒนาขึ้นเพื่อช่วยนักเรียน นักศึกษา ในการเลือกเส้นทางอาชีพที่เหมาะสมกับ**สมรรถนะ (Competency)** ของตนเอง โดยเฉพาะอาชีพด้าน **Digital Technology** และ **Digital Media**

ระบบใช้เทคนิค **Modified Euclidean Similarity (MES)** ในการคำนวณความคล้ายคลึงระหว่างสมรรถนะของผู้ใช้กับสมรรถนะที่ต้องการในแต่ละอาชีพ และยังสามารถวิเคราะห์**ช่องว่างของสมรรถนะ (Competency Gap Analysis)** ได้ด้วย

---

## 🛠 เทคโนโลยีที่ใช้

| เทคโนโลยี              | วัตถุประสงค์                  |
|------------------------|-------------------------------|
| Next.js 15 (App Router)| Framework หลัก                |
| TypeScript             | ภาษาหลัก                     |
| Tailwind CSS           | การออกแบบ UI                  |
| Supabase (Planned)     | Database & Authentication     |
| MES Algorithm          | การคำนวณความคล้ายคลึง        |

---

## 🚀 วิธีติดตั้งและรันโปรเจกต์

### Prerequisites
- Node.js 20+
- Git

### ขั้นตอนการติดตั้ง

```bash
# 1. Clone โปรเจกต์
git clone https://github.com/1234mingruojia-maker/CARIA.git

# 2. เข้าโฟลเดอร์
cd CARIA

# 3. ติดตั้ง dependencies
npm install
รันโปรเจกต์
Bashnpm run dev
เปิดเบราว์เซอร์ที่ http://localhost:3000
Build Production
Bashnpm run build
npm start


📌 คุณสมบัติหลัก
แบบสอบถามประเมินสมรรถนะ (Skill, Knowledge, Attitude)
แนะนำ 10 อันดับอาชีพที่เหมาะสมที่สุด
วิเคราะห์ Competency Gap Analysis
ใช้ Modified Euclidean Similarity (MES)
รองรับอาชีพ Digital Technology และ Digital Media


อ้างอิง:
Seesukong, S., Angskun, T., et al. (2024). CARIA: A Personalized Career Recommender Based on Individual Competency Similarity Measure. International Journal of Information and Communication Technology Education.