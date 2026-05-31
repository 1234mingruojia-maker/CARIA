import { createClient } from '@supabase/supabase-js';

export const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
);

export async function saveResult(
  profile: Record<string, unknown>,
  answers: Record<string, unknown>,
  top10: unknown[]
) {
  const { data, error } = await supabase
    .from('assessment_results')
    .insert([{
      gender: profile.gender ?? null,
      gpax: profile.gpax ?? null,
      field_of_study: profile.fieldOfStudy ?? null,
      answers_skill: answers.skill ?? {},
      answers_knowledge: answers.knowledge ?? {},
      top10,
    }])
    .select()
    .single();

  if (error) throw error;
  return data;
}

export async function getResultById(id: string) {
  const { data, error } = await supabase
    .from('assessment_results')
    .select('*')
    .eq('id', id)
    .single();

  if (error) throw error;
  return data;
}