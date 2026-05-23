import { NextResponse } from "next/server"
import { supabase } from "@/lib/supabase"

export async function GET(req: Request) {

  try {

    const { searchParams } =
      new URL(req.url)

    const all =
      searchParams.get("all")

    const cameraId =
      searchParams.get("cameraId")

    const date =
      searchParams.get("date")

    const customerName =
      searchParams.get("customer")

    // BASE QUERY

    let query = supabase
      .from("bookings")
      .select("*")
      .order("booking_date", {
        ascending: false
      })

    // ADMIN BOOKINGS

    if (all === "true") {

      const { data, error } =
        await query

      if (error) {

        console.log(error)

        return NextResponse.json([])
      }

      return NextResponse.json(data || [])
    }

    // CUSTOMER FILTER

    if (customerName) {

      query =
        query.eq(
          "customer_name",
          customerName
        )
    }

    // CAMERA FILTER

    if (cameraId) {

      query =
        query.eq(
          "camera_id",
          cameraId
        )
    }

    // DATE FILTER

    if (date) {

      query =
        query.eq(
          "booking_date",
          date
        )
    }

    const { data, error } =
      await query

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