import { NextResponse } from "next/server"
import { createClient } from "@supabase/supabase-js"

const supabaseAdmin = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_ROLE_KEY!
)

export async function POST(req: Request) {
  try {
    const body = await req.json()

    const {
      name,
      mobile,
      email,
      password,
      role,
    } = body

    // CREATE AUTH USER

    const { data, error } =
      await supabaseAdmin.auth.admin.createUser({
        email,
        password,
        email_confirm: true,
      })

    if (error) {
      return NextResponse.json({
        success: false,
        error: error.message,
      })
    }

    // INSERT INTO USERS TABLE

    const { error: insertError } =
      await supabaseAdmin
        .from("users")
        .insert([
          {
            id: data.user.id,
            name,
            mobile,
            email,
            role,
          },
        ])

    if (insertError) {
      return NextResponse.json({
        success: false,
        error: insertError.message,
      })
    }

    return NextResponse.json({
      success: true,
    })
  } catch (err: any) {
    return NextResponse.json({
      success: false,
      error: err.message,
    })
  }
}