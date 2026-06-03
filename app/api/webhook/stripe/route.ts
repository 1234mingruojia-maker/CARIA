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
    const session  = event.data.object as Stripe.Checkout.Session
    const meta     = session.metadata!

    const { email, password, username, gender, age, gpax, major, preferred_sector } = meta

    // 1️⃣ สร้าง Supabase user ด้วย admin client (bypass email confirm ชั่วคราว)
    //    Supabase จะส่ง OTP email ให้อัตโนมัติตาม auth config
    const { data: newUser, error: signUpError } = await supabaseAdmin.auth.admin.createUser({
      email,
      password,
      email_confirm: false,   // ยังไม่ confirm — รอ OTP จากผู้ใช้
    })

    if (signUpError || !newUser.user) {
      console.error('createUser error:', signUpError)
      return NextResponse.json({ error: 'Failed to create user' }, { status: 500 })
    }

    const userId = newUser.user.id

    // 2️⃣ ส่ง OTP email ให้ผู้ใช้ยืนยัน
    const { error: otpError } = await supabaseAdmin.auth.signInWithOtp({
  email,
  options: {
    shouldCreateUser: false, // user สร้างไปแล้วข้างบน ไม่ต้องสร้างซ้ำ
  },
})


    // 3️⃣ บันทึก profile (is_paid = true ทันที เพราะจ่ายเงินแล้ว)
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