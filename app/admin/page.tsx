"use client"

import { useEffect, useState } from "react"

export default function AdminPage() {

  const [activeTab, setActiveTab] =
    useState("users")

  const [users, setUsers] =
    useState<any[]>([])

  const [bookings, setBookings] =
    useState<any[]>([])

  const [showCreateUser, setShowCreateUser] =
    useState(false)

  const [name, setName] =
    useState("")

  const [mobile, setMobile] =
    useState("")

  const [email, setEmail] =
    useState("")

  const [password, setPassword] =
    useState("")

  const [role, setRole] =
    useState("customer")

  const [editUserData, setEditUserData] =
    useState<any>(null)

  const [editName, setEditName] =
    useState("")

  const [editMobile, setEditMobile] =
    useState("")

  const [editEmail, setEditEmail] =
    useState("")

  const [editRole, setEditRole] =
    useState("customer")

  const [editPassword, setEditPassword] =
    useState("")

  useEffect(() => {

    getUsers()
    getBookings()

  }, [])

  const getUsers = async () => {

    try {

      const res =
        await fetch("/api/users")

      const data =
        await res.json()

      setUsers(data || [])

    } catch (err) {

      console.log(err)
    }
  }

  const getBookings = async () => {

    try {

      const res =
        await fetch(
          "/api/bookings?all=true"
        )

      const data =
        await res.json()

      setBookings(data || [])

    } catch (err) {

      console.log(err)
    }
  }

  const createUser = async () => {

    const res =
      await fetch(
        "/api/create-user",
        {

          method: "POST",

          headers: {
            "Content-Type":
              "application/json"
          },

          body: JSON.stringify({
            name,
            mobile,
            email,
            password,
            role
          })
        }
      )

    const data =
      await res.json()

    if (data.success) {

      alert("User Created")

      setShowCreateUser(false)

      getUsers()

    } else {

      alert(data.error)
    }
  }

  const editUser = (user: any) => {

    setEditUserData(user)

    setEditName(user.name || "")

    setEditMobile(user.mobile || "")

    setEditEmail(user.email || "")

    setEditRole(user.role || "customer")

    setEditPassword("")
  }

  const updateUser = async () => {

    const res =
      await fetch(
        "/api/update-user",
        {

          method: "POST",

          headers: {
            "Content-Type":
              "application/json"
          },

          body: JSON.stringify({

            id:
              editUserData.id,

            name:
              editName,

            mobile:
              editMobile,

            email:
              editEmail,

            role:
              editRole
          })
        }
      )

    const data =
      await res.json()

    if (data.success) {

      if (editPassword) {

        await fetch(
          "/api/update-password",
          {

            method: "POST",

            headers: {
              "Content-Type":
                "application/json"
            },

            body: JSON.stringify({

              userId:
                editUserData.id,

              password:
                editPassword
            })
          }
        )
      }

      alert("Updated")

      setEditUserData(null)

      getUsers()
    }
  }

  const cancelBooking =
    async (id: string) => {

      const res =
        await fetch(
          "/api/cancel-booking",
          {

            method: "POST",

            headers: {
              "Content-Type":
                "application/json"
            },

            body: JSON.stringify({
              id
            })
          }
        )

      const data =
        await res.json()

      if (data.success) {

        alert(
          "Booking Cancelled"
        )

        getBookings()
      }
    }

  return (

    <>
      {/* ── Global mobile-scroll styles injected once ── */}
      <style>{`
        * { box-sizing: border-box; }
        body { margin: 0; }

        /* Logout button visible on all screen sizes */
        .logout-btn {
          background: #dc2626;
          color: white;
          border: none;
          padding: 10px 18px;
          border-radius: 10px;
          cursor: pointer;
          font-weight: bold;
          font-size: 14px;
          white-space: nowrap;
          flex-shrink: 0;
        }
        .logout-btn:active {
          background: #b91c1c;
        }

        /* Table wrapper — horizontal scroll on mobile */
        .table-scroll-wrapper {
          width: 100%;
          overflow-x: auto;
          -webkit-overflow-scrolling: touch;
          border-radius: 12px;
        }

        /* Ensure table never shrinks below readable width */
        .table-scroll-wrapper table {
          min-width: 560px;
          width: 100%;
          border-collapse: collapse;
        }

        /* Scroll hint shadow on right edge */
        .table-scroll-wrapper {
          background:
            linear-gradient(to right, white 30%, rgba(255,255,255,0)),
            linear-gradient(to right, rgba(255,255,255,0), white 70%) 0 100%,
            radial-gradient(farthest-side at 0% 50%, rgba(0,0,0,0.12), transparent),
            radial-gradient(farthest-side at 100% 50%, rgba(0,0,0,0.12), transparent) 0 100%;
          background-repeat: no-repeat;
          background-color: white;
          background-size: 40px 100%, 40px 100%, 14px 100%, 14px 100%;
          background-position: 0 0, 100% 0, 0 0, 100% 0;
          background-attachment: local, local, scroll, scroll;
        }

        /* Responsive header flex */
        .admin-header-inner {
          display: flex;
          align-items: center;
          justify-content: space-between;
          gap: 12px;
          flex-wrap: nowrap;
        }

        /* Responsive top bar */
        .top-bar-inner {
          display: flex;
          align-items: center;
          justify-content: space-between;
          gap: 10px;
          flex-wrap: wrap;
          margin-bottom: 20px;
        }

        /* Tab container scroll on very small screens */
        .tab-container {
          display: flex;
          gap: 10px;
          margin-bottom: 20px;
          overflow-x: auto;
          -webkit-overflow-scrolling: touch;
          padding-bottom: 4px;
        }
        .tab-container::-webkit-scrollbar { display: none; }

        /* Page padding responsive */
        .page-wrap {
          min-height: 100vh;
          background: #e2e8f0;
          padding: 16px;
        }
        @media (min-width: 640px) {
          .page-wrap { padding: 24px; }
        }

        /* Popup card scroll on small screens */
        .popup-card {
          background: white;
          padding: 24px;
          border-radius: 20px;
          width: 92%;
          max-width: 600px;
          max-height: 90vh;
          overflow-y: auto;
          -webkit-overflow-scrolling: touch;
        }

        /* Form grid */
        .form-grid {
          display: grid;
          gap: 14px;
          margin-bottom: 20px;
        }

        /* Scroll hint label */
        .scroll-hint {
          font-size: 11px;
          color: #94a3b8;
          text-align: right;
          margin-bottom: 4px;
          display: none;
        }
        @media (max-width: 540px) {
          .scroll-hint { display: block; }
        }
      `}</style>

      <div className="page-wrap">

        {/* ── Header with Logout always visible ── */}
        <div style={headerStyle}>
          <div className="admin-header-inner">

            <div>
              <h1 style={headerTitle}>
                Camera Rental Admin
              </h1>
              <p style={headerSubtitle}>
                Manage users and bookings
              </p>
            </div>

            {/* Logout button — always visible on all screens */}
            <button
              className="logout-btn"
              onClick={() => {
                // Replace with your actual logout logic
                if (typeof window !== "undefined") {
                  window.location.href = "/login"
                }
              }}
            >
              🚪 Logout
            </button>

          </div>
        </div>

        {/* ── Tabs ── */}
        <div className="tab-container">

          <button
            onClick={() => setActiveTab("users")}
            style={{
              ...tabBtn,
              background: activeTab === "users" ? "#2563eb" : "#fff",
              color: activeTab === "users" ? "#fff" : "#000"
            }}
          >
            Users
          </button>

          <button
            onClick={() => setActiveTab("bookings")}
            style={{
              ...tabBtn,
              background: activeTab === "bookings" ? "#2563eb" : "#fff",
              color: activeTab === "bookings" ? "#fff" : "#000"
            }}
          >
            Bookings
          </button>

        </div>

        {/* ── Users Tab ── */}
        {activeTab === "users" && (
          <>
            <div className="top-bar-inner">
              <h2 style={sectionTitle}>Users Management</h2>
              <button
                style={createBtn}
                onClick={() => setShowCreateUser(!showCreateUser)}
              >
                + Create User
              </button>
            </div>

            {showCreateUser && (
              <div style={sectionCard}>
                <div className="form-grid">
                  <input
                    placeholder="Name"
                    onChange={(e) => setName(e.target.value)}
                    style={inputStyle}
                  />
                  <input
                    placeholder="Mobile"
                    onChange={(e) => setMobile(e.target.value)}
                    style={inputStyle}
                  />
                  <input
                    placeholder="Email"
                    onChange={(e) => setEmail(e.target.value)}
                    style={inputStyle}
                  />
                  <input
                    placeholder="Password"
                    type="password"
                    onChange={(e) => setPassword(e.target.value)}
                    style={inputStyle}
                  />
                  <select
                    onChange={(e) => setRole(e.target.value)}
                    style={inputStyle}
                  >
                    <option value="customer">Customer</option>
                    <option value="admin">Admin</option>
                  </select>
                </div>
                <button style={createBtn} onClick={createUser}>
                  Create User
                </button>
              </div>
            )}

            <div style={sectionCard}>
              {/* Scroll hint for mobile */}
              <p className="scroll-hint">← Swipe table to see more →</p>
              <div className="table-scroll-wrapper">
                <table style={tableStyle}>
                  <thead>
                    <tr>
                      <th style={thStyle}>Name</th>
                      <th style={thStyle}>Mobile</th>
                      <th style={thStyle}>Email</th>
                      <th style={thStyle}>Role</th>
                      <th style={thStyle}>Action</th>
                    </tr>
                  </thead>
                  <tbody>
                    {users.map((user: any) => (
                      <tr key={user.id}>
                        <td style={tdStyle}>{user.name}</td>
                        <td style={tdStyle}>{user.mobile}</td>
                        <td style={tdStyle}>{user.email}</td>
                        <td style={tdStyle}>{user.role}</td>
                        <td style={tdStyle}>
                          <button
                            style={editBtn}
                            onClick={() => editUser(user)}
                          >
                            Edit
                          </button>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          </>
        )}

        {/* ── Bookings Tab ── */}
        {activeTab === "bookings" && (
          <div style={sectionCard}>
            <p className="scroll-hint">← Swipe table to see more →</p>
            <div className="table-scroll-wrapper">
              <table style={tableStyle}>
                <thead>
                  <tr>
                    <th style={thStyle}>Customer</th>
                    <th style={thStyle}>Camera</th>
                    <th style={thStyle}>Date</th>
                    <th style={thStyle}>Time</th>
                    <th style={thStyle}>Action</th>
                  </tr>
                </thead>
                <tbody>
                  {bookings.map((booking: any) => (
                    <tr key={booking.id}>
                      <td style={tdStyle}>{booking.customer_name}</td>
                      <td style={tdStyle}>{booking.camera_name}</td>
                      <td style={tdStyle}>{booking.booking_date}</td>
                      <td style={tdStyle}>
                        {booking.full_day
                          ? "Full Day"
                          : `${booking.start_hour}:00 - ${booking.end_hour}:00`}
                      </td>
                      <td style={tdStyle}>
                        <button
                          style={cancelBtn}
                          onClick={() => cancelBooking(booking.id)}
                        >
                          Cancel
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        )}

        {/* ── Edit User Popup ── */}
        {editUserData && (
          <div style={popupOverlay}>
            <div className="popup-card">
              <h2 style={{ marginBottom: "16px" }}>Edit User</h2>
              <div className="form-grid">
                <input
                  value={editName}
                  onChange={(e) => setEditName(e.target.value)}
                  style={inputStyle}
                  placeholder="Name"
                />
                <input
                  value={editMobile}
                  onChange={(e) => setEditMobile(e.target.value)}
                  style={inputStyle}
                  placeholder="Mobile"
                />
                <input
                  value={editEmail}
                  onChange={(e) => setEditEmail(e.target.value)}
                  style={inputStyle}
                  placeholder="Email"
                />
                <input
                  placeholder="New Password"
                  value={editPassword}
                  onChange={(e) => setEditPassword(e.target.value)}
                  style={inputStyle}
                />
                <select
                  value={editRole}
                  onChange={(e) => setEditRole(e.target.value)}
                  style={inputStyle}
                >
                  <option value="customer">Customer</option>
                  <option value="admin">Admin</option>
                </select>
              </div>
              <div style={{ display: "flex", gap: "12px", flexWrap: "wrap" }}>
                <button style={createBtn} onClick={updateUser}>
                  Update
                </button>
                <button
                  style={cancelBtn}
                  onClick={() => setEditUserData(null)}
                >
                  Close
                </button>
              </div>
            </div>
          </div>
        )}

      </div>
    </>
  )
}

// ── Styles (unchanged from original) ──────────────────────

const headerStyle = {
  background: "#020617",
  borderRadius: "20px",
  padding: "20px 24px",
  marginBottom: "20px"
}

const headerTitle = {
  color: "white",
  fontSize: "clamp(22px, 5vw, 40px)",
  fontWeight: "bold",
  margin: 0
}

const headerSubtitle = {
  color: "#cbd5e1",
  margin: "4px 0 0 0"
}

const tabBtn = {
  border: "none",
  padding: "12px 20px",
  borderRadius: "10px",
  cursor: "pointer",
  fontWeight: "bold",
  whiteSpace: "nowrap" as const,
  flexShrink: 0
}

const sectionTitle = {
  fontSize: "clamp(18px, 4vw, 26px)",
  fontWeight: "bold",
  margin: 0
}

const createBtn = {
  background: "#16a34a",
  color: "white",
  border: "none",
  padding: "12px 18px",
  borderRadius: "10px",
  cursor: "pointer",
  fontWeight: "bold",
  whiteSpace: "nowrap" as const
}

const sectionCard = {
  background: "white",
  padding: "20px",
  borderRadius: "20px",
  marginBottom: "20px"
}

const inputStyle = {
  padding: "14px",
  border: "1px solid #cbd5e1",
  borderRadius: "10px",
  width: "100%",
  fontSize: "16px"  // prevents iOS zoom on focus
}

const tableStyle = {
  width: "100%",
  borderCollapse: "collapse" as const
}

const thStyle = {
  background: "#020617",
  color: "white",
  padding: "14px 16px",
  textAlign: "left" as const,
  whiteSpace: "nowrap" as const
}

const tdStyle = {
  padding: "14px 16px",
  borderBottom: "1px solid #e2e8f0",
  whiteSpace: "nowrap" as const
}

const editBtn = {
  background: "#2563eb",
  color: "white",
  border: "none",
  padding: "10px 16px",
  borderRadius: "10px",
  cursor: "pointer"
}

const cancelBtn = {
  background: "#ef4444",
  color: "white",
  border: "none",
  padding: "10px 16px",
  borderRadius: "10px",
  cursor: "pointer"
}

const popupOverlay = {
  position: "fixed" as const,
  top: 0,
  left: 0,
  right: 0,
  bottom: 0,
  background: "rgba(0,0,0,0.5)",
  display: "flex",
  alignItems: "center",
  justifyContent: "center",
  zIndex: 1000,
  padding: "16px"
}