import { NextRequest, NextResponse } from 'next/server'
import { recommendCareers } from '@/lib/scoring'
import { mapAnswersToDb } from '@/lib/questionMap'
import { supabase } from '@/lib/supabase'

export async function POST(req: NextRequest) {
  try {
    const { sector, answers } = await req.json()

    if (!sector || !answers) {
      return NextResponse.json(
        { error: 'sector และ answers ต้องมีค่า' },
        { status: 400 }
      )
    }

    // ส่ง rawAnswers ตรงๆ เข้า recommendCareers
    const result = await recommendCareers({}, answers, sector)

    // แปลงสำหรับบันทึก DB
    const dbAnswers = mapAnswersToDb(answers)

    let savedId = null
    try {
      const { data, error } = await supabase
        .from('assessment_results')
        .insert([{
          sector,
          ...dbAnswers,
          top3: result.top10.slice(0, 3),
        }])
        .select('id')
        .single()
      if (!error) savedId = data?.id
    } catch (e) {
      console.warn('Supabase save failed:', e)
    }

    return NextResponse.json({
      success: true,
      resultId: savedId,
      totalEvaluated: result.totalEvaluated,
      recommendations: result.top10.slice(0, 3),
    })

  } catch (err) {
    console.error(err)
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    )
  }
}