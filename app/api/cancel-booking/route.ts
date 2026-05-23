import { NextResponse } from "next/server"
import { supabase } from "../../../lib/supabase"

export async function POST(req: Request) {

  try {

    const body = await req.json()

    const { id } = body

    const { error } = await supabase
      .from("bookings")
      .delete()
      .eq("id", id)

    if (error) {
      return NextResponse.json({
        success: false,
        error: error.message
      })
    }

    return NextResponse.json({
      success: true
    })

  } catch (err: any) {

    return NextResponse.json({
      success: false,
      error: err.message
    })
  }
}