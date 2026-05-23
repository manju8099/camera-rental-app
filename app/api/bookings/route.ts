import { NextResponse } from 'next/server'
import { supabase } from '../../../lib/supabase'

export async function GET(req: Request) {
  const { searchParams } = new URL(req.url)

  const all = searchParams.get('all')
  const cameraId = searchParams.get('cameraId')
  const date = searchParams.get('date')

  // ADMIN BOOKINGS
  if (all === 'true') {
    const { data, error } = await supabase
      .from('bookings')
      .select('*')
      .order('booking_date', { ascending: false })

    console.log('ALL BOOKINGS:', data)
    console.log('ERROR:', error)

    return NextResponse.json(data || [])
  }

  // NORMAL CAMERA BOOKINGS
  const { data, error } = await supabase
    .from('bookings')
    .select('*')
    .eq('camera_id', cameraId)
    .eq('booking_date', date)

  console.log('CAMERA ID:', cameraId)
  console.log('DATE:', date)
  console.log('BOOKINGS:', data)
  console.log('ERROR:', error)

  return NextResponse.json(data || [])
}