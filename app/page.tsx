'use client'

import { useEffect } from 'react'
import { supabase } from '../lib/supabase'
import { useRouter } from 'next/navigation'

export default function Home() {
  const router = useRouter()

  useEffect(() => {
    const checkUser = async () => {
      const { data } = await supabase.auth.getUser()

      if (!data.user) {
        router.push('/login')
      }
    }

    checkUser()
  }, [])

  return (
    <div style={{ padding: 20 }}>
      <h2>📷 Camera Rentals</h2>

      <div>
        <p>Nikon D5600</p>
        <a href="/book/1">Book Now</a>
      </div>

      <div>
        <p>Canon 200D</p>
        <a href="/book/2">Book Now</a>
      </div>
    </div>
  )
}