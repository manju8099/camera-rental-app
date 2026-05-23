'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { supabase } from '../../lib/supabase'

export default function LoginPage() {
  const router = useRouter()

  const [mobile, setMobile] = useState('')
  const [password, setPassword] = useState('')
  const [loading, setLoading] = useState(false)

  const handleLogin = async () => {
    if (!mobile || !password) {
      alert('Enter mobile and password')
      return
    }

    setLoading(true)

    // Find user by mobile
    const { data: userData, error: userError } = await supabase
      .from('users')
      .select('*')
      .eq('mobile', mobile)
      .single()

    if (userError || !userData) {
      alert('Mobile number not found')
      setLoading(false)
      return
    }

    // Login using email internally
    const { data, error } = await supabase.auth.signInWithPassword({
      email: userData.email,
      password,
    })

    if (error) {
      alert(error.message)
      setLoading(false)
      return
    }

    // Redirect based on role
    if (userData.role === 'admin') {
      router.push('/admin')
    } else {
      router.push('/book')
    }

    setLoading(false)
  }

  return (
    <div
      style={{
        minHeight: '100vh',
        background: '#f3f4f6',
        display: 'flex',
        justifyContent: 'center',
        alignItems: 'center',
      }}
    >
      <div
        style={{
          width: 400,
          background: 'white',
          padding: 30,
          borderRadius: 15,
          boxShadow: '0 4px 20px rgba(0,0,0,0.1)',
        }}
      >
        <h1
          style={{
            textAlign: 'center',
            marginBottom: 30,
          }}
        >
          📷 Camera Rental Login
        </h1>

        <input
          placeholder="Mobile Number"
          value={mobile}
          onChange={(e) => setMobile(e.target.value)}
          style={inputStyle}
        />

        <input
          type="password"
          placeholder="Password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          style={inputStyle}
        />

        <button
          onClick={handleLogin}
          disabled={loading}
          style={{
            width: '100%',
            padding: 14,
            background: 'black',
            color: 'white',
            border: 'none',
            borderRadius: 10,
            cursor: 'pointer',
            fontSize: 16,
            fontWeight: 'bold',
          }}
        >
          {loading ? 'Logging in...' : 'Login'}
        </button>
      </div>
    </div>
  )
}

const inputStyle = {
  width: '100%',
  padding: 14,
  marginBottom: 15,
  borderRadius: 10,
  border: '1px solid #ccc',
}