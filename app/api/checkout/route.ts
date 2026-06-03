import { NextResponse } from 'next/server'
import Stripe from 'stripe'

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY!, {
  apiVersion: '2023-10-16' as any,
})

export async function POST(req: Request) {
  try {
    const body = await req.json()
    const { email, password, username, gender, age, gpax, major, preferred_sector } = body

    const session = await stripe.checkout.sessions.create({
      payment_method_types: ['card', 'promptpay'],
      line_items: [
        {
          price_data: {
            currency: 'thb',
            product_data: {
              name: 'ค่าธรรมเนียมสมัครสมาชิก CARIA',
              description: `เปิดระบบถาวรสำหรับบัญชี: ${username} (${email})`,
            },
            unit_amount: 29900,
          },
          quantity: 1,
        },
      ],
      mode: 'payment',
      // ✅ หลังจ่ายเงินแล้ว redirect กลับมา register พร้อม step=otp และ email
      success_url: `${process.env.NEXT_PUBLIC_SITE_URL}/register?step=otp&email=${encodeURIComponent(email)}`,
      cancel_url:  `${process.env.NEXT_PUBLIC_SITE_URL}/register?status=cancelled`,
      metadata: {
        email,
        password,   // webhook จะเอาไป signUp
        username,
        gender,
        age:              String(age),
        gpax:             String(gpax),
        major,
        preferred_sector,
      },
    })

    return NextResponse.json({ url: session.url })
  } catch (error: any) {
    console.error('Stripe Checkout Error:', error)
    return NextResponse.json({ error: error.message }, { status: 500 })
  }
}