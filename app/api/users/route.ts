import { NextResponse } from "next/server"
import { supabase } from "../../../lib/supabase"

export async function GET() {
  try {
    const { data, error } = await supabase
      .from("users")
      .select("*")
      .order("name")

    console.log("USERS:", data)
    console.log("ERROR:", error)

    if (error) {
      return NextResponse.json([])
    }

    return NextResponse.json(data || [])
  } catch (err) {
    console.log(err)

    return NextResponse.json([])
  }
}