import { NextResponse } from 'next/server'
import { supabase } from '../../../lib/supabase'

export async function POST(req: Request) {
  try {
    const body = await req.json()

    console.log('BOOKING BODY:', body)

    const {
      customer_name,
      camera_id,
      booking_date,
      start_hour,
      end_hour,
    } = body

    const { data, error } = await supabase
      .from('bookings')
      .insert([
        {
          customer_name,
          camera_id,
          booking_date,
          start_hour,
          end_hour,
        },
      ])
      .select()

    console.log('INSERT DATA:', data)
    console.log('INSERT ERROR:', error)

    if (error) {
      return NextResponse.json({
        error: error.message,
      })
    }

    return NextResponse.json({
      success: true,
      data,
    })
  } catch (err) {
    console.log(err)

    return NextResponse.json({
      error: 'Server error',
    })
  }
}