import { NextResponse } from 'next/server'
import Stripe from 'stripe'
import { createClient } from '@supabase/supabase-js'

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY!, {
  apiVersion: '2023-10-16' as any,
})

const supabaseAdmin = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_ROLE_KEY!
)

export async function POST(req: Request) {
  const payload = await req.text()
  const sig     = req.headers.get('stripe-signature')

  let event: Stripe.Event
  try {
    event = stripe.webhooks.constructEvent(payload, sig!, process.env.STRIPE_WEBHOOK_SECRET!)
  } catch (err: any) {
    return NextResponse.json({ error: `Webhook Error: ${err.message}` }, { status: 400 })
  }

  if (event.type === 'checkout.session.completed') {
    const session = event.data.object as Stripe.Checkout.Session
    const meta    = session.metadata!

    const { email, password, username, gender, age, gpax, major, preferred_sector } = meta

    // 1️⃣ สร้าง Supabase user ด้วย admin client
    const { data: newUser, error: signUpError } = await supabaseAdmin.auth.admin.createUser({
      email,
      password,
      email_confirm: false, // รอ OTP ยืนยัน
    })

    if (signUpError || !newUser.user) {
      console.error('createUser error:', signUpError)
      return NextResponse.json({ error: 'Failed to create user' }, { status: 500 })
    }

    const userId = newUser.user.id

    // 2️⃣ ส่ง OTP ด้วย regular client (anon key)
    const supabaseClient = createClient(
      process.env.NEXT_PUBLIC_SUPABASE_URL!,
      process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
    )

    const { error: otpError } = await supabaseClient.auth.signInWithOtp({
      email,
      options: { shouldCreateUser: false },
    })

    if (otpError) {
      console.error('OTP send error:', otpError)
      // ไม่ return 500 — user สร้างแล้ว แค่ log ไว้ให้ทราบ
    }

    // 3️⃣ บันทึก profile
    const { error: profileError } = await supabaseAdmin
      .from('profiles')
      .insert({
        id:               userId,
        username,
        gender,
        age:              Number(age),
        gpax:             Number(gpax),
        major,
        preferred_sector,
        is_paid:          true,
        paid_at:          new Date().toISOString(),
      })

    if (profileError) {
      console.error('Profile insert error:', profileError)
      return NextResponse.json({ error: 'Failed to create profile' }, { status: 500 })
    }

    console.log(`[✅ Success] สร้าง user + profile สำเร็จ: ${email} (${userId})`)
  }

  return NextResponse.json({ received: true }, { status: 200 })
}