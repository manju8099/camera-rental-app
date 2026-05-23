import { NextResponse } from "next/server"
import { supabase } from "../../../lib/supabase"

export async function POST(req: Request) {
  try {
    const body = await req.json()

    const {
      id,
      name,
      mobile,
      email,
      role,
    } = body

    const { data, error } = await supabase
      .from("users")
      .update({
        name,
        mobile,
        email,
        role,
      })
      .eq("id", id)

    if (error) {
      return NextResponse.json({
        success: false,
        error: error.message,
      })
    }

    return NextResponse.json({
      success: true,
      data,
    })
  } catch (err: any) {
    return NextResponse.json({
      success: false,
      error: err.message,
    })
  }
}