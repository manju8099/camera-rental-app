import { NextResponse } from "next/server"
import { supabase } from "../../../lib/supabase"

export async function GET() {

  try {

    const { data, error } = await supabase
      .from("users")
      .select("*")

    if (error) {

      console.log(error)

      return NextResponse.json([])
    }

    return NextResponse.json(data || [])

  } catch (err) {

    console.log(err)

    return NextResponse.json([])
  }
}