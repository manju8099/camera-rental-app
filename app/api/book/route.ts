import { NextResponse } from "next/server"
import { createClient } from "@supabase/supabase-js"

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
)

export async function GET() {

  try {

    const { data, error } =
      await supabase
        .from("cameras")
        .select("*")
        .order("name")

    if (error) {

      console.log(error)

      return NextResponse.json([])
    }

    return NextResponse.json(data || [])

  } catch (err: any) {

    console.log(err)

    return NextResponse.json([])
  }
}