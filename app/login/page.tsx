"use client"

import { useState } from "react"
import { useRouter } from "next/navigation"

export default function LoginPage() {

  const router = useRouter()

  const [mobile, setMobile] = useState("")
  const [password, setPassword] = useState("")
  const [loading, setLoading] = useState(false)
  const [showPassword, setShowPassword] = useState(false)

  const handleLogin = async () => {

    if (!mobile || !password) {
      alert("Please enter mobile and password")
      return
    }

    setLoading(true)

    try {

      // GET USERS

      const res = await fetch("/api/users")

      const users = await res.json()

      console.log("USERS:", users)

      // FIND USER

      const user = users.find(
        (u: any) =>
          String(u.mobile) === String(mobile) &&
          String(u.password) === String(password)
      )

      console.log("FOUND USER:", user)

      // INVALID

      if (!user) {

        alert("Invalid Credentials")

        setLoading(false)

        return
      }

      // SAVE LOGIN

      localStorage.setItem(
        "user",
        JSON.stringify(user)
      )

      // ADMIN

      if (user.role === "admin") {

        router.push("/admin")

      } else {

        // CUSTOMER

        router.push("/book")
      }

    } catch (err) {

      console.log(err)

      alert("Login Failed")
    }

    setLoading(false)
  }

  return (

    <div style={pageStyle}>

      <div style={cardStyle}>

        <h1 style={titleStyle}>
          📸 Manju Cam Rentals
        </h1>

        <p style={subTitleStyle}>
          Login to continue
        </p>

        {/* MOBILE */}

        <input
          type="text"
          placeholder="Mobile Number"
          value={mobile}
          onChange={(e) =>
            setMobile(e.target.value)
          }
          style={inputStyle}
        />

        {/* PASSWORD */}

        <div style={{ position: "relative" }}>

          <input
            type={
              showPassword
                ? "text"
                : "password"
            }
            placeholder="Password"
            value={password}
            onChange={(e) =>
              setPassword(e.target.value)
            }
            style={{
              ...inputStyle,
              marginBottom: "0px"
            }}
          />

          <button
            onClick={() =>
              setShowPassword(!showPassword)
            }
            style={eyeButtonStyle}
          >
            {showPassword ? "🙈" : "👁"}
          </button>

        </div>

        {/* LOGIN */}

        <button
          onClick={handleLogin}
          disabled={loading}
          style={buttonStyle}
        >
          {
            loading
              ? "Please wait..."
              : "Login"
          }
        </button>

      </div>

    </div>
  )
}

const pageStyle: React.CSSProperties = {

  minHeight: "100vh",

  display: "flex",

  justifyContent: "center",

  alignItems: "center",

  background:
    "linear-gradient(135deg, #0f172a, #1e293b)",

  padding: "20px"
}

const cardStyle: React.CSSProperties = {

  width: "100%",

  maxWidth: "400px",

  background: "white",

  padding: "35px",

  borderRadius: "18px",

  boxShadow:
    "0 10px 30px rgba(0,0,0,0.25)"
}

const titleStyle: React.CSSProperties = {

  fontSize: "32px",

  fontWeight: "bold",

  textAlign: "center",

  marginBottom: "10px",

  color: "#0f172a"
}

const subTitleStyle: React.CSSProperties = {

  textAlign: "center",

  color: "#64748b",

  marginBottom: "30px",

  fontSize: "15px"
}

const inputStyle: React.CSSProperties = {

  width: "100%",

  padding: "14px",

  marginBottom: "18px",

  borderRadius: "10px",

  border: "1px solid #cbd5e1",

  fontSize: "15px",

  outline: "none",

  background: "#f8fafc",

  color: "#111827",

  boxSizing: "border-box"
}

const eyeButtonStyle: React.CSSProperties = {

  position: "absolute",

  right: "12px",

  top: "10px",

  border: "none",

  background: "transparent",

  cursor: "pointer",

  fontSize: "18px"
}

const buttonStyle: React.CSSProperties = {

  width: "100%",

  padding: "14px",

  borderRadius: "10px",

  border: "none",

  background: "#2563eb",

  color: "white",

  fontSize: "16px",

  fontWeight: "bold",

  cursor: "pointer",

  marginTop: "20px"
}