import { NextResponse } from 'next/server'
import { QUESTIONS } from '@/lib/questionMap'

export async function GET() {
  const skill = QUESTIONS
    .filter(q => q.type === 'skill' || q.type === 'attitude')
    .map(q => ({ id: q.id, text: q.text, type: q.type }))

  const knowledge = QUESTIONS
    .filter(q => q.type === 'knowledge')
    .map(q => ({ id: q.id, text: q.text, type: q.type }))

  return NextResponse.json({
    skill,
    knowledge,
    total: skill.length + knowledge.length,
  })
}