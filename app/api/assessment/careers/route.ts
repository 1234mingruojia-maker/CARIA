import { NextRequest, NextResponse } from 'next/server'
import { getCareerList, getCareerDetail } from '@/lib/scoring'

export async function GET(req: NextRequest) {
  const { searchParams } = new URL(req.url)
  const sector = searchParams.get('sector') ?? undefined
  const id = searchParams.get('id')

  if (id) {
    const career = await getCareerDetail(id)
    if (!career) return NextResponse.json({ error: 'ไม่พบอาชีพ' }, { status: 404 })
    return NextResponse.json(career)
  }

  return NextResponse.json(await getCareerList(sector))
}