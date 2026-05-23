import { NextResponse } from "next/server"
import { createClient } from "@supabase/supabase-js"

const supabaseAdmin = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_ROLE_KEY!
)

export async function POST(req: Request) {
  try {
    const body = await req.json()

    const { userId, password } = body

    if (!userId || !password) {
      return NextResponse.json({
        success: false,
        error: "Missing userId or password"
      })
    }

    const { data, error } =
      await supabaseAdmin.auth.admin.updateUserById(
        userId,
        {
          password
        }
      )

    if (error) {
      console.log(error)

      return NextResponse.json({
        success: false,
        error: error.message
      })
    }

    return NextResponse.json({
      success: true,
      data
    })

  } catch (err: any) {
    console.log(err)

    return NextResponse.json({
      success: false,
      error: err.message
    })
  }
}